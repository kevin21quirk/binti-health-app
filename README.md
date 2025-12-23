# Binti International Health App

A comprehensive menstrual health tracking application with smart pad integration, designed for Binti International.

## Features

- **Period Tracking**: Calendar-based period tracking with history and predictions
- **Pain Management**: Track and analyze pain levels, locations, and remedies
- **Leak Prevention**: Risk assessment and protection recommendations
- **Health Insights**: Visualize trends and get personalized health insights
- **Community**: Connect with others and share experiences
- **Smart Pad Device Connection**: Integrate with Binti's smart menstrual pad for advanced health data
- **Settings & Personalization**: Customize the app experience
- **Help & Support**: Get assistance and learn about menstrual health

## Technology

This app is built using:

- Progressive Web App (PWA) architecture for cross-platform compatibility
- Vanilla JavaScript, HTML5, and CSS3
- Offline support via Service Workers
- Mobile-first responsive design
- Bluetooth API integration (for smart pad connection)

## Getting Started

1. Clone the repository
2. Navigate to the project directory
3. Start a local web server (e.g., `python -m http.server 8082`)
4. Open the app in your browser at `http://localhost:8082`
5. For the best experience, use a mobile device or mobile emulator

## File Structure

- `/css/` - Stylesheets
- `/js/` - JavaScript files
- `/images/` - Images and icons
- `index.html` - Main app entry point
- `manifest.json` - PWA configuration
- `service-worker.js` - Offline functionality

## Smart Pad Integration

The app can connect to Binti's smart menstrual pad device via Bluetooth to collect health data including:
- pH levels
- Fluid volume and flow rate
- Temperature
- Biological markers for health insights

## Color Scheme

- Primary: Shiny Purple (#8A2BE2)
- Secondary: Vibrant Red (#FF0045)
- Supporting colors for UI elements and visualizations

## Deployment

This app can be deployed to any web server or hosting platform that supports static sites. For production use, consider using:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Roadmap

- Backend integration with user accounts
- Data synchronization across devices
- Advanced health analytics
- Smart pad firmware updates
- Localization for global accessibility
