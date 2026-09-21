import assert from "node:assert/strict";
import test from "node:test";
import { buildFirebaseCommand, selectJavaRuntime } from "../../scripts/start-auth-emulator.mjs";

test("selects a compatible SIVI_JAVA_HOME before other Java candidates", () => {
  const selected = selectJavaRuntime({
    env: {
      SIVI_JAVA_HOME: "C:\\portable-jdk-21",
      JAVA_HOME: "C:\\legacy-jdk-8",
      Path: "C:\\Windows\\System32",
    },
    platform: "win32",
    probeJava: (candidate) => ({
      status: 0,
      stderr: candidate.source === "SIVI_JAVA_HOME"
        ? 'openjdk version "21.0.12"'
        : 'openjdk version "1.8.0_452"',
    }),
  });

  assert.equal(selected.source, "SIVI_JAVA_HOME");
  assert.equal(selected.command, "C:\\portable-jdk-21\\bin\\java.exe");
  assert.equal(selected.env.JAVA_HOME, "C:\\portable-jdk-21");
  assert.match(selected.env.Path, /^C:\\portable-jdk-21\\bin;/);
});

test("rejects Java 8 and invalid candidates before Firebase starts", () => {
  assert.throws(
    () => selectJavaRuntime({
      env: {
        SIVI_JAVA_HOME: "C:\\legacy-jdk-8",
        JAVA_HOME: "C:\\missing-jdk",
        Path: "C:\\Windows\\System32",
      },
      platform: "win32",
      probeJava: (candidate) => {
        if (candidate.source === "SIVI_JAVA_HOME") {
          return { status: 0, stderr: 'openjdk version "1.8.0_452"' };
        }
        return { status: 1, stderr: "java was not found" };
      },
    }),
    /requires JDK 11 or newer\. No compatible Java was found\. Checked: SIVI_JAVA_HOME=Java 8; JAVA_HOME=unavailable; PATH=unavailable/,
  );
});

test("clears an incompatible JAVA_HOME when falling back to PATH", () => {
  const selected = selectJavaRuntime({
    env: {
      SIVI_JAVA_HOME: "C:\\legacy-sivi-jdk-8",
      JAVA_HOME: "C:\\legacy-jdk-8",
      Path: "C:\\portable-jdk-21\\bin;C:\\Windows\\System32",
    },
    platform: "win32",
    probeJava: (candidate) => ({
      status: 0,
      stderr: candidate.source === "PATH"
        ? 'openjdk version "21.0.12"'
        : 'openjdk version "1.8.0_452"',
    }),
  });

  assert.equal(selected.source, "PATH");
  assert.equal(selected.env.JAVA_HOME, undefined);
  assert.equal(selected.env.Path, "C:\\portable-jdk-21\\bin;C:\\Windows\\System32");
});

test("starts Firebase through cmd.exe on Windows", () => {
  assert.deepEqual(buildFirebaseCommand("win32"), {
    command: "cmd.exe",
    args: ["/d", "/s", "/c", "npx firebase emulators:start --only auth,database --project sivi-org"],
  });
});
