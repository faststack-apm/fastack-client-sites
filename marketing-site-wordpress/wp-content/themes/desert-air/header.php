<?php $b = da_business(); ?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="screen-reader-text" href="#main">Skip to content</a>
<div class="topbar">
	<div class="container">
		<span>📍 <?php echo esc_html($b['address']); ?></span>
		<span class="topbar__hours">🕒 <?php echo esc_html($b['hours']); ?></span>
		<span class="topbar__emergency">24/7 Emergency: <a href="<?php echo esc_attr(da_tel()); ?>"><?php echo esc_html($b['phone']); ?></a></span>
	</div>
</div>
<header class="site-header">
	<div class="container">
		<a class="brand" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php echo esc_attr($b['name']); ?> home">
			<span class="brand__mark">DA</span>
			<span class="brand__name">Desert Air<small>Heating &amp; Cooling</small></span>
		</a>
		<button class="nav-toggle" aria-controls="primary-nav" aria-expanded="false" aria-label="Menu">☰</button>
		<nav id="primary-nav" class="primary-nav" aria-label="Primary">
			<?php wp_nav_menu(['theme_location' => 'primary', 'container' => false, 'fallback_cb' => 'da_fallback_menu', 'depth' => 1]); ?>
		</nav>
		<a class="btn btn--orange header-cta" href="<?php echo esc_url(home_url('/contact/')); ?>">Book Service</a>
	</div>
</header>
<main id="main">
