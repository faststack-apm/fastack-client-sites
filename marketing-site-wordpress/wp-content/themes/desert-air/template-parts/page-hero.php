<section class="page-hero">
	<div class="container">
		<div class="crumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a> / <?php echo esc_html($args['title']); ?></div>
		<h1><?php echo esc_html($args['title']); ?></h1>
		<?php if (!empty($args['intro'])) : ?><p><?php echo esc_html($args['intro']); ?></p><?php endif; ?>
	</div>
</section>
