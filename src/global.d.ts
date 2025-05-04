// global.d.ts

// Extend the Window interface to include the finSdk property
interface Window {
  finSdk: any // Use the appropriate type instead of 'any' if you know the type of finSdk
}

// Ensure TypeScript recognizes the changes
declare var window: Window
