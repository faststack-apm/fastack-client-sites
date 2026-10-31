<?php get_header(); while (have_posts()) : the_post(); da_page_hero(get_the_title()); ?>
<section class="section"><div class="container entry"><div class="entry-content"><?php the_content(); ?></div></div></section>
<?php endwhile; get_template_part('template-parts/cta'); get_footer(); ?>
