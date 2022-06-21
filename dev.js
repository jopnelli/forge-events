const kill = require("kill-port");
const exec = require("child_process").exec;
const { host } = require("minimist")(process.argv.slice(2));
if (!host) {
  console.error(
    "No hostname specified. You probably want to start this command with sth. like: node dev.js --host yourname"
  );
  return;
}
const ports = [2408, 3000, 3001, 3002, 4400, 4500, 8010, 8080, 57016];
const commands = [
  `./loophole http 8080 --hostname ${host.toLowerCase()}`,
  `export FORGE_USER_VAR_LOOPHOLE_HOST="${host.toLowerCase()}"; npm run forge:tunnel`,
  "cd static/globalPage/; npm run start",
  "cd remote; firebase emulators:start --only firestore",
  "cd remote/run/events-app; npm run serve ",
];

const ttabBin = `${__dirname}/node_modules/ttab/bin/ttab`;
const ttabCmd = `${ttabBin} -d ${__dirname} `;

async function run() {
  const loopHoleVersion = await getLoopholeVersion().catch(() => {
    console.error(
      "Loophole not found. The binary for this tool must be placed in the root of this project AND you have to be LOGGED IN. Download it from here: https://loophole.cloud/download"
    );
  });
  if (!loopHoleVersion) {
    return;
  }
  await killApplicationsOnNeededPorts();
  await Promise.all(
    commands.map((command) => {
      console.log(ttabCmd + command);
      return shellCommand(`${ttabCmd}'${command}'`);
    })
  ).catch((e) => {
    console.log("error", e);
  });
}

function getLoopholeVersion() {
  return shellCommand(" ./loophole --version");
}

function killApplicationsOnNeededPorts() {
  return Promise.all(ports.map(kill));
}

function shellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
        return;
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

run();
