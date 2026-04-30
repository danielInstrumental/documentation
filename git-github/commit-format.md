---

## ✅ Conventional Commit Format

```
<type>(optional scope): short description
```

**Example**

```
feat(nav): add sticky header behavior on scroll
```

---

## 🧱 Commit Types (Most Common)

### ✨ `feat`

A **new feature** for the user or product

```
feat: add sticky header to child theme
feat(form): add range slider input
```

---

### 🐛 `fix`

A **bug fix**

```
fix: prevent menu from closing on resize
fix(header): correct z-index issue on mobile
```

---

### 🧹 `chore`

Maintenance tasks (no production behavior change)

```
chore: update dependencies
chore: remove unused console logs
```

---

### 📝 `docs`

Documentation-only changes

```
docs: update README with local setup steps
docs: add comments explaining JS logic
```

---

### 🎨 `style`

Code style changes **only** (no logic change)

```
style: format CSS
style: fix indentation in JS
```

---

### ♻️ `refactor`

Code changes that **neither fix a bug nor add a feature**

```
refactor: simplify menu toggle logic
refactor(css): extract shared button styles
```

---

### 🧪 `test`

Adding or updating tests

```
test: add unit tests for header scroll behavior
```

---

### 🚀 `perf`

Performance improvements

```
perf: debounce scroll listener
perf(images): lazy load hero images
```

---

### 🔧 `build`

Build system or tooling changes

```
build: update webpack config
build: adjust npm scripts
```

---

### 🔁 `ci`

CI/CD configuration changes

```
ci: add GitHub Actions workflow
```

---

### ⏪ `revert`

Reverting a previous commit

```
revert: revert "feat: add sticky header"
```

---

## 🎯 Optional Scope (Highly Recommended)

Scopes help a LOT in larger projects.

Examples:

```
feat(header): add sticky behavior
fix(menu): resolve mobile dropdown overlap
refactor(forms): move validation to helper
```

---

## 🧠 Best Practices (Quick Rules)

✔ Use **imperative present tense**

* ❌ “added sticky header”
* ✅ “add sticky header”

✔ Keep subject line under **50 characters**

✔ One commit = **one logical change**

✔ Don’t end the subject line with a period

---

## 🔖 Breaking Changes (Advanced)

If a change breaks backward compatibility:

```
feat!: remove legacy header styles
```

or

```
feat(header): remove legacy styles

BREAKING CHANGE: header markup has changed
```

---

## 🧩 Practical Examples for Your Work (HubSpot / WP)

```
feat(theme): add sticky header to Pike child theme
fix(css): correct mobile nav overflow
refactor(js): isolate scroll logic into helper
style(css): format header styles
perf(js): debounce scroll event listener
test(header): add scroll behavior tests
docs: add setup instructions for LocalWP
chore(hubspot): sync compiled assets
build(vite): update build output paths
ci(github): add linting workflow
revert: revert "feat(theme): add sticky header to Pike child theme"


| Type         | When to use                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------- |
| **feat**     | Adds a new feature or functionality                                                         |
| **fix**      | Fixes a bug                                                                                 |
| **docs**     | Documentation changes                                                                       |
| **style**    | Changes that **do not affect functionality**, e.g., formatting, colors, spacing, CSS tweaks |
| **refactor** | Code changes that neither fix a bug nor add a feature                                       |
| **perf**     | Performance improvements                                                                    |
| **test**     | Adding or updating tests                                                                    |
| **build**    | Build system or dependencies changes                                                        |
| **ci**       | CI/CD pipeline or scripts                                                                   |
| **chore**    | Miscellaneous maintenance tasks                                                             |
| **revert**   | Reverts a previous commit                                                                   |

```


