module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss')('node_modules/@unrest/tailwind/tailwind.config.js'),
    // require('postcss-preset-env')({ stage: 1 }),
  ],
}
