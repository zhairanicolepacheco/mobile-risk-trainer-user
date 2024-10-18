/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * This palette uses a green theme for both light and dark modes.
 */

const tintColorLight = '#2ecc71';  // A vibrant green for light mode
const tintColorDark = '#32cd32';   // A slightly lighter green for dark mode

export const Colors = {
  light: {
    text: '#2c3e50',          // Dark green-blue for text
    background: '#f1f8e9',    // Very light green background
    tint: tintColorLight,
    icon: '#4caf50',          // Medium green for icons
    tabIconDefault: '#7cb342', // Lighter green for default tab icons
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#e0f2f1',          // Very light green-teal for text
    background: '#1b5e20',    // Dark green background
    tint: tintColorDark,
    icon: '#81c784',          // Light green for icons
    tabIconDefault: '#66bb6a', // Medium-light green for default tab icons
    tabIconSelected: tintColorDark,
  },
};