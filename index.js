const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const { spawn } = require('child_process')

const list = fs
  .readdirSync(path.resolve('.'))
  .filter(dir => fs.existsSync(path.resolve(`${dir}/asset.json`)))

const ITEMS_DIRECTORY = 'items'

rimraf.sync(ITEMS_DIRECTORY)
fs.mkdirSync(ITEMS_DIRECTORY)

async function build() {
  let count = 1
  const total = list.length
  for (const dir of list) {
    console.log(`[${count}/${total}] Building ${dir}...`)
    await execute(dir, 'npm', ['install'])
    await execute(dir, 'dcl', ['pack'])
    count++
  }
  console.log('Done!')
}

async function pack() {
  let count = 1
  const total = list.length
  for (const dir of list) {
    const source = `${dir}/item.zip`
    const isValid = fs.existsSync(path.resolve(source))
    if (isValid) {
      const dest = `${ITEMS_DIRECTORY}/${dir}.zip`
      console.log(`[${count}/${total}] Copying ${source} into ${dest}...`)
      fs.copyFileSync(source, dest)
    }
    count++
  }
  console.log('Done!')
}

async function execute(dir, command, commands) {
  return new Promise((resolve, reject) => {
    const cwd = path.join(process.cwd(), dir)
    const subprocess = spawn(command, commands, {
      cwd,
      shell: true
    })
    // subprocess.stdout.on('data', data => console.log(data.toString()))
    // subprocess.stderr.on('data', data => console.log(data.toString()))
    subprocess.on('close', resolve)
  })
}

if (process.env.BUILD) {
  build().catch(console.log)
} else {
  pack().catch(console.log)
}
