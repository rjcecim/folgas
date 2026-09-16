import assert from "node:assert/strict";
import type { BankAllocation, BankParcel } from "../../types/bank";
import {
  allocateFromParcels,
  applyEventAllocations,
  expiresOnFromOriginMonth,
  markEventConsumed,
  moveLegacyMinutes,
  replaceExtractMinutes,
  restoreAllocations,
  summarizeBank,
} from "./bankLedger";
import { formatDuration, hoursMinutesToMinutes } from "./duration";

function parcel(
  id: string,
  extractMinutes: number,
  expiresOn: string | null,
  extras: Partial<BankParcel> = {},
): BankParcel {
  return {
    id,
    originYear: "originYear" in extras ? extras.originYear ?? null : 2026,
    originMonth: "originMonth" in extras ? extras.originMonth ?? null : 6,
    extractMinutes,
    expiresOn,
    reviewedOn: "2026-09-15",
    monthState: extras.monthState ?? "closed",
    notes: "",
    kind: extras.kind ?? "parcel",
    createdAt: "2026-09-15",
    updatedAt: "2026-09-15",
  };
}

assert.equal(expiresOnFromOriginMonth(2026, 5), "2026-09-30");
assert.equal(expiresOnFromOriginMonth(2026, 6), "2026-10-30");
assert.equal(expiresOnFromOriginMonth(2026, 7), "2026-11-30");
assert.equal(expiresOnFromOriginMonth(2026, 8), "2026-12-31");
assert.equal(expiresOnFromOriginMonth(2026, 9), "2027-01-30");
assert.equal(expiresOnFromOriginMonth(2026, 1), "2026-05-31");

const example = [
  parcel("maio", 0, "2026-09-30", { originMonth: 5 }),
  parcel("junho", 321, "2026-10-30", { originMonth: 6 }),
  parcel("julho", 155, "2026-11-30", { originMonth: 7 }),
  parcel("agosto", 957, "2026-12-31", { originMonth: 8 }),
  parcel("setembro", 106, null, { originMonth: 9, monthState: "open" }),
];

assert.equal(hoursMinutesToMinutes(5, 21), 321);
assert.equal(hoursMinutesToMinutes(2, 35), 155);
assert.equal(hoursMinutesToMinutes(15, 57), 957);
assert.equal(hoursMinutesToMinutes(1, 46), 106);
assert.equal(hoursMinutesToMinutes(25, 39), 1539);
assert.equal(formatDuration(321), "5h21");
assert.equal(formatDuration(1539), "25h39");
assert.notEqual(formatDuration(321), "5.21 h");

const asOf = "2026-09-15";
const summary = summarizeBank(example, [], asOf);
assert.equal(summary.registeredMinutes, 1539);
assert.equal(summary.pendingMinutes, 0);
assert.equal(summary.confirmedMinutes, 0 + 321 + 155 + 957 + 106);
assert.equal(summary.expiredMinutes, 0);

const updated = replaceExtractMinutes(example[1], 300);
assert.equal(updated.extractMinutes, 300);
assert.notEqual(updated.extractMinutes, 321 + 300);

const { picks, shortfall } = allocateFromParcels(example, [], 400, asOf);
assert.equal(shortfall, 0);
assert.equal(picks[0]?.parcelId, "junho");
assert.equal(picks[0]?.minutes, 321);
assert.equal(picks[1]?.parcelId, "julho");
assert.equal(picks[1]?.minutes, 79);

let allocations: BankAllocation[] = applyEventAllocations([], "leave-1", picks, "reserved", asOf);
assert.equal(summarizeBank(example, allocations, asOf).reservedMinutes, 400);
assert.equal(summarizeBank(example, allocations, asOf).confirmedMinutes, 1539 - 400);

allocations = markEventConsumed(allocations, "leave-1");
assert.equal(summarizeBank(example, allocations, asOf).reservedMinutes, 0);
assert.equal(summarizeBank(example, allocations, asOf).confirmedMinutes, 1539);

allocations = restoreAllocations(allocations, "leave-1");
assert.equal(allocations.length, 0);

const future = allocateFromParcels(example, [], 100, "2026-11-15");
assert.equal(future.picks.some((pick) => pick.parcelId === "junho"), false);
assert.equal(future.picks[0]?.parcelId, "julho");

const pendingOnly = allocateFromParcels(
  [parcel("legado", 106, null, { kind: "legacy", originYear: null, originMonth: null })],
  [],
  60,
  "2026-10-01",
);
assert.equal(pendingOnly.picks.length, 0);
assert.equal(pendingOnly.shortfall, 60);

const moved = moveLegacyMinutes(
  [
    parcel("parcel-legacy", 180, null, { kind: "legacy", originYear: null, originMonth: null }),
    parcel("parcel-2026-06", 0, null, { originMonth: 6 }),
  ],
  60,
  "parcel-2026-06",
);
assert.equal(moved.find((item) => item.id === "parcel-legacy")?.extractMinutes, 120);
assert.equal(moved.find((item) => item.id === "parcel-2026-06")?.extractMinutes, 60);

console.log("bankLedger tests passed");
