<?php get_header(); da_page_hero('Our Services', 'Complete heating, cooling and indoor air quality services for Las Vegas homes and small businesses.'); ?>
<section class="section">
	<div class="container"><?php get_template_part('template-parts/services', null, ['detailed' => true]); ?></div>
</section>
<section class="section section--soft">
	<div class="container entry"><?php while (have_posts()) : the_post(); ?><div class="entry-content"><?php the_content(); ?></div><?php endwhile; ?></div>
</section>
<?php get_template_part('template-parts/cta'); get_footer(); ?>
