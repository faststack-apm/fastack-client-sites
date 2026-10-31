<?php
/**
 * Lead-capture form. $args: compact (bool) for the hero quote card, source (string).
 */
[$errors, $old] = da_form_state();
$compact = !empty($args['compact']);
$source  = $args['source'] ?? 'contact';
$sent    = isset($_GET['sent']);
$val     = fn($k) => esc_attr($old[$k] ?? '');
$selected = $old['service'] ?? (isset($_GET['service']) ? sanitize_key(wp_unslash($_GET['service'])) : '');
?>
<div id="<?php echo $compact ? 'quote-form' : 'contact-form'; ?>">
	<?php if ($sent && !$compact) : ?>
		<div class="notice notice--ok" role="status"><strong>Thanks! Your request is in.</strong> A comfort advisor will call you within one business hour.</div>
	<?php endif; ?>
	<?php if ($errors && !$compact) : ?>
		<div class="notice notice--err" role="alert"><strong>Please fix the following:</strong><ul><?php foreach ($errors as $e) : ?><li><?php echo esc_html($e); ?></li><?php endforeach; ?></ul></div>
	<?php endif; ?>
	<form class="da-form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" novalidate>
		<input type="hidden" name="action" value="da_contact">
		<input type="hidden" name="source" value="<?php echo esc_attr($source); ?>">
		<?php wp_nonce_field('da_contact', 'da_nonce'); ?>
		<label class="hp" aria-hidden="true">Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
		<div class="row">
			<label>Full name *<input name="name" required autocomplete="name" value="<?php echo $val('name'); ?>"></label>
			<label>Phone *<input name="phone" type="tel" required autocomplete="tel" value="<?php echo $val('phone'); ?>"></label>
		</div>
		<label>Email *<input name="email" type="email" required autocomplete="email" value="<?php echo $val('email'); ?>"></label>
		<div class="row">
			<label>Service needed *
				<select name="service" required>
					<option value="">Choose a service…</option>
					<?php foreach (da_service_options() as $k => $label) : ?>
						<option value="<?php echo esc_attr($k); ?>" <?php selected($selected, $k); ?>><?php echo esc_html($label); ?></option>
					<?php endforeach; ?>
				</select>
			</label>
			<label>ZIP code<input name="zip" inputmode="numeric" maxlength="5" autocomplete="postal-code" value="<?php echo $val('zip'); ?>"></label>
		</div>
		<?php if (!$compact) : ?>
			<label>Preferred date<input name="preferred_date" type="date" min="<?php echo esc_attr(wp_date('Y-m-d')); ?>" value="<?php echo $val('preferred_date'); ?>"></label>
			<label>How can we help?<textarea name="message" rows="5" placeholder="Tell us what's going on with your system…"><?php echo esc_textarea($old['message'] ?? ''); ?></textarea></label>
			<label class="consent"><input type="checkbox" name="consent" value="1" checked> Text me appointment updates. Msg &amp; data rates may apply.</label>
		<?php endif; ?>
		<button class="btn btn--orange" type="submit"><?php echo $compact ? 'Get my free quote' : 'Request service'; ?></button>
	</form>
</div>
