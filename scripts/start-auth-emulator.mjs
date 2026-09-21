import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const MINIMUM_JAVA_MAJOR = 11;

function getPathKey(env) {
  return Object.keys(env).find((key) => key.toUpperCase() === "PATH") ?? "PATH";
}

function getJavaMajor(output) {
  const version = output.match(/version\s+"([^"\s]+)"/)?.[1];
  if (!version) return null;

  const [first, second] = version.split(".");
  const major = Number(first === "1" ? second : first);
  return Number.isInteger(major) ? major : null;
}

function getPathApi(platform) {
  return platform === "win32" ? path.win32 : path.posix;
}

function createCandidate(source, javaHome, env, platform) {
  const pathApi = getPathApi(platform);
  const pathKey = getPathKey(env);
  const pathValue = env[pathKey] ?? "";
  const javaName = platform === "win32" ? "java.exe" : "java";
  const command = javaHome ? pathApi.join(javaHome, "bin", javaName) : javaName;
  const childEnv = { ...env };

  if (javaHome) {
    childEnv.JAVA_HOME = javaHome;
    childEnv[pathKey] = `${pathApi.join(javaHome, "bin")}${pathApi.delimiter}${pathValue}`;
  } else {
    delete childEnv.JAVA_HOME;
  }

  return { source, command, env: childEnv };
}

function defaultProbeJava(candidate) {
  return spawnSync(candidate.command, ["-version"], {
    encoding: "utf8",
    env: candidate.env,
    windowsHide: true,
  });
}

export function selectJavaRuntime({
  env = process.env,
  platform = process.platform,
  probeJava = defaultProbeJava,
} = {}) {
  const candidates = [
    env.SIVI_JAVA_HOME && createCandidate("SIVI_JAVA_HOME", env.SIVI_JAVA_HOME, env, platform),
    env.JAVA_HOME && createCandidate("JAVA_HOME", env.JAVA_HOME, env, platform),
    createCandidate("PATH", null, env, platform),
  ].filter(Boolean);
  const diagnostics = [];

  for (const candidate of candidates) {
    const result = probeJava(candidate);
    const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
    const major = result.status === 0 ? getJavaMajor(output) : null;

    if (major !== null && major >= MINIMUM_JAVA_MAJOR) {
      return { ...candidate, major };
    }

    diagnostics.push(
      `${candidate.source}=${major === null ? "unavailable" : `Java ${major}`}`,
    );
  }

  throw new Error(
    `Firebase Auth Emulator requires JDK ${MINIMUM_JAVA_MAJOR} or newer. `
      + `No compatible Java was found. Checked: ${diagnostics.join("; ")}. `
      + "Set SIVI_JAVA_HOME to a compatible JDK.",
  );
}

export function buildFirebaseCommand(platform = process.platform) {
  const firebaseArgs = ["firebase", "emulators:start", "--only", "auth,database", "--project", "sivi-org"];

  if (platform === "win32") {
    return {
      command: "cmd.exe",
      args: ["/d", "/s", "/c", `npx ${firebaseArgs.join(" ")}`],
    };
  }

  return { command: "npx", args: firebaseArgs };
}

export function startAuthEmulator({
  env = process.env,
  platform = process.platform,
  spawnChild = spawn,
} = {}) {
  const java = selectJavaRuntime({ env, platform });
  const firebase = buildFirebaseCommand(platform);
  const child = spawnChild(
    firebase.command,
    firebase.args,
    { env: java.env, stdio: "inherit", windowsHide: true },
  );

  child.once("error", (error) => {
    process.stderr.write(`Unable to start Firebase Auth Emulator: ${error.message}\n`);
    process.exitCode = 1;
  });
  child.once("exit", (code) => {
    process.exitCode = code ?? 1;
  });
  return child;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  startAuthEmulator();
}
