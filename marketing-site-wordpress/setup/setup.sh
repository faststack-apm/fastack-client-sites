#!/bin/sh
# One-shot, idempotent site setup run by the `setup` service (wp-cli).
set -e
cd /var/www/html

echo "Waiting for WordPress files and database..."
i=0
until [ -f wp-config.php ] && wp db check >/dev/null 2>&1; do
  i=$((i + 1)); [ "$i" -gt 90 ] && { echo "Timed out waiting for WordPress"; exit 1; }
  sleep 2
done

if ! wp core is-installed 2>/dev/null; then
  wp core install --url="$SITE_URL" --title="Desert Air Heating & Cooling" \
    --admin_user="$ADMIN_USER" --admin_password="$ADMIN_PASSWORD" --admin_email="$ADMIN_EMAIL" --skip-email
fi

wp option update blogdescription "Las Vegas AC repair, heating & air quality"
wp option update timezone_string "America/Los_Angeles"
wp option update default_comment_status closed
wp rewrite structure '/%postname%/' --hard
wp theme activate desert-air
wp plugin delete akismet hello >/dev/null 2>&1 || true
wp theme delete twentytwentythree twentytwentyfour >/dev/null 2>&1 || true

# create_page <slug> <title> <content>  -> prints page ID (creates only if missing)
create_page() {
  id=$(wp post list --post_type=page --name="$1" --field=ID --posts_per_page=1)
  if [ -z "$id" ]; then
    id=$(wp post create --post_type=page --post_status=publish --post_name="$1" --post_title="$2" --post_content="$3" --porcelain)
  fi
  echo "$id"
}

HOME_ID=$(create_page home "Home" "")
SERVICES_ID=$(create_page services "Services" "<h2>Why Las Vegas homeowners choose Desert Air</h2><p>Every visit starts with a full system check and an up-front, flat-rate quote. We stock the most common parts on every truck, so most repairs are completed on the first visit.</p><p>Not sure what you need? Call us and a comfort advisor will help you decide between repair and replacement — no pressure, ever.</p>")
PRICING_ID=$(create_page pricing "Pricing" "")
ABOUT_ID=$(create_page about "About Us" "<h2>Family-owned since 1998</h2><p>Desert Air Heating &amp; Cooling started with one truck and a promise: treat every home like our own. Today our team of 40 NATE-certified technicians serves more than 6,000 households across the Las Vegas valley.</p><h3>Our promise</h3><ul><li>Up-front, flat-rate pricing — no surprises</li><li>On-time arrival or your diagnostic is free</li><li>1-year workmanship guarantee on every repair</li><li>Background-checked, drug-tested technicians</li></ul><h3>Community</h3><p>Each summer we donate AC tune-ups to seniors and veterans through our Cool Neighbors program.</p>")
REVIEWS_ID=$(create_page reviews "Reviews" "")
FAQ_ID=$(create_page faq "FAQ" "")
CONTACT_ID=$(create_page contact "Contact" "")
BLOG_ID=$(create_page blog "Blog" "")

wp option update show_on_front page
wp option update page_on_front "$HOME_ID"
wp option update page_for_posts "$BLOG_ID"

# Sample blog posts
if [ "$(wp post list --post_type=post --format=count)" -le 1 ]; then
  wp post delete 1 --force >/dev/null 2>&1 || true
  wp post create --post_status=publish --post_title="5 Ways to Lower Your Summer Power Bill in Las Vegas" --post_date="2026-06-02 09:00:00" \
    --post_content="<p>Set your thermostat to 78°F when you're home, change filters monthly during peak season, shade west-facing windows, seal attic ducts, and schedule a spring tune-up. Together these can cut cooling costs by 20–30%.</p>"
  wp post create --post_status=publish --post_title="Repair or Replace? How to Decide on an Aging AC" --post_date="2026-07-15 09:00:00" \
    --post_content="<p>Use the \$5,000 rule: multiply the age of your system by the repair cost. If the result is over \$5,000, replacement usually makes more financial sense — especially for systems using R-22 refrigerant.</p>"
  wp post create --post_status=publish --post_title="Why Desert Dust Is Your HVAC System's Worst Enemy" --post_date="2026-09-10 09:00:00" \
    --post_content="<p>Fine dust clogs filters and coats evaporator coils, forcing your system to run longer. Upgrading to MERV-13 filters and adding an annual coil cleaning keeps airflow strong and indoor air cleaner.</p>"
fi

# Menus
if ! wp menu list --fields=slug --format=csv | grep -q '^primary$'; then
  wp menu create "Primary"
  for id in "$SERVICES_ID" "$PRICING_ID" "$ABOUT_ID" "$REVIEWS_ID" "$FAQ_ID" "$BLOG_ID" "$CONTACT_ID"; do
    wp menu item add-post primary "$id" >/dev/null
  done
  wp menu location assign primary primary
fi
if ! wp menu list --fields=slug --format=csv | grep -q '^footer$'; then
  wp menu create "Footer"
  for id in "$ABOUT_ID" "$PRICING_ID" "$REVIEWS_ID" "$BLOG_ID" "$CONTACT_ID"; do
    wp menu item add-post footer "$id" >/dev/null
  done
  wp menu location assign footer footer
fi

echo "Desert Air site ready at $SITE_URL (admin: $SITE_URL/wp-admin)"
