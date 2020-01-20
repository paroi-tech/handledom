const { existsSync } = require("fs")
const { mkdir, writeFile } = require("fs").promises
const { join, resolve } = require("path")
const webpack = require("webpack")
const { rollup } = require("rollup")
const commonjsPlugin = require("@rollup/plugin-commonjs");

const packageDir = resolve(__dirname, "..")
const outputDir = packageDir

async function build() {
  if (!existsSync(outputDir))
    await mkdir(outputDir)
  await bundleWithRollup(join(packageDir, "compiled-esm", "api.compiler.js"), "compiler", "commonjs")
  await bundleWithRollup(join(packageDir, "compiled-esm", "api.template-string.js"), "template-string", "commonjs")
  await bundleWithWebpack(join(packageDir, "compiled-es5", "api.browser.js"), "browser")
  // await bundleWithWebpack(join(packageDir, "compiled-es5", "api.browser.js"), "browser.development", "development")
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

async function bundleWithWebpack(mainFile, bundleName, mode = "production") {
  await webpackAsync({
    mode,
    entry: mainFile,
    output: {
      library: "handledom",
      libraryTarget: "umd",
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
