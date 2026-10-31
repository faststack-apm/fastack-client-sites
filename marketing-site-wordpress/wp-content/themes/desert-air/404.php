<?php get_header(); da_page_hero('Page not found', 'That page melted in the heat. Try one of these instead.'); ?>
<section class="section"><div class="container" style="text-align:center">
	<a class="btn btn--orange" href="<?php echo esc_url(home_url('/')); ?>">Home</a>
	<a class="btn btn--navy" href="<?php echo esc_url(home_url('/contact/')); ?>">Contact us</a>
</div></section>
<?php get_footer(); ?>
