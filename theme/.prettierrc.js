module.exports = {
  useTabs: false,
  tabWidth: 2,
  printWidth: 120,
  bracketSpacing: false,
  bracketSameLine: false,
  semi: true,
  arrowParens: 'always',
  singleQuote: true,
  liquidSingleQuote: false,
  embeddedSingleQuote: true,
  indentSchema: false,
  overrides: [
    {
      files: '**/*.liquid',
      options: {
        singleQuote: false,
        liquidSingleQuote: true,
      },
    },
    {
      files: '**/*.json',
      excludeFiles: '**/settings_schema.json',
      options: {
        printWidth: 0,
      },
    },
    {
      files: '**/settings_schema.json',
      options: {
        printWidth: 120,
      },
    },
  ],
  // TODO figure out how to make prettier-plugin-tailwindcss work with prettier-vscode
  // Right now it breaks because it tries to run tailwind when formatting which includes stuff
  // from @groupthought/tradecraft-build. That breaks because prettier-vscode is not run from the theme
  // directory but from the user's root directory which breaks the ability of @groupthought/tradecraft-build
  // to find the theme root.
  // plugins: ['@shopify/prettier-plugin-liquid', 'prettier-plugin-tailwindcss'],
  plugins: ['@shopify/prettier-plugin-liquid'],
};
