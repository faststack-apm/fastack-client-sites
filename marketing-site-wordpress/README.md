# marketing-site-wordpress — Desert Air Heating & Cooling

A WordPress marketing site for a Las Vegas HVAC contractor, running in Docker. It uses a custom theme (`desert-air`)
modeled on the common features of the HVAC templates in the
[Contractor Gorilla roundup](https://contractorgorilla.com/blog/hvac-website-templates/): top bar with phone and hours,
sticky header, hero with a quote form, service cards, membership pricing, reviews, FAQ accordion, a CTA band, a floating
call button and a full contact page.

## Run

```bash
docker compose up -d
```

| URL | What |
| --- | --- |
| http://localhost:8088 | Site |
| http://localhost:8088/wp-admin | Admin — `admin` / `admin` |
| http://localhost:8025 | Mailpit — catches every email the site sends |

The `setup` container installs WordPress on first run, activates the theme, and creates the pages, menus and sample blog
posts. It is idempotent, so you can rerun it with `docker compose run --rm setup`.

## Pages

Home · Services · Pricing · About Us · Reviews · FAQ · Blog · Contact

## Contact form

The forms (hero quick quote and the full form on `/contact/`) post to `admin-post.php?action=da_contact` and:

1. verify a nonce, with a honeypot field for spam protection
2. validate name, email, phone, service, ZIP and date, re-showing the form with errors and the values entered
3. save the submission as a private **Lead** post (wp-admin → Leads, with email/phone/date columns)
4. email the site admin and send the customer an auto-reply (delivered to Mailpit locally)

Hook `da_lead_created` (`$lead_id, $data`) to forward leads to a CRM or emit telemetry.

## Customize

Appearance → Customize → **Business details** sets the phone, email, address and hours. Services, plans, reviews and FAQs
are defined in `wp-content/themes/desert-air/inc/content.php`.

## Reset

```bash
docker compose down -v   # removes the database and WordPress volumes
```
