import { normalizeApplication } from "../domain/organization-application.js";
import { resolvePlan, planQuote } from "../domain/public-signup.js";

const KEY = "sivi.signup-drafts.v1";
const TTL = 7 * 24 * 60 * 60 * 1000;
const emailKey = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();
export function createSignupDraftStore({
  storage,
  now = Date.now,
  idFactory = () => globalThis.crypto.randomUUID(),
} = {}) {
  let persistent = Boolean(storage),
    records = [];
  try {
    const raw = JSON.parse(storage?.getItem(KEY) ?? "[]");
    if (Array.isArray(raw)) records = raw;
  } catch {
    persistent = false;
  }
  const refresh = () => {
    if (!persistent) return;
    try {
      const raw = JSON.parse(storage.getItem(KEY) ?? "[]");
      records = (Array.isArray(raw) ? raw : [])
        .filter(
          (d) =>
            d &&
            typeof d.id === "string" &&
            typeof d.email === "string" &&
            Number.isFinite(d.expiresAt) &&
            d.expiresAt > now(),
        )
        .flatMap((d) => {
          try {
            return [
              {
                id: d.id,
                email: emailKey(d.email),
                uid: typeof d.uid === "string" ? d.uid : undefined,
                organization: normalizeApplication(d.organization),
                plan: resolvePlan(d.plan).id,
                period: planQuote(d.plan, d.period).period,
                expiresAt: d.expiresAt,
                organizationId:
                  typeof d.organizationId === "string"
                    ? d.organizationId
                    : undefined,
              },
            ];
          } catch {
            return [];
          }
        });
    } catch {
      persistent = false;
    }
  };
  const save = () => {
    records = records.filter((d) => d.expiresAt > now());
    try {
      storage?.setItem(KEY, JSON.stringify(records));
    } catch {
      persistent = false;
    }
  };
  const owned = (draft, user) =>
    draft &&
    draft.expiresAt > now() &&
    user?.uid &&
    emailKey(user.email) === draft.email &&
    (!draft.uid || draft.uid === user.uid);
  return {
    get persistent() {
      return persistent;
    },
    stage({ email, organization, plan, period }) {
      refresh();
      const normalized = normalizeApplication(organization);
      const key = emailKey(email);
      records = records.filter((d) => d.email !== key);
      const draft = {
        id: idFactory(),
        email: key,
        organization: normalized,
        plan: resolvePlan(plan).id,
        period: planQuote(plan, period).period,
        expiresAt: now() + TTL,
      };
      records.push(draft);
      save();
      return draft.id;
    },
    bind(id, user) {
      refresh();
      const draft = records.find((d) => d.id === id);
      if (!owned(draft, user)) return false;
      draft.uid = user.uid;
      save();
      return true;
    },
    read(user) {
      refresh();
      const draft = records.find((d) => owned(d, user));
      if (!draft) {
        save();
        return null;
      }
      if (!draft.uid) {
        draft.uid = user.uid;
        save();
      }
      return structuredClone(draft);
    },
    ensureAttempt(id, user) {
      refresh();
      const draft = records.find((d) => d.id === id);
      if (!owned(draft, user))
        throw Error("O rascunho expirou ou pertence a outra conta.");
      draft.uid = user.uid;
      draft.organizationId ??= `signup-${draft.id}`;
      save();
      return draft.organizationId;
    },
    remove(id, user) {
      refresh();
      records = records.filter((d) => !(d.id === id && owned(d, user)));
      save();
    },
  };
}
let shared;
export function signupDraftStore() {
  if (!shared) {
    let storage;
    try {
      storage = window.localStorage;
    } catch {}
    shared = createSignupDraftStore({ storage });
  }
  return shared;
}
