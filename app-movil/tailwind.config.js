/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nexus: {
          ink: '#17202A',
          blue: '#1F4F66',
          cream: '#F4F1EB',
          teal: '#DDEBED',
          green: '#2F6F4E',
        },
      },
      fontFamily: {
        'inter-regular': ['Inter_400Regular'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        'space-regular': ['SpaceGrotesk_400Regular'],
        'space-semibold': ['SpaceGrotesk_600SemiBold'],
      },
    },
  },
  plugins: [],
};
