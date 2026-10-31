<?php $detailed = !empty($args['detailed']); ?>
<div class="grid grid--3">
	<?php foreach (da_services() as $slug => $s) : ?>
		<article class="card card--<?php echo esc_attr($s['type']); ?>" id="<?php echo esc_attr($slug); ?>">
			<div class="card__icon" aria-hidden="true"><?php echo esc_html($s['icon']); ?></div>
			<h3><?php echo esc_html($s['title']); ?></h3>
			<p><?php echo esc_html($s['summary']); ?></p>
			<?php if ($detailed) : ?>
				<ul><?php foreach ($s['points'] as $pt) : ?><li><?php echo esc_html($pt); ?></li><?php endforeach; ?></ul>
				<a class="card__link" href="<?php echo esc_url(add_query_arg('service', $slug, home_url('/contact/'))); ?>#contact-form">Request this service →</a>
			<?php else : ?>
				<a class="card__link" href="<?php echo esc_url(home_url("/services/#$slug")); ?>">Learn more →</a>
			<?php endif; ?>
		</article>
	<?php endforeach; ?>
</div>
