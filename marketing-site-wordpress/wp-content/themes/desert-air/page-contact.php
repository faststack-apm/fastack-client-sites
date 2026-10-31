<?php get_header(); $b = da_business(); da_page_hero('Contact & Scheduling', 'Request service online, or call us — a real person answers 24/7.'); ?>
<section class="section">
	<div class="container contact-grid">
		<div>
			<h2>Request service</h2>
			<p style="color:var(--muted)">Fill out the form and a comfort advisor will call to confirm your appointment.</p>
			<?php get_template_part('template-parts/contact-form', null, ['source' => 'contact-page']); ?>
		</div>
		<aside class="contact-info">
			<h3>Desert Air Heating &amp; Cooling</h3>
			<dl>
				<dt>Phone</dt><dd><a href="<?php echo esc_attr(da_tel()); ?>"><?php echo esc_html($b['phone']); ?></a></dd>
				<dt>Email</dt><dd><a href="mailto:<?php echo esc_attr($b['email']); ?>"><?php echo esc_html($b['email']); ?></a></dd>
				<dt>Office</dt><dd><?php echo esc_html($b['address']); ?></dd>
				<dt>Hours</dt><dd><?php echo esc_html($b['hours']); ?><br>Emergency service 24/7</dd>
				<dt>Service area</dt><dd><?php echo esc_html($b['area']); ?></dd>
			</dl>
			<iframe class="map-embed" title="Map" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=-115.27%2C36.12%2C-115.17%2C36.17&amp;layer=mapnik"></iframe>
		</aside>
	</div>
</section>
<?php get_footer(); ?>
