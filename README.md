# LIFESTYLE

Standalone mobile-friendly progressive web app (PWA).

## Features
- Home dashboard
- Custom habits
- XP, levels and ranks
- Daily score
- Streak + best streak
- 7-day history
- Achievements
- 25-minute focus timer
- Daily journal
- Local persistence
- iPhone-friendly PWA setup
- Offline cache after first load

## iPhone setup
The app needs to be hosted over HTTPS for the PWA/service-worker features.

After hosting:
1. Open the site in Safari on your iPhone.
2. Tap Share.
3. Tap "Add to Home Screen".
4. Tap Add.

It will launch from the Home Screen in a standalone app-like window.

## Free hosting
GitHub Pages is a simple free option:
1. Create a GitHub repository.
2. Upload all files from this folder.
3. In repository Settings -> Pages, enable deployment from the main branch.
4. Open the generated HTTPS URL in Safari and add it to your Home Screen.

## Note
This version stores data in the browser/device. It does not have accounts or cloud sync yet.
