const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

const list = fs.readdirSync(path.resolve('.'))

const ITEMS_DIRECTORY = 'items'

rimraf.sync(ITEMS_DIRECTORY)
fs.mkdirSync(ITEMS_DIRECTORY)

for (const dir of list) {
  const source = `${dir}/item.zip`
  if (fs.existsSync(path.resolve(source))) {
    const dest = `${ITEMS_DIRECTORY}/${dir}.zip`
    console.log(`Copying ${source} into ${dest}`)
    fs.copyFileSync(source, dest)
  }
}
