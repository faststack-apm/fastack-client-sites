<?php get_header(); da_page_hero(is_home() ? 'HVAC Tips & News' : get_the_archive_title(), 'Advice from our technicians on staying comfortable — and saving money — in the desert.'); ?>
<section class="section section--soft">
	<div class="container">
		<?php if (have_posts()) : ?>
			<div class="grid grid--3">
				<?php while (have_posts()) : the_post(); ?>
					<article class="card post-card">
						<time datetime="<?php echo esc_attr(get_the_date('c')); ?>"><?php echo esc_html(get_the_date()); ?></time>
						<h3><a href="<?php the_permalink(); ?>" style="text-decoration:none"><?php the_title(); ?></a></h3>
						<p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 24)); ?></p>
						<a class="card__link" href="<?php the_permalink(); ?>">Read more →</a>
					</article>
				<?php endwhile; ?>
			</div>
			<div style="margin-top:2rem"><?php the_posts_pagination(); ?></div>
		<?php else : ?>
			<p>No posts yet.</p>
		<?php endif; ?>
	</div>
</section>
<?php get_footer(); ?>
