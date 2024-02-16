/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        cursive: ["Pinyon Script", "Dancing Script"],
        kufi: ["Reem Kufi", "sans-serif"]
      },
      colors: {
        primary: '#1f1400',
        secondary: '#c37f00',
        light: '#fffaf2',
        'primary-lighter': '#7f5300',
        back: '#fff8be'
      },
      animation: {
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'zoom': 'zoom 1s ease-in-out infinite'
      },
      keyframes: {
        'wiggle': {
            '0%, 100%': {
                transform: 'rotate(-2deg)'
            },
            '50%': {
                transform: 'rotate(2deg)'
            },
        },
        'zoom': {
            '0%, 100%': {
                transform: 'scale(105%)'
            },
            '50%': {
                transform: 'scale(100%))'
            },
        },
      }
    },
  },
  plugins: [],
}

