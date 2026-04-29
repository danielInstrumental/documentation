
# Add Preconnect above {{ standard_header_includes }} In base.html


<!-- Preconnect to HubSpot font CDN -->
<link rel="preconnect" href="/_hcms" crossorigin>


## How to Check the "Timing" Tab (Chrome DevTools)


### Step-by-Step
1. Right click the page → **Inspect**
2. Click **Network**
3. Reload the page
4. (Optional) Filter to fonts:
```

font

```
5. Click one of the font files (ex: `.woff2`)

---

### Where the Timing Tab Is

After clicking a request, a panel appears with tabs:

- Headers  
- Preview  
- Response  
- Initiator  
- **Timing** ← click this  
- Cookies  

Click **Timing**

---

### What You'll See in Timing

```

Queueing
Stalled
DNS Lookup
Initial connection
SSL
Request sent
Waiting (TTFB)
Content Download

```

### What to Look For (Preconnect Working)

These should be **very small or 0 ms**:

- DNS Lookup  
- Initial connection  
- SSL

