import { query, orderByChild, equalTo, limitToFirst, get, push, ref, serverTimestamp, set, update } from "firebase/database";

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
    write(path, value) {
      return set(ref(database, path), value);
    },
    patch(updates) {
      return update(ref(database), updates);
    },
    newKey(path) {
      return push(ref(database, path)).key;
    },
    timestamp() {
      return serverTimestamp();
    },
  });
}
