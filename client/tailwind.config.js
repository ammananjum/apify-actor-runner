// tailwind.config.js
module.exports = {
  darkMode: 'class', // <-- ✅ Enable class-based dark mode
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        spinAround: {
          '0%': { transform: 'rotate(45deg) translateX(0) translateY(0)' },
          '25%': { transform: 'rotate(135deg) translateX(40px) translateY(40px)' },
          '50%': { transform: 'rotate(225deg) translateX(0) translateY(80px)' },
          '75%': { transform: 'rotate(315deg) translateX(-40px) translateY(40px)' },
          '100%': { transform: 'rotate(405deg) translateX(0) translateY(0)' },
        },
      },
      animation: {
        spinAround: 'spinAround 8s linear infinite',
      },
    },
  },
  plugins: [],
};
