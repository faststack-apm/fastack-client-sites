<?php get_header(); da_page_hero('Customer Reviews', 'Rated 4.9 stars by more than 1,200 Southern Nevada homeowners.'); ?>
<section class="section section--soft">
	<div class="container">
		<div class="rating-summary">
			<div><strong>4.9★</strong>Google</div>
			<div><strong>A+</strong>BBB rating</div>
			<div><strong>4.8★</strong>Yelp</div>
		</div>
		<?php get_template_part('template-parts/reviews', null, ['limit' => 99]); ?>
	</div>
</section>
<?php get_template_part('template-parts/cta'); get_footer(); ?>
