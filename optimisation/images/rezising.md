https://developers.hubspot.com/docs/cms/reference/hubl/functions#resize_image_url

# HubSpot Image Optimization: Automatic vs. Manual Resizing

This guide explains the difference between HubSpot's automatic background processes and manual optimization using HubL functions to satisfy performance audits like Google Lighthouse.

---

## 1. HubSpot Automatic Image Resizing
Even when using a standard `<img>` tag in a HubL template, HubSpot’s backend intercepts the rendering process to assist with responsiveness.

* **How it works:** HubSpot identifies the `src` URL and the `width` attribute provided in the tag.
* **The Mechanism:** It automatically generates a `srcset` attribute containing various versions of the image at different scales (e.g., 0.5x, 1x, 2x, 3x).
* **The Goal:** This is primarily designed to support high-density "Retina" displays, ensuring images look sharp on high-resolution screens.
* **The Visible Result:** When inspecting the page in a browser console, you will see a `srcset` and multiple URL parameters even if you didn't write them in your code.

---

## 2. The "Raw Image" Fallback Issue
Despite automatic resizing, performance issues often persist because the original "raw" image remains the primary fallback.

* **The Risk:** If the original uploaded file is significantly larger (e.g., 1600px wide) than the area it occupies on the screen (e.g., 400px wide), the browser may still download the high-resolution file.
* **Vague Instructions:** Automatic resizing often generates a generic `sizes` attribute (like `100vw`). Without specific instructions, a mobile browser might "play it safe" and download a large desktop-sized resource, wasting bandwidth.

---

## 3. Manual Optimization with `resize_image_url()`
To achieve maximum performance and pass Lighthouse "Properly Size Images" audits, manual intervention using the `resize_image_url(src, width)` function is required.

### Comparative Analysis: Optimization Impact

| Feature | Without `resize_image_url()` | With `resize_image_url()` |
| :--- | :--- | :--- |
| **Server Action** | Serves the original file; browser scales it down visually. | HubSpot server creates a **new physical file** at the requested width. |
| **Data Usage** | **Wasteful.** Downloads a large "Resource" for a small "Display" area. | **Efficient.** Resource size matches the display size. |
| **Lighthouse Result** | Often flags "Properly size images" warnings. | Satisfies audits by minimizing payload. |
| **User Experience** | Slower load times, especially on mobile data. | Faster rendering and improved LCP (Largest Contentful Paint). |



---

## 4. Implementation Example
For a custom module image that needs to be 320px on mobile and 650px on desktop, use the following structure to override automatic guessing with explicit instructions:

```html
<img class="custom-image" 
     src="{{ src }}" 
     srcset="{{ resize_image_url(src, 320) }} 320w, 
             {{ resize_image_url(src, 650) }} 650w"
     sizes="(max-width: 767px) 320px, 650px"
     alt="{{ module.image.alt }}"
     width="650"
     height="400">



        
  <img class="adv-img__image optesting" 
        src="{{ src }}" 
        srcset="{{ resize_image_url(src, 370) }} 370w, 
                {{ resize_image_url(src, 540) }} 540w, 
                {{ resize_image_url(src, 740) }} 740w, 
                {{ resize_image_url(src, 1080) }} 1080w"
        sizes="(max-width: 767px) 370px, (max-width: 1200px) 540px, 740px"
        alt="{{ module.image.alt }}" 
        {{ size_attributes }} 
        {{ loading_attr }} 
        {{ 'data-mh-parallax-target' if parallax.enabled }}> 


```

### Key Takeaway for Future Reference
**Automatic Resizing** is for **Resolution** (making things sharp). 
**Manual Resizing** is for **Delivery** (making things fast).