import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Basic rules
      'no-console': 'warn', // Warns about console.log statements
      'no-undef': 'error', // Prevents use of undefined variables
      semi: ['error', 'never'], // Disallows semicolons
      quotes: ['error', 'single'], // Enforces single quotes
      indent: ['error', 2, { SwitchCase: 1 }], // Enforces 2-space indentation
      'comma-dangle': ['error', 'never'], // Disallows trailing commas
      eqeqeq: 'error', // Enforces strict equality (===)

      // Best practices
      'no-eval': 'error', // Disallows eval()
      'no-implicit-globals': 'error', // Prevents implicit global variables

      // React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off'
    },
    overrides: [
      {
        files: ['wsManager.ts'],
        rules: {
          'no-restricted-syntax': ['error', {
            selector: 'TSEnumDeclaration',
            message: 'No se permiten enums'
          }]
        }
      }
    ]
  }
]

export default eslintConfig
