const { existsSync } = require("fs")
const { mkdir, writeFile } = require("fs").promises
const { join, resolve } = require("path")
const webpack = require("webpack")
const { rollup } = require("rollup")
const commonjsPlugin = require("@rollup/plugin-commonjs");

const packageDir = resolve(__dirname, "..")
const outputDir = join(packageDir, "dist")

async function build() {
  if (!existsSync(outputDir))
    await mkdir(outputDir)
  await bundleWithRollup(join(packageDir, "compiled-esm", "api.js"), "handledom", "commonjs")
  await bundleWithWebpack(join(packageDir, "compiled-es5", "api.browser.js"), "handledom.browser")
}

async function bundleWithRollup(mainFile, bundleName, format) {
  const bundle = await rollup({
    input: mainFile,
    external: [
      "antlr4", "antlr4/index",
    ],
    plugins: [commonjsPlugin()],
  })
  const { output } = await bundle.generate({
    format,
    name: "handledom",
    sourcemap: false,
    exports: "named"
  })
  const bundleCode = output[0].code
  await writeFile(join(outputDir, `${bundleName}.js`), bundleCode)
}

async function bundleWithWebpack(mainFile, bundleName) {
  await webpackAsync({
    mode: "production",
    entry: mainFile,
    output: {
      path: outputDir,
      filename: `${bundleName}.js`,
      // globalObject: "window", // preserve 'this' in TS's ES5 helpers
    },
    node: { module: "empty", net: "empty", fs: "empty" }
  })
}

/**
 * @param {webpack.Configuration} options
 * @returns {Promise<webpack.Stats>}
 */
function webpackAsync(options) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(options)
    compiler.run((err, stats) => {
      if (err)
        reject(err)
      else if (stats.compilation.errors.length > 0)
        reject(new Error(stats.compilation.errors.join("\n")))
      else
        resolve(stats)
    })
  })
}

build().catch(err => console.log(err.message, err.stack))
