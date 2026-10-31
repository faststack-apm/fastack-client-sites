<div class="grid grid--3">
	<?php foreach (da_plans() as $p) : ?>
		<div class="card plan<?php echo $p['featured'] ? ' plan--featured' : ''; ?>">
			<?php if ($p['featured']) : ?><span class="plan__tag">Most popular</span><?php endif; ?>
			<h3><?php echo esc_html($p['name']); ?></h3>
			<div class="plan__price">$<?php echo esc_html($p['price']); ?><small><?php echo esc_html($p['period']); ?></small></div>
			<ul><?php foreach ($p['items'] as $it) : ?><li><?php echo esc_html($it); ?></li><?php endforeach; ?></ul>
			<a class="btn <?php echo $p['featured'] ? 'btn--orange' : 'btn--navy'; ?>" href="<?php echo esc_url(add_query_arg('service', 'membership', home_url('/contact/'))); ?>#contact-form">Join <?php echo esc_html($p['name']); ?></a>
		</div>
	<?php endforeach; ?>
</div>
