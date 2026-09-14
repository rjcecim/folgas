import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { CalendarEvent, CalendarEventInput } from "@/types";
import { getFirebaseDb } from "./client";
import { COLLECTIONS } from "./collections";

function mapEvent(id: string, data: Record<string, unknown>): CalendarEvent {
  return {
    id,
    title: String(data.title ?? ""),
    startDate: String(data.startDate ?? ""),
    endDate: String(data.endDate ?? ""),
    type: data.type as CalendarEvent["type"],
    nature: String(data.nature ?? ""),
    official: Boolean(data.official),
    status: data.status as CalendarEvent["status"],
    bankHoursImpact: Number(data.bankHoursImpact ?? 0),
    includeInProjection: Boolean(data.includeInProjection),
    legalBasis: String(data.legalBasis ?? ""),
    notes: String(data.notes ?? ""),
    createdAt: String(data.createdAtIso ?? data.createdAt ?? ""),
    updatedAt: String(data.updatedAtIso ?? data.updatedAt ?? ""),
  };
}

export function watchEvents(callback: (events: CalendarEvent[]) => void) {
  const eventsQuery = query(
    collection(getFirebaseDb(), COLLECTIONS.events),
    orderBy("startDate", "asc"),
  );

  return onSnapshot(eventsQuery, (snapshot) => {
    callback(snapshot.docs.map((item) => mapEvent(item.id, item.data())));
  });
}

export async function saveEvent(id: string, input: CalendarEventInput, isNew: boolean) {
  const now = new Date().toISOString();
  const ref = doc(getFirebaseDb(), COLLECTIONS.events, id);

  if (isNew) {
    await setDoc(ref, {
      ...input,
      createdAtIso: now,
      updatedAtIso: now,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  await updateDoc(ref, {
    ...input,
    updatedAtIso: now,
    updatedAt: serverTimestamp(),
  });
}

export async function removeEvent(id: string) {
  await deleteDoc(doc(getFirebaseDb(), COLLECTIONS.events, id));
}
