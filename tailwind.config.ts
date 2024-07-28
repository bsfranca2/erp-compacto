import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import defaultTheme from 'tailwindcss/defaultTheme'
import animate from 'tailwindcss-animate'
import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons'

export default <Partial<Config>> {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './utils/**/*.{js,ts}',
    './App.{js,ts,vue}',
    './app.{js,ts,vue}',
    './Error.{js,ts,vue}',
    './error.{js,ts,vue}',
    './app.config.{js,ts}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          25: '#f5f8ff',
          50: '#eff4ff',
          100: '#d1e0ff',
          200: '#b2ccff',
          300: '#84adff',
          400: '#528bff',
          500: '#2970ff',
          600: '#155eef',
          700: '#004eeb',
          800: '#0040c1',
          900: '#00359e',
          950: '#002266',
        },
        gray: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#eaecf0',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#182230',
          900: '#101828',
          950: '#0c111d',
        }
        // error: {
        //   DEFAULT: 'hsl(var(--error-500))',
        //   25: 'hsl(var(--error-25))',
        //   50: 'hsl(var(--error-50))',
        //   100: 'hsl(var(--error-100))',
        //   200: 'hsl(var(--error-200))',
        //   300: 'hsl(var(--error-300))',
        //   400: 'hsl(var(--error-400))',
        //   500: 'hsl(var(--error-500))',
        //   600: 'hsl(var(--error-600))',
        //   700: 'hsl(var(--error-700))',
        //   800: 'hsl(var(--error-800))',
        //   900: 'hsl(var(--error-900))',
        //   950: 'hsl(var(--error-950))',
        // },
        // warning: {
        //   DEFAULT: 'hsl(var(--warning-500))',
        //   25: 'hsl(var(--warning-25))',
        //   50: 'hsl(var(--warning-50))',
        //   100: 'hsl(var(--warning-100))',
        //   200: 'hsl(var(--warning-200))',
        //   300: 'hsl(var(--warning-300))',
        //   400: 'hsl(var(--warning-400))',
        //   500: 'hsl(var(--warning-500))',
        //   600: 'hsl(var(--warning-600))',
        //   700: 'hsl(var(--warning-700))',
        //   800: 'hsl(var(--warning-800))',
        //   900: 'hsl(var(--warning-900))',
        //   950: 'hsl(var(--warning-950))',
        // },
        // success: {
        //   DEFAULT: 'hsl(var(--success-500))',
        //   25: 'hsl(var(--success-25))',
        //   50: 'hsl(var(--success-50))',
        //   100: 'hsl(var(--success-100))',
        //   200: 'hsl(var(--success-200))',
        //   300: 'hsl(var(--success-300))',
        //   400: 'hsl(var(--success-400))',
        //   500: 'hsl(var(--success-500))',
        //   600: 'hsl(var(--success-600))',
        //   700: 'hsl(var(--success-700))',
        //   800: 'hsl(var(--success-800))',
        //   900: 'hsl(var(--success-900))',
        //   950: 'hsl(var(--success-950))',
        // },
      },
      borderRadius: {
        'xxs': '0.125rem',
        'xs': '0.25rem',
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.625rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.125rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'md': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.875rem' }],
        'display-xs': ['1.5rem', { lineHeight: '2rem' }],
        'display-sm': ['1.875rem', { lineHeight: '2.375rem' }],
        'display-md': [
          '2.25rem',
          { lineHeight: '2.75rem', letterSpacing: '-0.02rem' },
        ],
        'display-lg': [
          '2.5rem',
          { lineHeight: '3.125rem', letterSpacing: '-0.02rem' },
        ],
        'display-xl': [
          '2.75rem',
          { lineHeight: '3.5rem', letterSpacing: '-0.02rem' },
        ],
      },
      boxShadow: {
        'xs': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'sm': '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)',
        'md': '0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10)',
        'lg': '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
        'xl': '0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
        '2xl': '0px 24px 48px -12px rgba(16, 24, 40, 0.18)',
        '3xl': '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      backdropBlur: {
        md: '16px',
      },
    },
  },
  plugins: [
    animate,
    iconsPlugin({
      collections: getIconCollections(['fluent']),
    }),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.ring-primary-shadow-xs': {
          boxShadow:
    				'0px 0px 0px 4px rgb(var(--color-primary-500) / 0.24), 0px 1px 2px 0px rgb(var(--color-gray-900) / 0.05)',
        },
      })
    }),
  ],
}
