# Office, User & Walkin Blade Refactoring TODO

## Steps Completed:

- [x] 1. Update vite.config.js - Added office.css, office.js, user.css, user.js, walkin.css, walkin.js to input array
- [x] 2. Install GSAP via npm (replace CDN)
- [x] 3. Create resources/css/office.css - Tailwind v4 version of office styles
- [x] 4. Create resources/js/office.js - Vanilla JS version of office functionality
- [x] 5. Update resources/views/office/office.blade.php - Convert to Tailwind classes and Vite
- [x] 6. Create resources/css/user.css - Tailwind v4 version of user styles
- [x] 7. Create resources/js/user.js - Vanilla JS version of user functionality
- [x] 8. Update resources/views/user/user.blade.php - Convert to Tailwind classes and Vite
- [x] 9. Create resources/css/walkin.css - Tailwind v4 version of walkin styles
- [x] 10. Create resources/js/walkin.js - Vanilla JS version of walkin functionality
- [x] 11. Update resources/views/walkin/walkin.blade.php - Convert to Tailwind classes and Vite
- [x] 12. Build successful - All assets compiled

## Current Status: ✅ COMPLETE

### Build Output:
- office-Bfb-dVjA.css, office-3H23CJwU.js
- user-C35hdra9.css, user-BKJv11MB.js
- walkin-DPtXTlWR.css, walkin-OR4YAxXz.js

### What to Archive After Testing:

After confirming all functionality works in production, you can safely **delete** these old files:

| Old File | New Replacement |
|----------|-----------------|
| `public/css/office.blade.css` | `resources/css/office.css` |
| `public/js/office.blade.js` | `resources/js/office.js` |
| `public/css/user.blade.css` | `resources/css/user.css` |
| `public/js/user.blade.js` | `resources/js/user.js` |
| `public/css/walkin.blade.css` | `resources/css/walkin.css` |
| `public/js/walkin.blade.js` | `resources/js/walkin.js` |

### Testing Checklist:
- [ ] Office page loads with styles applied
- [ ] User page loads with styles applied
- [ ] Walkin page loads with styles applied
- [ ] Statistics cards load via AJAX on all pages
- [ ] View toggles work (Cards, Grid, List, Table)
- [ ] Status filtering works
- [ ] Create/Edit/View/Delete operations work
- [ ] GSAP modal animations work
- [ ] SweetAlert2 notifications appear
- [ ] Form validation shows errors
- [ ] Responsive design on mobile/tablet
