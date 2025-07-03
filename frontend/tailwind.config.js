/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Unified psychologically calming palette with meaningful icon colors
        primary: '#6B8E6B',        // Balanced sage green - calming and stable
        secondary: '#F8FAF8',      // Pure soft white - clean and peaceful
        accent: '#8DB1A8',         // Soft seafoam - tranquil and refreshing
        calm: '#B5C9C1',           // Light sage blue - serene and balanced
        focus: '#5A7A5A',          // Deeper sage - grounding and centered
        energy: '#D4B896',         // Warm beige - gentle and comforting
        muted: '#E8EDE8',          // Very pale sage - subtle and harmonious
        // Meaningful icon colors
        heart: '#C85A5A',          // Subtle warm red - gentle love and wellness
        meditation: '#9B59B6',     // Calming purple - mindfulness
        coffee: '#8B4513',         // Rich brown - coffee/break time
        activity: '#F39C12',       // Energetic orange - movement and breaks
        analytics: '#3498DB',      // Professional blue - data and insights
        trophy: '#F1C40F',         // Gold - achievement and success
        message: '#2ECC71',        // Fresh green - communication
      },
    },
  },
  plugins: [],
} 