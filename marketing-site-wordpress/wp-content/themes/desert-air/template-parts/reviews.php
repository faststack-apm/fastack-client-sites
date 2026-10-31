<?php $limit = $args['limit'] ?? 3; ?>
<div class="grid grid--3">
	<?php foreach (array_slice(da_reviews(), 0, $limit) as $r) : ?>
		<figure class="card review">
			<div class="review__stars" aria-label="<?php echo esc_attr($r['stars']); ?> out of 5 stars"><?php echo esc_html(str_repeat('★', $r['stars']) . str_repeat('☆', 5 - $r['stars'])); ?></div>
			<blockquote>“<?php echo esc_html($r['text']); ?>”</blockquote>
			<cite><?php echo esc_html($r['name']); ?><span><?php echo esc_html($r['place']); ?> · Google review</span></cite>
		</figure>
	<?php endforeach; ?>
</div>
