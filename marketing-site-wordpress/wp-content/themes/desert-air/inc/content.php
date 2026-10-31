<?php
/**
 * Business details and structured marketing content used across templates.
 * Phone/email/address can be overridden in Appearance → Customize → Business details.
 */
defined('ABSPATH') || exit;

function da_business(): array {
	return [
		'name'      => 'Desert Air Heating & Cooling',
		'phone'     => get_theme_mod('da_phone', '(702) 555-0147'),
		'email'     => get_theme_mod('da_email', 'service@desertair.example'),
		'address'   => get_theme_mod('da_address', '4120 W Sahara Ave, Las Vegas, NV 89102'),
		'hours'     => get_theme_mod('da_hours', 'Mon–Sat 7am–7pm'),
		'license'   => 'NV Contractor Lic. #0081234',
		'area'      => 'Las Vegas · Henderson · Summerlin · North Las Vegas · Boulder City',
	];
}

function da_tel(): string {
	return 'tel:' . preg_replace('/[^0-9+]/', '', da_business()['phone']);
}

function da_services(): array {
	return [
		'ac-repair' => ['icon' => '❄️', 'type' => 'cool', 'title' => 'AC Repair', 'summary' => 'Same-day diagnostics and repair for every major brand — when it\'s 115° outside, we move fast.',
			'points' => ['Refrigerant leak detection & recharge', 'Capacitor, contactor & fan motor replacement', 'Frozen coil & airflow troubleshooting']],
		'ac-installation' => ['icon' => '🏠', 'type' => 'cool', 'title' => 'AC Installation & Replacement', 'summary' => 'High-efficiency SEER2 systems sized correctly for desert heat, with financing available.',
			'points' => ['Free in-home load calculation', '10-year parts & labor warranty', 'Utility rebate paperwork handled']],
		'heating' => ['icon' => '🔥', 'type' => 'heat', 'title' => 'Heating & Heat Pumps', 'summary' => 'Furnace and heat-pump repair, tune-ups and installs to keep chilly desert nights comfortable.',
			'points' => ['Gas furnace safety inspections', 'Heat-pump defrost & reversing valve repair', 'Carbon-monoxide testing']],
		'maintenance' => ['icon' => '🛠️', 'type' => 'cool', 'title' => 'Preventive Maintenance', 'summary' => 'Twice-yearly tune-ups that cut energy bills and catch problems before summer peaks.',
			'points' => ['21-point inspection', 'Coil cleaning & condensate flush', 'Priority scheduling for members']],
		'indoor-air-quality' => ['icon' => '🌬️', 'type' => 'cool', 'title' => 'Indoor Air Quality', 'summary' => 'Filtration, UV purification and humidification to fight desert dust and dry air.',
			'points' => ['MERV-13 media filters', 'UV-C coil purifiers', 'Whole-home humidifiers']],
		'ductwork' => ['icon' => '📐', 'type' => 'heat', 'title' => 'Ductwork & Sealing', 'summary' => 'Leaky attic ducts can waste 30% of your cooling. We test, seal and replace.',
			'points' => ['Duct leakage testing', 'Aeroseal duct sealing', 'Attic insulation upgrades']],
	];
}

function da_plans(): array {
	return [
		['name' => 'Basic', 'price' => '14', 'period' => '/mo', 'featured' => false, 'items' => ['1 AC tune-up per year', '10% off repairs', 'No overtime charges', 'Filter reminders']],
		['name' => 'Comfort Club', 'price' => '24', 'period' => '/mo', 'featured' => true, 'items' => ['AC + heating tune-ups', '15% off repairs', 'Priority same-day service', 'Free MERV-13 filters', 'No overtime charges']],
		['name' => 'Total Care', 'price' => '39', 'period' => '/mo', 'featured' => false, 'items' => ['Everything in Comfort Club', '20% off repairs', 'Free annual duct inspection', 'Covered refrigerant top-off', '24/7 emergency — no trip fee']],
	];
}

function da_price_list(): array {
	return [
		['Diagnostic / service call', '$89 (waived with repair)'],
		['AC tune-up', '$129'],
		['Furnace tune-up', '$119'],
		['Capacitor replacement', 'from $189'],
		['Refrigerant recharge (R-410A)', 'from $249'],
		['New AC system (installed)', 'from $6,900'],
	];
}

function da_reviews(): array {
	return [
		['name' => 'Maria G.', 'place' => 'Summerlin', 'stars' => 5, 'text' => 'Our AC died on a 113° Saturday. Desert Air had a tech here in two hours and we were cool by dinner. Honest pricing, no upsell.'],
		['name' => 'James P.', 'place' => 'Henderson', 'stars' => 5, 'text' => 'Replaced our 20-year-old unit with a heat pump. Power bill dropped almost 40% the first summer. Crew was spotless.'],
		['name' => 'Tasha R.', 'place' => 'North Las Vegas', 'stars' => 5, 'text' => 'The Comfort Club membership has paid for itself. They remind me about tune-ups and always show up on time.'],
		['name' => 'Dev K.', 'place' => 'Spring Valley', 'stars' => 4, 'text' => 'Great communication, texted me when the tech was on the way. Found a duct leak two other companies missed.'],
		['name' => 'Linda S.', 'place' => 'Boulder City', 'stars' => 5, 'text' => 'Furnace safety check found a cracked heat exchanger. Grateful they caught it before winter.'],
		['name' => 'Rob A.', 'place' => 'Enterprise', 'stars' => 5, 'text' => 'Fair quote, financing approved in minutes, install done in one day. Highly recommend.'],
	];
}

function da_faqs(): array {
	return [
		['q' => 'How quickly can you get to my home?', 'a' => 'Most repair calls in the Las Vegas valley are answered the same day. Comfort Club and Total Care members get priority dispatch, and we run 24/7 emergency service during summer.'],
		['q' => 'How often should my AC be serviced in Las Vegas?', 'a' => 'Twice a year: cooling in spring before the heat arrives and heating in the fall. Desert dust clogs coils and filters quickly, so regular tune-ups make a big difference in efficiency.'],
		['q' => 'Do you offer financing on new systems?', 'a' => 'Yes. We offer 0% APR for 18 months and low monthly payment plans for up to 10 years, subject to credit approval.'],
		['q' => 'What brands do you service?', 'a' => 'All major brands, including Carrier, Trane, Lennox, Goodman, Rheem, Daikin and American Standard.'],
		['q' => 'Is the diagnostic fee applied to the repair?', 'a' => 'Yes. Our $89 diagnostic fee is waived when you approve the repair, and you always get an up-front, flat-rate price before we start.'],
		['q' => 'Are you licensed and insured?', 'a' => 'Absolutely — we are a Nevada licensed contractor, fully insured, and every technician is NATE-certified and background-checked.'],
	];
}

/** Options for the "service needed" dropdown on the contact form. */
function da_service_options(): array {
	$opts = [];
	foreach (da_services() as $slug => $s) {
		$opts[$slug] = $s['title'];
	}
	$opts['membership'] = 'Maintenance plan / membership';
	$opts['other'] = 'Something else';
	return $opts;
}
