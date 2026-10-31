<?php get_header(); da_page_hero('Pricing & Maintenance Plans', 'Flat-rate pricing you can see before we start — and memberships that pay for themselves.'); ?>
<section class="section">
	<div class="container">
		<div class="section-head"><p class="eyebrow">Memberships</p><h2>Pick your comfort plan</h2><p>Cancel anytime. Every plan includes no overtime charges.</p></div>
		<?php get_template_part('template-parts/plans'); ?>
	</div>
</section>
<section class="section section--soft">
	<div class="container entry">
		<h2>Common service prices</h2>
		<table class="price-table">
			<thead><tr><th>Service</th><th>Price</th></tr></thead>
			<tbody><?php foreach (da_price_list() as [$name, $price]) : ?><tr><td><?php echo esc_html($name); ?></td><td><?php echo esc_html($price); ?></td></tr><?php endforeach; ?></tbody>
		</table>
		<p class="small" style="color:var(--muted);margin-top:1rem">Prices are typical starting points; your technician will confirm a flat rate before work begins.</p>
	</div>
</section>
<?php get_template_part('template-parts/cta'); get_footer(); ?>
