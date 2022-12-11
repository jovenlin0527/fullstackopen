/* eslint-env node */
module.exports = {
  "env": {
      "browser": true,
      "es2020": true,
      "jest/globals": true,
      "cypress/globals": true
  },
  "extends": [ 
      "eslint:recommended",
      "plugin:react/recommended"
  ],
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      },
      "ecmaVersion": 2020,
      "sourceType": "module"
  },
  "plugins": [
      "react", "jest", "react-hooks", "cypress"
  ],
  "rules": {
      "indent": "off",
      "linebreak-style": [
          "error",
          "unix"
      ],
      "quotes": [
          "error",
          "single",
          {
            "avoidEscape": true
          }
      ],
      "semi": [
          "error",
          "never"
      ],
    "eqeqeq": [
      "error",
      "smart"
    ],
    "no-unused-vars": [
      "error",
      {
        "vars": "all",
        "varsIgnorePattern": "^_.*",
        "argsIgnorePattern": "^_.*",

      }

    ],
      "no-trailing-spaces": "error",
      "object-curly-spacing": [
          "error", "always"
      ],
      "arrow-spacing": [
          "error", { "before": true, "after": true }
      ],
      "no-console": 0,
      "react/prop-types": 0,
      "react/react-in-jsx-scope": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
