<div class="faq">
	<?php foreach (array_slice(da_faqs(), 0, $args['limit'] ?? 99) as $i => $f) : ?>
		<details <?php echo $i === 0 ? 'open' : ''; ?>>
			<summary><?php echo esc_html($f['q']); ?></summary>
			<div><?php echo esc_html($f['a']); ?></div>
		</details>
	<?php endforeach; ?>
</div>
