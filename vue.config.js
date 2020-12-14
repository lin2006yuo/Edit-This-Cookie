const CopyWebpackPlugin = require("copy-webpack-plugin")
const path = require("path")

// Generate pages object
const pagesObj = {}

const chromeName = ["popup", "options"]

chromeName.forEach((name) => {
  pagesObj[name] = {
    entry: `src/${name}/index.js`,
    template: "public/index.html",
    filename: `${name}.html`,
  }
})

const plugins =
  process.env.NODE_ENV === "production"
    ? [
        {
          from: path.resolve("src/manifest.production.json"),
          to: `${path.resolve("dist")}/manifest.json`,
        },
        {
          from: path.resolve("src/script/content-script.js"),
          to: `${path.resolve("dist")}/js/content-script.js`,
        },
        {
          from: path.resolve("src/script/background.js"),
          to: `${path.resolve("dist")}/js/background.js`,
        },
        {
          from: path.resolve("src/assets/img/icon_32x32.png"),
          to: `${path.resolve("dist")}/img/icon.png`,
        },
      ]
    : [
        {
          from: path.resolve("src/manifest.development.json"),
          to: `${path.resolve("dist")}/manifest.json`,
        },
        {
          from: path.resolve("src/script/content-script.js"),
          to: `${path.resolve("dist")}/js/content-script.js`,
        },
        {
          from: path.resolve("src/script/background.js"),
          to: `${path.resolve("dist")}/js/background.js`,
        },
        {
          from: path.resolve("src/assets/img/icon_32x32.png"),
          to: `${path.resolve("dist")}/img/icon.jpg`,
        },
      ]

module.exports = {
  pages: pagesObj,
  configureWebpack: {
    plugins: [CopyWebpackPlugin(plugins)],
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg")
    svgRule.uses.clear()

    svgRule
      .use("babel-loader")
      .loader("babel-loader")
      .end()
      .use("vue-svg-loader")
      .loader("vue-svg-loader")
    // .options({
    //   svgo: {
    //     plugins: [
    //       {
    //         prefixIds: {
    //           prefix: (node, { path }) => basename(path, '.svg'),
    //           delim: '-',
    //         },
    //       },
    //     ],
    //   },
    // });
  },
}
