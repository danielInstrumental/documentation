

# What It Means
A button is empty or has no value text.

# Why It Matters
When navigating to a button, descriptive text must be presented to screen reader users to indicate the function of the button.

# What To Do
Place text content within the <button> element or give the <input> element a value attribute.





HOW TO FIX: <!-- ================================================================================================== -->


1.  Add a visually-hidden label

<button class="hs-menu-item__child-toggle">
  <span class="sr-only">Toggle submenu</span>
</button>

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```


2. Add an aria-label


<button class="hs-menu-item__child-toggle" aria-label="Toggle submenu"></button>
