/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          paper: '#f5f4f0',
          50: '#faf9f6',
          100: '#f5f4f0',
          200: '#eae8e1',
        },
        mint: {
          splash: '#99ffcc',
          DEFAULT: '#99ffcc',
          hover: '#80ffbf',
          dark: '#00874e',
        },
        plum: {
          ink: '#160042',
          aubergine: '#26153f',
        },
        sky: {
          pop: '#7bbbff',
        },
        bubblegum: {
          DEFAULT: '#ff99cc',
          pop: '#ff99cc',
        },
        peach: {
          pop: '#ffcc99',
        },
        ink: {
          black: '#000000',
          charcoal: '#222222',
          slate: '#333333',
          fog: '#dddfe2',
        },
      },
      fontFamily: {
        recoleta: ['"DM Serif Display"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"DM Serif Display"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'large': '40px',
        'pill': '9999px',
        'btn': '12px',
      },
    },
  },
  plugins: [],
}
