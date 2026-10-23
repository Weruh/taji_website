# Taji Luxury Events and Academy

A website for exploring event planning and decor services, discovering academy courses, sending inquiries through WhatsApp, and making online course payments through Paystack.

## What each page does

| Page | Summary |
| --- | --- |
| Home | Introduces Taji, highlights services and training programs, and shares testimonials. |
| Academy | Lists available courses, registration opportunities, class highlights, and learning outcomes. |
| Course Details | Explains a selected course, its schedule, fees, and learning outcomes. Visitors can choose a class time and payment plan and send enrollment details through WhatsApp. |
| Course Payment / Checkout | Shows the selected course and payment breakdown. Collects a name and email and opens Paystack for registration fees or course payments, including installment options. |
| Events | Presents event services, areas of expertise, and recent productions. |
| Weddings | Introduces wedding planning, decor, and luxury celebration services. |
| Corporate | Explains corporate event services and lets visitors send an event brief through WhatsApp. |
| Gallery | Displays photos of events and the team's work. |
| About | Introduces Taji's values, leadership, and recognition. |
| Contact | Provides contact details, a location map, FAQs, and a form that prepares an inquiry in WhatsApp. |
| Payment Success | Shows the payment confirmation page and transaction information after checkout. |
| Privacy Policy | Explains what information is collected, how it is used, and visitors' privacy rights. |
| Terms of Service | Describes the terms for event services, academy participation, intellectual property, and liability. |
| Not Found | Appears when a visitor opens a page or course that does not exist. |

## Start Planning form

The shared Start Planning popup collects contact details, an event date, guest count, venue, venue type, theme, and colours. It validates the fields before opening WhatsApp with the details prepared for sending.

## Technology

React frontend with a Node.js/Express backend for Paystack payment processing.

## Image loading

Run frontend commands from `taji_luxury_events`. Both `npm run dev` and `npm run build` automatically generate compressed WebP sizes from the original pictures in `public/img`. Originals are preserved; generated files in `public/img/optimized` and `src/generated/images.json` are ignored by Git and included in the build automatically.

Use `ResponsiveImage` for photos and set `sizes` to their displayed width. Images load lazily by default; use `loading="eager"` and `fetchPriority="high"` for the main image at the top of a page. After adding or replacing originals while the dev server is running, run `npm run images:optimize` to refresh their sizes.
