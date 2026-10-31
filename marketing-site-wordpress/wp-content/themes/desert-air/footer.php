<?php $b = da_business(); ?>
</main>
<footer class="site-footer">
	<div class="container grid">
		<div>
			<h4><?php echo esc_html($b['name']); ?></h4>
			<p>Family-owned and keeping Southern Nevada comfortable since 1998. <?php echo esc_html($b['license']); ?>.</p>
			<p><strong>Service area:</strong> <?php echo esc_html($b['area']); ?></p>
		</div>
		<div>
			<h4>Services</h4>
			<ul>
				<?php foreach (da_services() as $slug => $s) : ?>
					<li><a href="<?php echo esc_url(home_url("/services/#$slug")); ?>"><?php echo esc_html($s['title']); ?></a></li>
				<?php endforeach; ?>
			</ul>
		</div>
		<div>
			<h4>Company</h4>
			<?php wp_nav_menu(['theme_location' => 'footer', 'container' => false, 'fallback_cb' => 'da_fallback_menu', 'depth' => 1]); ?>
		</div>
		<div>
			<h4>Contact</h4>
			<ul>
				<li><a href="<?php echo esc_attr(da_tel()); ?>"><?php echo esc_html($b['phone']); ?></a></li>
				<li><a href="mailto:<?php echo esc_attr($b['email']); ?>"><?php echo esc_html($b['email']); ?></a></li>
				<li><?php echo esc_html($b['address']); ?></li>
				<li><?php echo esc_html($b['hours']); ?> · 24/7 emergency</li>
			</ul>
		</div>
	</div>
	<div class="footer-base">
		<div class="container">
			<span>© <?php echo esc_html(gmdate('Y') . ' ' . $b['name']); ?>. All rights reserved.</span>
			<span>Demo marketing site</span>
		</div>
	</div>
</footer>
<a class="call-fab" href="<?php echo esc_attr(da_tel()); ?>" aria-label="Call <?php echo esc_attr($b['phone']); ?>">📞</a>
<?php wp_footer(); ?>
</body>
</html>
