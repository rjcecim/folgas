import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import type { BankHoursSettings } from "@/types";
import {
  DEFAULT_BANK_BALANCE_HOURS,
  DEFAULT_DAILY_WORK_HOURS,
} from "@/lib/constants";
import { getFirebaseDb } from "./client";
import { BANK_HOURS_DOC, COLLECTIONS } from "./collections";

const defaultSettings = (): BankHoursSettings => ({
  currentBalanceHours: DEFAULT_BANK_BALANCE_HOURS,
  dailyWorkHours: DEFAULT_DAILY_WORK_HOURS,
  updatedAt: new Date().toISOString(),
});

export function watchBankHours(callback: (settings: BankHoursSettings) => void) {
  const ref = doc(getFirebaseDb(), COLLECTIONS.settings, BANK_HOURS_DOC);

  return onSnapshot(ref, async (snapshot) => {
    if (!snapshot.exists()) {
      const initial = defaultSettings();
      await setDoc(ref, {
        ...initial,
        updatedAt: serverTimestamp(),
        updatedAtIso: initial.updatedAt,
      });
      callback(initial);
      return;
    }

    const data = snapshot.data();
    callback({
      currentBalanceHours: Number(data.currentBalanceHours ?? 0),
      dailyWorkHours: Number(data.dailyWorkHours ?? DEFAULT_DAILY_WORK_HOURS),
      updatedAt: String(data.updatedAtIso ?? ""),
    });
  });
}

export async function saveBankHours(settings: Omit<BankHoursSettings, "updatedAt">) {
  const now = new Date().toISOString();
  await setDoc(
    doc(getFirebaseDb(), COLLECTIONS.settings, BANK_HOURS_DOC),
    {
      ...settings,
      updatedAt: serverTimestamp(),
      updatedAtIso: now,
    },
    { merge: true },
  );
}
