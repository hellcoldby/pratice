module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../stories/*.stories.@(js|jsx|ts|tsx)",
    "../stories/*.stories.mdx",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-vite"
  },
  "features": {
    "storyStoreV7": true
  },
  reactOptions: {
    fastRefresh: true,
  },
}