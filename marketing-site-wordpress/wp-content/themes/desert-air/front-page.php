<?php get_header(); $b = da_business(); [$errors] = da_form_state(); ?>
<section class="hero">
	<div class="container">
		<div>
			<p class="eyebrow">Las Vegas' trusted HVAC team</p>
			<h1>Cool comfort, even at 115°.</h1>
			<p class="hero__lead">Fast, honest AC repair, heating service and new system installs across the Las Vegas valley. Up-front pricing, licensed technicians and same-day appointments.</p>
			<div class="hero__actions">
				<a class="btn btn--orange" href="<?php echo esc_url(home_url('/contact/')); ?>">Book a technician</a>
				<a class="btn btn--outline" href="<?php echo esc_attr(da_tel()); ?>">📞 <?php echo esc_html($b['phone']); ?></a>
			</div>
			<ul class="hero__badges"><li>Same-day service</li><li>Up-front pricing</li><li>NATE-certified techs</li><li>0% financing</li></ul>
		</div>
		<div class="quote-card">
			<h2>Get a free estimate</h2>
			<p>Tell us what you need — we'll call you back in under an hour.</p>
			<?php if (isset($_GET['sent'])) : ?>
				<div class="notice notice--ok">Thanks! We'll call you shortly.</div>
			<?php elseif ($errors) : ?>
				<div class="notice notice--err"><?php echo esc_html(implode(' ', $errors)); ?></div>
			<?php endif; ?>
			<?php get_template_part('template-parts/contact-form', null, ['compact' => true, 'source' => 'home-hero']); ?>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">What we do</p>
			<h2>Heating &amp; cooling services</h2>
			<p>From emergency AC repair to whole-home comfort upgrades, one call handles it all.</p>
		</div>
		<?php get_template_part('template-parts/services'); ?>
	</div>
</section>

<section class="section section--navy">
	<div class="container">
		<div class="stats">
			<div class="stat"><strong>25+</strong><span>Years in Las Vegas</span></div>
			<div class="stat"><strong>40k</strong><span>Systems serviced</span></div>
			<div class="stat"><strong>4.9★</strong><span>1,287 Google reviews</span></div>
			<div class="stat"><strong>90 min</strong><span>Average response time</span></div>
		</div>
	</div>
</section>

<section class="section">
	<div class="container grid grid--2" style="align-items:center">
		<div>
			<p class="eyebrow">How it works</p>
			<h2>Comfort restored in three easy steps</h2>
			<div class="grid steps" style="margin-top:1.5rem">
				<div class="step"><h3>Book online or call</h3><p>Pick a time that works — same-day slots open every morning.</p></div>
				<div class="step"><h3>Get an up-front price</h3><p>Your technician diagnoses the problem and quotes a flat rate before any work starts.</p></div>
				<div class="step"><h3>Relax, it's fixed</h3><p>Most repairs are completed on the first visit, backed by our 1-year workmanship guarantee.</p></div>
			</div>
		</div>
		<div class="card" style="background:var(--ice-soft);border:0">
			<p class="eyebrow">Members save more</p>
			<h3>Join the Comfort Club for $24/mo</h3>
			<p>Two tune-ups a year, priority service, 15% off repairs and free filters delivered to your door.</p>
			<a class="btn btn--navy" href="<?php echo esc_url(home_url('/pricing/')); ?>">Compare plans</a>
		</div>
	</div>
</section>

<section class="section section--soft">
	<div class="container">
		<div class="section-head">
			<p class="eyebrow">Reviews</p>
			<h2>Neighbors who beat the heat</h2>
		</div>
		<?php get_template_part('template-parts/reviews', null, ['limit' => 3]); ?>
		<p style="text-align:center;margin-top:2rem"><a class="btn btn--navy" href="<?php echo esc_url(home_url('/reviews/')); ?>">Read more reviews</a></p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="section-head"><p class="eyebrow">FAQ</p><h2>Questions? We've got answers.</h2></div>
		<?php get_template_part('template-parts/faq', null, ['limit' => 4]); ?>
	</div>
</section>

<?php get_template_part('template-parts/cta'); ?>
<?php get_footer(); ?>
