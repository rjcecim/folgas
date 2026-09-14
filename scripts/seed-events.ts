import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { OFF_DAYS_2026 } from "./official-old-2026";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "folgas-rjcecim";
const require = createRequire(import.meta.url);

function toFirestoreFields(data: Record<string, string | number | boolean>) {
  const fields: Record<string, Record<string, string | boolean>> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "boolean") fields[key] = { booleanValue: value };
    else if (typeof value === "number") fields[key] = { integerValue: String(value) };
    else fields[key] = { stringValue: value };
  }
  return fields;
}

async function seedWithCli() {
  const toolsRoot = resolve(
    process.env.APPDATA || "",
    "npm/node_modules/firebase-tools",
  );
  const { Client } = require(resolve(toolsRoot, "lib/apiv2.js"));
  const { firestoreOrigin } = require(resolve(toolsRoot, "lib/api.js"));
  const { getGlobalDefaultAccount } = require(resolve(toolsRoot, "lib/auth.js"));
  const { requireAuth } = require(resolve(toolsRoot, "lib/requireAuth.js"));
  const account = getGlobalDefaultAccount();
  if (!account) {
    throw new Error("Firebase CLI sem conta autenticada. Rode firebase login.");
  }
  await requireAuth({
    project: PROJECT_ID,
    user: account.user,
    tokens: account.tokens,
  });
  const client = new Client({
    urlPrefix: firestoreOrigin(),
    apiVersion: "v1",
    auth: true,
  });

  const root = `projects/${PROJECT_ID}/databases/(default)/documents`;
  let created = 0;
  let updated = 0;

  for (const event of OFF_DAYS_2026) {
    const name = `${root}/events/${event.id}`;
    let existingNotes = event.notes;
    let exists = false;
    try {
      const current = await client.get(`/${name}`);
      exists = true;
      existingNotes = current.body.fields?.notes?.stringValue ?? event.notes;
    } catch {
      exists = false;
    }

    const now = new Date().toISOString();
    const payload = {
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      type: event.type,
      nature: event.nature,
      official: true,
      status: "official",
      bankHoursImpact: 0,
      includeInProjection: false,
      legalBasis: event.legalBasis,
      notes: existingNotes,
      updatedAtIso: now,
      ...(exists ? {} : { createdAtIso: now }),
    };

    await client.patch(`/${name}`, { fields: toFirestoreFields(payload) });
    if (exists) updated += 1;
    else created += 1;
  }

  const settingsName = `${root}/settings/bankHours`;
  try {
    await client.get(`/${settingsName}`);
  } catch {
    await client.patch(`/${settingsName}`, {
      fields: toFirestoreFields({
        currentBalanceHours: 0,
        dailyWorkHours: 8,
        updatedAtIso: new Date().toISOString(),
      }),
    });
  }

  return { created, updated };
}

async function seedWithAdmin() {
  const { cert, getApps, initializeApp } = await import("firebase-admin/app");
  const { FieldValue, getFirestore } = await import("firebase-admin/firestore");
  const fromEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const localPath = resolve(process.cwd(), ".secrets", "serviceAccount.json");
  const path = fromEnv && existsSync(fromEnv) ? fromEnv : existsSync(localPath) ? localPath : null;
  if (!path) {
    throw new Error("Sem service account.");
  }

  if (!getApps()[0]) {
    initializeApp({
      credential: cert(JSON.parse(readFileSync(path, "utf8"))),
      projectId: PROJECT_ID,
    });
  }

  const db = getFirestore();
  let created = 0;
  let updated = 0;

  for (const event of OFF_DAYS_2026) {
    const ref = db.collection("events").doc(event.id);
    const current = await ref.get();
    const payload = {
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      type: event.type,
      nature: event.nature,
      official: true,
      status: "official",
      bankHoursImpact: 0,
      includeInProjection: false,
      legalBasis: event.legalBasis,
      notes: current.exists ? String(current.get("notes") ?? event.notes) : event.notes,
      updatedAt: FieldValue.serverTimestamp(),
      updatedAtIso: new Date().toISOString(),
    };

    if (current.exists) {
      await ref.set(payload, { merge: true });
      updated += 1;
    } else {
      await ref.set({
        ...payload,
        createdAt: FieldValue.serverTimestamp(),
        createdAtIso: new Date().toISOString(),
      });
      created += 1;
    }
  }

  const settingsRef = db.collection("settings").doc("bankHours");
  if (!(await settingsRef.get()).exists) {
    await settingsRef.set({
      currentBalanceHours: 0,
      dailyWorkHours: 8,
      updatedAt: FieldValue.serverTimestamp(),
      updatedAtIso: new Date().toISOString(),
    });
  }

  return { created, updated };
}

async function seed() {
  let result: { created: number; updated: number };
  try {
    result = await seedWithAdmin();
    console.log("Seed via Firebase Admin.");
  } catch {
    result = await seedWithCli();
    console.log("Seed via Firebase CLI.");
  }

  console.log(`Eventos oficiais processados: ${OFF_DAYS_2026.length}`);
  console.log(`Criados: ${result.created}`);
  console.log(`Atualizados: ${result.updated}`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
