# Period Tracking Troubleshooting Guide

## Issue: Period tracking page not working

### What I Fixed:

1. **Scope Issues with `app` references**
   - Changed all `app.showModal()` to `window.app.showModal()`
   - Changed all `app.closeModal()` to `window.app.closeModal()`
   - Changed all `app.navigateToScreen()` to `window.app.navigateToScreen()`

2. **Missing Function Exports**
   - Added `window.showQuickActionsModal = showQuickActionsModal;`
   - Added `window.navigateAndCloseModal = navigateAndCloseModal;`

3. **Calendar Navigation Implementation**
   - Implemented full `navigateCalendar()` function
   - Added month/year tracking variables
   - Calendar now properly updates when clicking arrows

4. **FAB Button Safety Checks**
   - Added checks to verify functions exist before calling
   - Better error logging for debugging

### How to Test:

1. **Open browser console** (F12)
2. **Navigate to Period Tracking page**
3. **Check for errors** in console
4. **Test these actions:**
   - Click left/right arrows on calendar
   - Click the red + button
   - Click any calendar day
   - Try to enter a period date

### Expected Behavior:

- **Calendar arrows**: Should change month/year
- **+ Button**: Should open period entry modal
- **Calendar days**: Should open period entry modal with that date
- **Save button**: Should save to database and update calendar

### If Still Not Working:

**Check Browser Console for:**
- `showPeriodEntryModal not available` - Modal function not loaded
- `window.app is undefined` - App not initialized
- `navigateCalendar is not defined` - Components.js not loaded
- Any other JavaScript errors

**Verify Script Loading Order:**
Scripts must load in this order:
1. api-service.js
2. auth.js
3. modals.js (exports showPeriodEntryModal)
4. data-loader.js
5. animation-controller.js
6. animations.js
7. app.js (creates window.app object)
8. ui.js (exports showQuickActionsModal)
9. components.js (calendar functions)
10. screens.js (init functions)

**Check Function Availability:**
Open console and type:
```javascript
typeof window.showPeriodEntryModal  // should be "function"
typeof window.app.showModal          // should be "function"
typeof navigateCalendar              // should be "function"
```

### Common Issues:

**Issue**: Calendar shows only green circle on today
- **Cause**: Period data not loading from API
- **Fix**: Check if `loadCalendarPeriodData()` is being called
- **Check**: Look for period data in database

**Issue**: Arrows don't change month
- **Cause**: Event listeners not attached or navigateCalendar not defined
- **Fix**: Verify components.js loaded and calendar initialized

**Issue**: + Button does nothing
- **Cause**: showPeriodEntryModal not available or FAB handler not working
- **Fix**: Check modals.js loaded and function exported to window

**Issue**: Can't change date in modal
- **Cause**: Modal not opening or date input not rendering
- **Fix**: Check if modal container exists in DOM

### Files Modified:

- `js/app.js` - Added safety checks for function calls
- `js/ui.js` - Fixed all app references to use window.app
- `js/components.js` - Implemented navigateCalendar function
- `js/modals.js` - Already exports functions correctly

### Next Steps if Problem Persists:

1. Clear browser cache completely
2. Hard refresh (Ctrl+Shift+R)
3. Check Network tab for failed script loads
4. Verify all .js files exist and are accessible
5. Check for any ad blockers or security extensions blocking scripts
6. Try in incognito/private browsing mode
7. Test in different browser (Chrome, Edge, Firefox)

### Debug Commands:

Run these in browser console to diagnose:

```javascript
// Check app state
console.log('App State:', window.appState);

// Check if functions exist
console.log('showPeriodEntryModal:', typeof window.showPeriodEntryModal);
console.log('window.app:', typeof window.app);
console.log('window.app.showModal:', typeof window.app?.showModal);

// Check calendar
console.log('Calendar container:', document.querySelector('.calendar-container'));
console.log('Calendar days:', document.querySelectorAll('.calendar-day').length);

// Check FAB button
const fab = document.getElementById('fab-button');
console.log('FAB button:', fab);
console.log('FAB click handler:', fab?.onclick);

// Test modal manually
if (window.showPeriodEntryModal) {
    window.showPeriodEntryModal();
    console.log('Modal opened successfully');
} else {
    console.error('showPeriodEntryModal not found');
}
```

### Contact Support:

If none of these fixes work, provide:
1. Browser console errors (screenshot)
2. Browser name and version
3. Operating system
4. Steps that lead to the issue
5. Any error messages shown
