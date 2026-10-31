<?php
/**
 * Contact-form handling: validation, storage as a private "Lead" post type, and email notification.
 * Forms POST to admin-post.php?action=da_contact and are redirected back with a status.
 */
defined('ABSPATH') || exit;

add_action('init', function () {
	register_post_type('da_lead', [
		'labels' => ['name' => 'Leads', 'singular_name' => 'Lead', 'menu_name' => 'Leads', 'all_items' => 'All leads', 'edit_item' => 'View lead'],
		'public' => false,
		'show_ui' => true,
		'show_in_menu' => true,
		'menu_icon' => 'dashicons-email-alt',
		'menu_position' => 25,
		'supports' => ['title', 'editor', 'custom-fields'],
		'capability_type' => 'post',
		'capabilities' => ['create_posts' => 'do_not_allow'],
		'map_meta_cap' => true,
	]);
});

add_action('admin_post_nopriv_da_contact', 'da_handle_contact');
add_action('admin_post_da_contact', 'da_handle_contact');

function da_handle_contact(): void {
	$back = wp_get_referer() ?: home_url('/contact/');
	$back = remove_query_arg(['sent', 'errors'], $back);

	if (!isset($_POST['da_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['da_nonce'])), 'da_contact')) {
		da_redirect_errors($back, ['Your session expired. Please submit the form again.']);
	}
	// Honeypot: bots fill hidden fields; pretend success.
	if (!empty($_POST['website'])) {
		wp_safe_redirect(add_query_arg('sent', '1', $back) . '#contact-form');
		exit;
	}

	$data = [
		'name'      => sanitize_text_field(wp_unslash($_POST['name'] ?? '')),
		'email'     => sanitize_email(wp_unslash($_POST['email'] ?? '')),
		'phone'     => sanitize_text_field(wp_unslash($_POST['phone'] ?? '')),
		'zip'       => sanitize_text_field(wp_unslash($_POST['zip'] ?? '')),
		'service'   => sanitize_key(wp_unslash($_POST['service'] ?? '')),
		'preferred' => sanitize_text_field(wp_unslash($_POST['preferred_date'] ?? '')),
		'message'   => sanitize_textarea_field(wp_unslash($_POST['message'] ?? '')),
		'source'    => sanitize_text_field(wp_unslash($_POST['source'] ?? 'contact')),
	];

	$errors = [];
	if ($data['name'] === '') $errors[] = 'Please enter your name.';
	if (!is_email($data['email'])) $errors[] = 'Please enter a valid email address.';
	if (!preg_match('/^[0-9()+\-. ]{7,20}$/', $data['phone'])) $errors[] = 'Please enter a valid phone number.';
	if (!array_key_exists($data['service'], da_service_options())) $errors[] = 'Please choose the service you need.';
	if ($data['zip'] !== '' && !preg_match('/^\d{5}$/', $data['zip'])) $errors[] = 'ZIP code should be 5 digits.';
	if ($data['preferred'] !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['preferred'])) $errors[] = 'Preferred date is invalid.';
	if ($errors) da_redirect_errors($back, $errors);

	$service = da_service_options()[$data['service']];
	$lead_id = wp_insert_post([
		'post_type'    => 'da_lead',
		'post_status'  => 'private',
		'post_title'   => sprintf('%s — %s', $data['name'], $service),
		'post_content' => $data['message'],
	], true);
	if (is_wp_error($lead_id)) {
		da_redirect_errors($back, ['Sorry, we could not save your request. Please call us instead.']);
	}
	foreach ($data as $key => $value) {
		update_post_meta($lead_id, "da_$key", $value);
	}
	update_post_meta($lead_id, 'da_ip', sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? ''));

	$body = "New service request from the website\n\n"
		. "Name: {$data['name']}\nEmail: {$data['email']}\nPhone: {$data['phone']}\nZIP: {$data['zip']}\n"
		. "Service: $service\nPreferred date: {$data['preferred']}\nSource: {$data['source']}\n\n{$data['message']}\n\n"
		. 'View in admin: ' . admin_url("post.php?post=$lead_id&action=edit");
	wp_mail(get_option('admin_email'), "New lead: {$data['name']} ($service)", $body, ["Reply-To: {$data['name']} <{$data['email']}>"]);
	wp_mail($data['email'], 'We received your request — ' . da_business()['name'],
		"Hi {$data['name']},\n\nThanks for contacting Desert Air! A comfort advisor will call you at {$data['phone']} within one business hour.\n\nNeed help right now? Call " . da_business()['phone'] . ".\n\n— The Desert Air team");

	do_action('da_lead_created', $lead_id, $data);
	wp_safe_redirect(add_query_arg('sent', '1', $back) . '#contact-form');
	exit;
}

function da_redirect_errors(string $back, array $errors): void {
	$key = 'da_err_' . wp_generate_password(12, false);
	set_transient($key, ['errors' => $errors, 'old' => array_map('sanitize_text_field', wp_unslash($_POST))], 5 * MINUTE_IN_SECONDS);
	wp_safe_redirect(add_query_arg('errors', $key, $back) . '#contact-form');
	exit;
}

/** Returns [errors[], old_input[]] for the current request, if a failed submission redirected here. */
function da_form_state(): array {
	$key = isset($_GET['errors']) ? sanitize_key(wp_unslash($_GET['errors'])) : '';
	if (!$key || !str_starts_with($key, 'da_err_')) return [[], []];
	$state = get_transient($key);
	return $state ? [$state['errors'], $state['old']] : [[], []];
}

// Admin list columns.
add_filter('manage_da_lead_posts_columns', function ($cols) {
	return ['cb' => $cols['cb'], 'title' => 'Lead', 'da_email' => 'Email', 'da_phone' => 'Phone', 'da_preferred' => 'Preferred date', 'da_source' => 'Form', 'date' => 'Received'];
});
add_action('manage_da_lead_posts_custom_column', function ($col, $post_id) {
	echo esc_html((string) get_post_meta($post_id, $col, true));
}, 10, 2);

// Route outgoing mail to the SMTP catcher (Mailpit) configured in docker-compose.
add_action('phpmailer_init', function ($mailer) {
	if (!defined('DESERT_AIR_SMTP_HOST') || !DESERT_AIR_SMTP_HOST) return;
	$mailer->isSMTP();
	$mailer->Host = DESERT_AIR_SMTP_HOST;
	$mailer->Port = (int) DESERT_AIR_SMTP_PORT;
	$mailer->SMTPAuth = false;
	$mailer->SMTPAutoTLS = false;
});
add_filter('wp_mail_from', fn() => 'no-reply@desertair.example');
add_filter('wp_mail_from_name', fn() => 'Desert Air Website');
