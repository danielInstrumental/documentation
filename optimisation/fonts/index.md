* Hubspot AutoInject behavior

The /_hcms/googlefonts/... path is HubSpot's own font-proxy endpoint on your domain. This is exactly the "served by HubSpot directly on the domain that the page loads on" behavior from the docs — HubSpot fetches the Google Font and re-serves it from your HubSpot-hosted origin so you avoid third-party requests to 

1. A Font field somewhere in your theme/module fields.json has Montserrat selected (with weights 400/500/700) and load_external_fonts: true (default).

2. That field is referenced via HubL in CSS/a module (e.g. {{ theme.body_font.font }}).

3. At render time HubSpot detects the reference and injects the @font-face block above into the page <head>, pointing at its /_hcms/googlefonts/<Family>/<weight>.woff2 proxy._






<!-- Analysing performence -->

1. Identify Fonts Actually Used in Theme


2. Add Preconnect (always first)

<!-- Preconnect to HubSpot font CDN -->
<link rel="preconnect" href="/_hcms" crossorigin>




