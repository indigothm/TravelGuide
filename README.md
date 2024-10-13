# Travel Guide

Travel Guide is a React Native app that allows users to explore travel destinations and add travel events to their device's calendar using a custom native module.

![Home](screenshots/Home.png)
![Details](screenshots/Details.png)
![Permissions](screenshots/Permissions.png)
![Calendar](screenshots/Calendar.png)

## Technology Stack
- React Native with TypeScript
- React Navigation for routing
- React Native Reanimated for animations including SharedElementTransitions
- Custom Expo Native Modules for calendar integration (Swift & Kotlin)
- EAS integration

## Animations

1. Home to Detail Screen Transition: Shared element transition for a zoom-in effect
2. Detail Screen: Fade-in and slide-in effects for text and elements

# Running the app (Expo Prebuild)

1. Clone the repository
2. Install dependencies: 
```
npm install
```
3. Generate a native expo client
```
npx expo prebuild --clean 
```
4. Run with 
```
npx expo start
```
