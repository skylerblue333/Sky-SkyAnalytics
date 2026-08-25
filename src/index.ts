export interface MetricEvent { name: string; value: number; timestamp: string; dimensions?: Record<string, string> }
export interface MetricSummary { name: string; count: number; sum: number; min: number; max: number; average: number }
const NAME = /^[A-Za-z0-9._-]{1,96}$/;

function validate(event: MetricEvent): MetricEvent {
  const name = event.name.trim();
  if (!NAME.test(name)) throw new Error("invalid metric name");
  if (!Number.isFinite(event.value)) throw new Error("invalid metric value");
  if (Number.isNaN(Date.parse(event.timestamp))) throw new Error("invalid timestamp");
  const dimensions = event.dimensions ?? {};
  if (Object.keys(dimensions).length > 32) throw new Error("dimension limit exceeded");
  for (const [key, value] of Object.entries(dimensions)) {
    if (!NAME.test(key) || value.length > 256) throw new Error("invalid dimension");
  }
  return { ...event, name, dimensions: { ...dimensions } };
}

export function aggregate(events: readonly MetricEvent[]): MetricSummary[] {
  if (events.length > 10_000) throw new Error("event limit exceeded");
  const groups = new Map<string, number[]>();
  for (const event of events) {
    const checked = validate(event);
    const values = groups.get(checked.name) ?? [];
    values.push(checked.value);
    groups.set(checked.name, values);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([name, values]) => {
    const sum = values.reduce((total, value) => total + value, 0);
    if (!Number.isFinite(sum)) throw new Error("aggregate overflow");
    return { name, count: values.length, sum, min: Math.min(...values), max: Math.max(...values), average: sum / values.length };
  });
}

export function timeRange(events: readonly MetricEvent[]) {
  if (events.length === 0) return { start: null, end: null, source: "caller_supplied" as const };
  const timestamps = events.map((event) => Date.parse(validate(event).timestamp));
  return { start: new Date(Math.min(...timestamps)).toISOString(), end: new Date(Math.max(...timestamps)).toISOString(), source: "caller_supplied" as const };
}
