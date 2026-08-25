import assert from "node:assert/strict";
import test from "node:test";
import { aggregate, timeRange } from "./index.js";

const events = [
  { name: "latency_ms", value: 10, timestamp: "2026-08-25T00:00:00Z" },
  { name: "latency_ms", value: 20, timestamp: "2026-08-25T00:01:00Z" },
];

test("aggregates caller supplied metrics deterministically", () => {
  assert.deepEqual(aggregate(events), [{ name: "latency_ms", count: 2, sum: 30, min: 10, max: 20, average: 15 }]);
});

test("reports caller-supplied time range", () => {
  assert.deepEqual(timeRange(events), { start: "2026-08-25T00:00:00.000Z", end: "2026-08-25T00:01:00.000Z", source: "caller_supplied" });
});

test("invalid metrics fail closed", () => {
  assert.throws(() => aggregate([{ name: "bad metric", value: 1, timestamp: "2026-08-25T00:00:00Z" }]), /name/);
  assert.throws(() => aggregate([{ name: "ok", value: Number.NaN, timestamp: "2026-08-25T00:00:00Z" }]), /value/);
});
