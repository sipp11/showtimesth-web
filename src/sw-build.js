const fs = require("fs-extra")
const pathmodule = require("path")
const workbox = require("workbox-build")

function build() {
  const cwd = process.cwd()
  const pkgPath = `${cwd}/node_modules/workbox-sw/package.json`
  const pkg = require(pkgPath)
  const readPath = `${cwd}/node_modules/workbox-sw/${pkg.main}`
  let data = fs.readFileSync(readPath, "utf8")
  let path = `${cwd}/build/workbox-sw.js`
  console.log(`Writing ${path}.`)
  fs.writeFileSync(path, data, "utf8")
  data = fs.readFileSync(`${readPath}.map`, "utf8")
  path = `${cwd}/build/${pathmodule.basename(pkg.main)}.map`
  console.log(`Writing ${path}.`)
  fs.writeFileSync(path, data, "utf8")

  workbox
    .injectManifest({
      globDirectory: "build",
      globPatterns: ["**/*.{html,js,css,png,jpg,json}"],
      globIgnores: [
        "sw-default.js",
        "serviceWorker.js",
        "workbox-sw.js"
      ],
      swSrc: "src/sw.js",
      swDest: "build/sw.js"
    })
    .then(_ => {
      console.log("Service worker generated.")
    })
}

try {
  build()
} catch (e) {
  console.log(e)
}
