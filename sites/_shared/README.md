# Shared analytics

This folder contains reusable analytics scripts for all sites in this repo.

## Setup (free)

### Option 1: Microsoft Clarity (recommended for free)
1. Create a Clarity project: https://clarity.microsoft.com/
2. Copy the **Project ID**.
3. Edit `sites/_shared/analytics-config.js` and set `clarityProjectId`.

### Option 2: Google Analytics 4 (also free)
1. Create a GA4 property: https://analytics.google.com/
2. Copy the **Measurement ID** (looks like `G-XXXX`).
3. Edit `sites/_shared/analytics-config.js` and set `ga4MeasurementId`.

## How to include on a site

From a site served at `/hello/`, include:

```html
<script src="../_shared/analytics-config.js"></script>
<script defer src="../_shared/analytics-loader.js"></script>
<script defer src="../_shared/analytics.js"></script>
```

## Section tracking

Add `data-track-section` to elements you want to track:

```html
<section data-track-section="lesson-1-intro">...</section>
```

`analytics.js` tracks **active time** (while tab is visible and user has interacted recently) and can also track which section is most visible.
