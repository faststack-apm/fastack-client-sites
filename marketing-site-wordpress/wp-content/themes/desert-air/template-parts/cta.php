<?php $b = da_business(); ?>
<section class="cta-band">
	<div class="container">
		<div>
			<h2>AC out? We're on our way.</h2>
			<p>Same-day service across the Las Vegas valley — 24/7 in summer.</p>
		</div>
		<div style="display:flex;gap:.8rem;flex-wrap:wrap">
			<a class="btn btn--navy" href="<?php echo esc_attr(da_tel()); ?>">📞 <?php echo esc_html($b['phone']); ?></a>
			<a class="btn btn--outline" href="<?php echo esc_url(home_url('/contact/')); ?>">Schedule online</a>
		</div>
	</div>
</section>
