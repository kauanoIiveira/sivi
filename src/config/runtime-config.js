const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export function resolveRuntimeConfig(url) {
  const target = new URL(url);
  const isLocalHttp = target.protocol === "http:" && LOCAL_HOSTS.has(target.hostname);
  const useAuthEmulator =
    isLocalHttp && target.searchParams.get("authEmulator") === "1";

  return Object.freeze({
    useAuthEmulator,
    useDatabaseEmulator: useAuthEmulator,
    persistUserProfile: !useAuthEmulator,
    authEmulatorUrl: "http://127.0.0.1:9099",
    databaseEmulatorHost: "127.0.0.1",
    databaseEmulatorPort: 9000,
  });
}

export const runtimeConfig =
  typeof window === "undefined" ? null : resolveRuntimeConfig(window.location.href);
