import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // XL Benefits Brand Colors
        'xl-dark-blue': {
          DEFAULT: '#003366',
          50: '#e6f0f7',
          100: '#cce0ef',
          200: '#99c2df',
          300: '#66a3cf',
          400: '#3385bf',
          500: '#003366', // Primary brand color
          600: '#002952',
          700: '#001f3d',
          800: '#001429',
          900: '#000a14',
        },
        'xl-bright-blue': {
          DEFAULT: '#0099CC',
          50: '#e6f6fb',
          100: '#cceef7',
          200: '#99dcef',
          300: '#66cbe7',
          400: '#33b9df',
          500: '#0099CC', // Accent brand color
          600: '#007aa3',
          700: '#005c7a',
          800: '#003d52',
          900: '#001f29',
        },
        'xl-grey': {
          DEFAULT: '#333333',
          50: '#f7f7f7',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#b9b9b9',
          400: '#a2a2a2',
          500: '#8b8b8b',
          600: '#6e6e6e',
          700: '#525252',
          800: '#333333', // Body text
          900: '#1a1a1a',
        },
        'xl-light-grey': {
          DEFAULT: '#F0F0F0',
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#F0F0F0', // Background
          400: '#e0e0e0',
          500: '#d1d1d1',
          600: '#b8b8b8',
          700: '#9f9f9f',
          800: '#868686',
          900: '#6d6d6d',
        },
        // Semantic color mapping for easier use
        primary: {
          DEFAULT: '#003366',
          50: '#e6f0f7',
          100: '#cce0ef',
          200: '#99c2df',
          300: '#66a3cf',
          400: '#3385bf',
          500: '#003366',
          600: '#002952',
          700: '#001f3d',
          800: '#001429',
          900: '#000a14',
        },
        accent: {
          DEFAULT: '#0099CC',
          50: '#e6f6fb',
          100: '#cceef7',
          200: '#99dcef',
          300: '#66cbe7',
          400: '#33b9df',
          500: '#0099CC',
          600: '#007aa3',
          700: '#005c7a',
          800: '#003d52',
          900: '#001f29',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
