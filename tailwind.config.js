/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/tailwind-datepicker-react/dist/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        customThin: ['Thin'],
        customXLight: ['Xlight'],
        customLight: ['Light'],
        customMedium: ['Medium'],
        customRegular: ['Regular'],
        customSemiBold: ['SemiBold'],
        customBold: ['Bold']
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        black: {
          default: '#000000',
          main: '#0D0D0D'
        },

        gray: {
          border: '#D1D1D6',
          lighter: '#D1D1D6',
          light: '#F8F8F9',
          main: '#F6F6F7',
          calendar: '#F4F4F9',
          dark: '#E5E5EA',
          darker: '#8E8E93',
          'light-1': '#FCFCFD',
          'light-2': '#EAE5E2'
        },
        blue: {
          main: '#5495FC',
          dark: '#007AFF'
        },
        green: {
          lighter: '#00CA39',
          light1: '#34C759',
          light: '#31D366',
          main: '#60EC8E',
          dark: '#69CB3A',
          active: '#34C7591F',
          delivered: '#E4F6E9'
        },
        orange: {
          main: '#FF9900',
          intransit: '#FCF7E2'
        },
        yellow: {
          main: '#FFD020',
          dark: '#FF9500',
          warning: '#FF95001F'
        },
        red: {
          main: '#E33E3E',
          dark: '#FF2D55',
          lock: '#FF2D551F',
          cancel: '#F9E5E6'
        },
        purple: {
          main: '#9A3EE3',
          storage: '#F0E5FA'
        },
        pink: {
          main: '#FF2D55'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },

      backgroundImage: {
        'dashboard-admin': "url('/src/assets/background/bg-dashboard.png')",
        'dashboard-retailer': "url('/src/assets/background/bg-dashboard-retailer.png')",
        'product-detail': "url('/src/assets/background/bg-product-detail.png')",
        'list-order': "url('/src/assets/background/bg-list-order.png')",
        'list-product': "url('/src/assets/background/bg-list-product.png')",
        'list-product-retailer': "url('/src/assets/background/bg-list-product-retailer.png')",
        'product-detail-retailer': "url('/src/assets/background/bg-product-detail-retailer.png')",
        'list-customer': "url('/src/assets/background/bg-list-customer.png')",
        'list-agent': "url('/src/assets/background/bg-list-agent.png')",
        'order-detail': "url('/src/assets/background/bg-order-detail.png')",
        // linear
        'ln-white': 'linear-gradient(304.89deg, #FFFFFF 4.75%, #DEECF6 137.45%)',
        'ln-gray': 'linear-gradient(251.23deg, #F2F3F5 2.26%, #F6F6F7 98.14%)',
        'ln-green-blue-to-r': 'linear-gradient(270deg, #5495FC 0%, #31D366 100%)',
        'ln-green-blue': 'linear-gradient(310.07deg, #5495FC 1.05%, #31D366 96.98%)',
        'ln-blue-to-b': 'linear-gradient(360deg, #AFDDF4 0.61%, #34B3F1 100%)',
        'ln-blue-to-t': 'linear-gradient(180deg, #37CFFF 0%, #0D57C6 100.07%, #0F5ED6 100.07%)',
        'ln-green-to-t': 'linear-gradient(180deg, #9DFFB3 0%, #1AA37A 100%)',
        'ln-gray-to-l': 'linear-gradient(304.89deg, #FFFFFF 4.75%, #DEECF6 137.45%)',
        'ln-gray-dark-to-l': 'linear-gradient(304.89deg, #FFFFFF 4.75%, #DEECF6 137.45%)',
        'ln-intransit': 'linear-gradient(132.21deg, #AFDDF4 4.3%, #34B3F1 95%)',
        'ln-delivered': 'linear-gradient(180deg, #37CFFF 0%, #0D57C6 100.07%, #0F5ED6 100.07%)',
        'ln-cancelled': 'linear-gradient(180deg, #9DFFB3 0%, #1AA37A 100%)',
        'ln-storage': 'linear-gradient(303.39deg, #FFFFFF 4.41%, #DEECF6 92.37%)',
        'ln-button-post-product': 'linear-gradient(180deg, #44BBFE 0%, #1E78FE 100%)'
      }
    },
    screens: {
      '2xs': { max: '370px' },
      xs: { max: '639px' },
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px'
    },
    boxShadow: {
      button2: '0px 0px 106.67px 0px #0000000D',
      'iner-green-blue': '4px 4px 4px 0px #046D4433 inset',
      'chart-doughout': '0px 3.72px 18.59px 0px #00000029',
      header: '0px 4px 20px 0px #2F373C08',
      radio: '0px 3px 15px 0px #FFFFFF',
      popover: '0px 4px 32px 0px #00000026',
      checkbox: '-1px -1px 0px 0px #0000001F inset',
      avatar: '0px 0px 4px 0px #00000052',
      button: '0px 4px 32px 0px #0000000D',
      card: '0px 4px 20px 0px #0000000D',
      'card-feature': '0px 0px 42.59px 0px #0000000D',
      'popover-custom': '0px 4px 32px 0px #0000001A',
      'popover-custom-2': '0px 4px 32px 0px #00000008',
      'icon-button': '0px 0px 80px 0px #00000026',
      'box-content': '0px 0px 20px 0px #00000052',
      'box-content-model': '0px 0px 80px 0px #0000000D',
      '1xl': '0px 4px 64px 0px #0000001A;',
      '3xl': '0px 0px 77.42px 0px #0000000D',
      '4xl': '0px 0px 80px 0px #0000000D',
      '5xl': '0px 5px 16px 0px #080F340F',
      '6xl': '0px 0px 64px 0px #0000001A',
      '7xl': '0px 0px 55.19px 0px #0000000D',
      '8xl': '0px 4px 64px 0px #0000001A',
      '9xl': '0px 0px 43.36px 0px #0000000D',
      '10xl': '0px 4px 64px 0px #0000000D',
      '11xl': '0px 3.46px 27.64px 0px #0000001A',
      '12xl': '0px 0px 47.67px 0px #0000000D',
      '13xl': '0px 0px 47.3px 0px #0000000D',
      '14xl': '0px 4px 20px 0px #0000001A',
      '15xl': '0px 0px 39.05px 0px #0000000D',
      '16xl': '0px 4px 40px 0px #0000001A',
      '17xl': '-4px 4px 10px 0px #0000001A',
      '18xl': '0px 10.51px 21.01px 0px #207CFE66'
    }
  },
  plugins: [
    plugin(function ({ addComponents, addUtilities }) {
      addComponents({
        '.container': {
          maxWidth: '1440px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }
      })
      const newUtilities = {
        '.rp-lg-text': {
          '@apply xs:text-[16px]/[16.8px] sm:text-[20px]/[20.8px] md:text-[22px]/[22.8px] lg:text-[24px]/[25px]': {}
        },
        '.rp-md-text': {
          '@apply xs:text-[14px]/[14.7px] sm:text-[16px]/[16.8px] md:text-[17px]/[17.8px] lg:text-[18px]/[20px]': {}
        },
        '.rp-xl-text': {
          '@apply xs:text-[14px]/[14.7px] sm:text-[16px]/[16.8px] md:text-[18px]/[18.9px] lg:text-[20px]/[21px]': {}
        },
        '.rp-title': {
          '@apply font-customSemiBold capitalize xs:text-[24px]/[25px] sm:text-[30px]/[31px] md:text-[36px]/[37.8px]':
            {}
        },
        '.rp-small-title': {
          '@apply font-customSemiBold capitalize xs:text-[24px]/[25px] sm:text-[30px]/[31px] md:text-[32px]/[32px]': {}
        },
        '.rp-table-space': {
          '@apply xs:gap-2 xs:pt-0 sm:gap-2 sm:pt-0 md:pt-0 md:gap-2 lg:gap-[10px]': {}
        }
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    }),
    require('tailwindcss-animate')
  ]
}
