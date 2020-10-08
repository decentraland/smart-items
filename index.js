const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const { exec } = require("child_process");

const list = fs
  .readdirSync(path.resolve("."))
  .filter((dir) => fs.existsSync(path.resolve(`${dir}/asset.json`)));

const ITEMS_DIRECTORY = "items";

const dcl = require.resolve(".bin/dcl");

rimraf.sync(ITEMS_DIRECTORY);
fs.mkdirSync(ITEMS_DIRECTORY);

var errors = [];

const baseTsConfigItem = JSON.parse(
  fs.readFileSync("tsconfig.item-base.json").toString()
);

// checks asset.json#id and updates the ID in the tsconfig.json
async function generateItemJs(dir) {
  const assetJson = JSON.parse(
    fs.readFileSync(path.resolve(dir, "asset.json")).toString()
  );

  if (!assetJson.id) {
    throw new Error(`${path.resolve(dir, "asset.json")} has no id field`);
  }

  baseTsConfigItem.compilerOptions.bundledPackageName = assetJson.id;

  fs.writeFileSync(
    path.resolve(dir, "tsconfig.item.json"),
    JSON.stringify(baseTsConfigItem, null, 2)
  );

  const tsc = require.resolve("typescript/bin/tsc");

  try {
    await execute(dir, `${tsc} -p tsconfig.item.json`);
  } catch (e) {
    errors.push({ dir, error: e });
  }
}

async function build() {
  try {
    console.log("Installing typescript@4.1");
    await execute(process.cwd(), "npm install typescript@4.1");
  } catch {
    console.log("Installing typescript@beta");
    await execute(process.cwd(), "npm install typescript@beta");
  }
  try {
    fs.mkdirSync("shared-node_modules");
  } catch {}

  let count = 1;
  const total = list.length;
  for (const dir of list) {
    console.log(`[${count}/${total}] Building ${dir}...`);
    try {
      try {
        await execute(dir, "rm -rf node_modules");
      } catch {}
      await execute(dir, "ln -s ../shared-node_modules node_modules");
      await execute(dir, "npm install --no-audit");
      await generateItemJs(dir);
      await execute(dir, `${dcl} pack`);
    } catch (e) {
      errors.push({ dir, error: e });
    }
    count++;
  }

  if (errors.length) {
    for (let { dir, error } of errors) {
      console.log(`\nError in folder: ${dir}`);
      console.log(error.toString());
    }
    throw new Error("Completed with errors");
  }

  console.log("Done!");
}

async function pack() {
  let count = 1;
  const total = list.length;
  for (const dir of list) {
    const source = `${dir}/item.zip`;
    const isValid = fs.existsSync(path.resolve(source));
    if (isValid) {
      const dest = `${ITEMS_DIRECTORY}/${dir}.zip`;
      console.log(`[${count}/${total}] Copying ${source} into ${dest}...`);
      fs.copyFileSync(source, dest);
    }
    count++;
  }
  console.log("Done!");
}

async function execute(dir, command) {
  return new Promise((onSuccess, onError) => {
    console.log(`> ${command}`);
    exec(command, { cwd: dir, shell: true }, (error, stdout, stderr) => {
      stdout.trim().length && console.log("  " + stdout.replace(/\n/g, "\n  "));
      stderr.trim().length &&
        console.error("! " + stderr.replace(/\n/g, "\n  "));

      if (error) {
        onError(new Error(stderr || `${command} failed`));
      } else {
        onSuccess(stdout);
      }
    });
  });
}

if (process.env.BUILD) {
  build().catch((err) => {
    console.log(err);
    process.exit(1);
  });
} else {
  pack().catch((err) => {
    console.log(err);
    process.exit(1);
  });
}
