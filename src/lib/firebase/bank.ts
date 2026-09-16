import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import type { AdjustmentReason, BankAdjustment, BankAllocation, BankParcel, BankParcelInput } from "@/types/bank";
import { getFirebaseDb } from "./client";
import { COLLECTIONS } from "./collections";

function mapParcel(id: string, data: Record<string, unknown>): BankParcel {
  return {
    id,
    originYear: data.originYear == null ? null : Number(data.originYear),
    originMonth: data.originMonth == null ? null : Number(data.originMonth),
    extractMinutes: Number(data.extractMinutes ?? 0),
    expiresOn: data.expiresOn ? String(data.expiresOn) : null,
    reviewedOn: String(data.reviewedOn ?? ""),
    monthState: data.monthState === "open" ? "open" : "closed",
    notes: String(data.notes ?? ""),
    kind: data.kind === "legacy" ? "legacy" : "parcel",
    createdAt: String(data.createdAtIso ?? ""),
    updatedAt: String(data.updatedAtIso ?? ""),
  };
}

function mapAllocation(id: string, data: Record<string, unknown>): BankAllocation {
  return {
    id,
    eventId: String(data.eventId ?? ""),
    parcelId: String(data.parcelId ?? ""),
    minutes: Number(data.minutes ?? 0),
    mode: data.mode === "consumed" ? "consumed" : "reserved",
    asOf: String(data.asOf ?? ""),
    createdAt: String(data.createdAtIso ?? ""),
  };
}

function mapAdjustment(id: string, data: Record<string, unknown>): BankAdjustment {
  return {
    id,
    parcelId: String(data.parcelId ?? ""),
    previousMinutes: Number(data.previousMinutes ?? 0),
    nextMinutes: Number(data.nextMinutes ?? 0),
    reason: (data.reason as AdjustmentReason) ?? "manual",
    note: String(data.note ?? ""),
    createdAt: String(data.createdAtIso ?? ""),
  };
}

export function watchBankParcels(callback: (parcels: BankParcel[]) => void) {
  return onSnapshot(collection(getFirebaseDb(), COLLECTIONS.bankParcels), (snapshot) => {
    callback(snapshot.docs.map((item) => mapParcel(item.id, item.data())));
  });
}

export function watchBankAllocations(callback: (allocations: BankAllocation[]) => void) {
  return onSnapshot(collection(getFirebaseDb(), COLLECTIONS.bankAllocations), (snapshot) => {
    callback(snapshot.docs.map((item) => mapAllocation(item.id, item.data())));
  });
}

export function watchBankAdjustments(callback: (adjustments: BankAdjustment[]) => void) {
  return onSnapshot(collection(getFirebaseDb(), COLLECTIONS.bankAdjustments), (snapshot) => {
    const items = snapshot.docs.map((item) => mapAdjustment(item.id, item.data()));
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    callback(items);
  });
}

export async function upsertBankParcel(
  id: string,
  input: BankParcelInput,
  previous?: BankParcel,
  reason: AdjustmentReason = previous ? "reconcile" : "create",
  note = "",
) {
  const now = new Date().toISOString();
  const db = getFirebaseDb();
  const batch = writeBatch(db);
  batch.set(
    doc(db, COLLECTIONS.bankParcels, id),
    {
      originYear: input.originYear,
      originMonth: input.originMonth,
      extractMinutes: input.extractMinutes,
      expiresOn: input.expiresOn,
      reviewedOn: input.reviewedOn,
      monthState: input.monthState,
      notes: input.notes,
      kind: input.kind ?? "parcel",
      updatedAt: serverTimestamp(),
      updatedAtIso: now,
      ...(previous
        ? {}
        : {
            createdAt: serverTimestamp(),
            createdAtIso: now,
          }),
    },
    { merge: true },
  );

  if (!previous || previous.extractMinutes !== input.extractMinutes) {
    batch.set(doc(db, COLLECTIONS.bankAdjustments, `adj-${crypto.randomUUID()}`), {
      parcelId: id,
      previousMinutes: previous?.extractMinutes ?? 0,
      nextMinutes: input.extractMinutes,
      reason,
      note,
      createdAt: serverTimestamp(),
      createdAtIso: now,
    });
  }

  await batch.commit();
}

export async function replaceEventAllocations(eventId: string, allocations: BankAllocation[]) {
  const db = getFirebaseDb();
  const existing = await getDocs(
    query(collection(db, COLLECTIONS.bankAllocations), where("eventId", "==", eventId)),
  );
  const batch = writeBatch(db);
  for (const item of existing.docs) batch.delete(item.ref);
  for (const allocation of allocations) {
    batch.set(doc(db, COLLECTIONS.bankAllocations, allocation.id), {
      eventId: allocation.eventId,
      parcelId: allocation.parcelId,
      minutes: allocation.minutes,
      mode: allocation.mode,
      asOf: allocation.asOf,
      createdAt: serverTimestamp(),
      createdAtIso: allocation.createdAt,
    });
  }
  await batch.commit();
}

export async function deleteAllocationsForEvent(eventId: string) {
  const db = getFirebaseDb();
  const existing = await getDocs(
    query(collection(db, COLLECTIONS.bankAllocations), where("eventId", "==", eventId)),
  );
  const batch = writeBatch(db);
  for (const item of existing.docs) batch.delete(item.ref);
  if (!existing.empty) await batch.commit();
}

export async function markAllocationsConsumed(eventId: string) {
  const db = getFirebaseDb();
  const existing = await getDocs(
    query(collection(db, COLLECTIONS.bankAllocations), where("eventId", "==", eventId)),
  );
  await Promise.all(existing.docs.map((item) => updateDoc(item.ref, { mode: "consumed" })));
}

export async function deleteBankParcel(id: string) {
  await deleteDoc(doc(getFirebaseDb(), COLLECTIONS.bankParcels, id));
}
