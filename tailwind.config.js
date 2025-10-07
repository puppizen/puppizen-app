module.exports = {
  theme: {
    extend: {
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
      },
      animation: {
        flicker: 'flicker 0.2s infinite',
        lightning: 'lightning 0.2s infinite',
      },
    },
  },
};