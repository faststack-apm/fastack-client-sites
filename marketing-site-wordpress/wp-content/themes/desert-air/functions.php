<?php
/**
 * Desert Air HVAC theme.
 */
defined('ABSPATH') || exit;

require_once __DIR__ . '/inc/content.php';
require_once __DIR__ . '/inc/leads.php';

add_action('after_setup_theme', function () {
	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
	register_nav_menus(['primary' => 'Primary menu', 'footer' => 'Footer menu']);
});

add_action('wp_enqueue_scripts', function () {
	$ver = wp_get_theme()->get('Version');
	wp_enqueue_style('desert-air-fonts', 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Open+Sans:wght@400;600&display=swap', [], null);
	wp_enqueue_style('desert-air', get_stylesheet_uri(), ['desert-air-fonts'], $ver);
	wp_enqueue_script('desert-air', get_template_directory_uri() . '/assets/site.js', [], $ver, ['strategy' => 'defer', 'in_footer' => true]);
});

// Business details in the Customizer.
add_action('customize_register', function (WP_Customize_Manager $c) {
	$c->add_section('da_business', ['title' => 'Business details', 'priority' => 30]);
	foreach (['da_phone' => 'Phone', 'da_email' => 'Email', 'da_address' => 'Address', 'da_hours' => 'Hours'] as $id => $label) {
		$c->add_setting($id, ['sanitize_callback' => 'sanitize_text_field']);
		$c->add_control($id, ['label' => $label, 'section' => 'da_business']);
	}
});

/** Fallback menu when none is assigned yet. */
function da_fallback_menu(): void {
	echo '<ul>';
	foreach (['services' => 'Services', 'pricing' => 'Pricing', 'about' => 'About', 'reviews' => 'Reviews', 'faq' => 'FAQ', 'blog' => 'Blog', 'contact' => 'Contact'] as $slug => $label) {
		printf('<li><a href="%s">%s</a></li>', esc_url(home_url("/$slug/")), esc_html($label));
	}
	echo '</ul>';
}

/** LocalBusiness structured data for SEO. */
add_action('wp_head', function () {
	$b = da_business();
	$schema = [
		'@context' => 'https://schema.org', '@type' => 'HVACBusiness', 'name' => $b['name'], 'telephone' => $b['phone'],
		'email' => $b['email'], 'address' => $b['address'], 'openingHours' => 'Mo-Sa 07:00-19:00', 'url' => home_url('/'),
		'areaServed' => 'Las Vegas, NV', 'aggregateRating' => ['@type' => 'AggregateRating', 'ratingValue' => '4.9', 'reviewCount' => '1287'],
	];
	echo '<script type="application/ld+json">' . wp_json_encode($schema) . "</script>\n";
});

function da_page_hero(string $title, string $intro = ''): void {
	get_template_part('template-parts/page-hero', null, ['title' => $title, 'intro' => $intro]);
}
