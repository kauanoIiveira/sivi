import { query, orderByChild, orderByKey, equalTo, endBefore, limitToFirst, limitToLast, get, onValue, push, ref, runTransaction, serverTimestamp, set, update } from "firebase/database";

export function createFirebaseDataClient(database) {
  return Object.freeze({
    async findUserByEmail(email) {
      const snapshot = await get(query(ref(database, "users"), orderByChild("email"), equalTo(email), limitToFirst(2)));
      return snapshot.exists() ? snapshot.val() : null;
    },
    async read(path) {
      const snapshot = await get(ref(database, path));
      return snapshot.exists() ? snapshot.val() : null;
    },
    watchByChild(path, field, value, onData, onError) {
      return onValue(query(ref(database, path), orderByChild(field), equalTo(value)),
        snapshot => onData(snapshot.val()), onError);
    },
    watchLatest(path, count, onData, onError) {
      return onValue(query(ref(database, path), orderByKey(), limitToLast(count)),
        snapshot => onData(snapshot.val()), onError);
    },
    watchConnection(onData) {
      return onValue(ref(database, ".info/connected"), snapshot => onData(snapshot.val() === true));
    },
    async readBefore(path, cursor, count) {
      const snapshot = await get(query(ref(database, path), orderByKey(), endBefore(cursor), limitToLast(count)));
      return snapshot.val();
    },
    write(path, value) {
      return set(ref(database, path), value);
    },
    patch(updates) {
      return update(ref(database), updates);
    },
    async transaction(path, updater) {
      const result = await runTransaction(ref(database, path), updater, { applyLocally: false });
      return { committed: result.committed, value: result.snapshot.val() };
    },
    newKey(path) {
      return push(ref(database, path)).key;
    },
    timestamp() {
      return serverTimestamp();
    },
  });
}
