export default {
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0890A8',
        'primary-white': '#FFFFFF',
        'primary-black': '#000000',
        'secondary-black': '#444444',
        'neutral-gray': '#ACACAC',
        'light-gray': '#F7F7F7',
        'primary-blue-transparent': 'rgba(8, 144, 168, 0.40)',
        'success-green': '#058F3A',
        'vibrant-purple': '#7E2EFF',
        'lightest-gray': '#FAFAFA',
        'overlay-gray': 'rgba(182, 182, 182, 0.50)',

        // Add more colors as needed
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        // Enhanced loading animations
        smoothSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        smoothPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(0.95)' },
        },
        smoothBounce: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
          '40%, 43%': { transform: 'translateY(-8px)' },
          '70%': { transform: 'translateY(-4px)' },
          '90%': { transform: 'translateY(-2px)' },
        },
        loadingDots: {
          '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: '0.5' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        loadingBars: {
          '0%, 40%, 100%': { transform: 'scaleY(0.4)' },
          '20%': { transform: 'scaleY(1)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        buttonPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 200ms ease-out',
        fadeOut: 'fadeOut 200ms ease-in forwards',
        scaleIn: 'scaleIn 200ms ease-out',
        scaleOut: 'scaleOut 200ms ease-in forwards',
        // Enhanced loading animations
        'smooth-spin': 'smoothSpin 1s linear infinite',
        'smooth-pulse': 'smoothPulse 2s ease-in-out infinite',
        'smooth-bounce': 'smoothBounce 1s infinite',
        'loading-dots': 'loadingDots 1.4s ease-in-out infinite both',
        'loading-bars': 'loadingBars 1.2s ease-in-out infinite',
        ripple: 'ripple 1.5s ease-out infinite',
        'button-press': 'buttonPress 0.1s ease-in-out',
      },
    },
  },
};
