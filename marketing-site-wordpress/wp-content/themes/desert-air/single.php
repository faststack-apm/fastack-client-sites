<?php get_header(); while (have_posts()) : the_post(); da_page_hero(get_the_title(), get_the_date()); ?>
<section class="section"><article class="container entry"><div class="entry-content"><?php the_content(); ?></div>
<p><a class="btn btn--navy" href="<?php echo esc_url(get_permalink(get_option('page_for_posts'))); ?>">← All articles</a></p></article></section>
<?php endwhile; get_template_part('template-parts/cta'); get_footer(); ?>
