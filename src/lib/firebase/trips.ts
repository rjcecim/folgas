import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import type { CalendarEvent } from "@/types";
import { getFirebaseDb } from "./client";
import { COLLECTIONS } from "./collections";

export async function syncTripFromEvent(event: CalendarEvent) {
  const now = new Date().toISOString();
  await setDoc(doc(getFirebaseDb(), COLLECTIONS.trips, event.id), {
    title: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    notes: event.notes,
    eventId: event.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdAtIso: event.createdAt || now,
    updatedAtIso: now,
  });
}

export async function removeTrip(id: string) {
  await deleteDoc(doc(getFirebaseDb(), COLLECTIONS.trips, id));
}
