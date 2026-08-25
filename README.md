# SkyAnalytics Core

**Status: engineering beta / major-application domain core.**

SkyAnalytics Core validates and aggregates caller-supplied metric events. It provides bounded metric names/values/timestamps/dimensions, deterministic count/sum/min/max/average summaries, and caller-supplied time-range metadata.

It does **not** collect telemetry, track users, operate an ingestion pipeline, query a database, stream events, provide dashboards, infer causality, authenticate data sources, prove metric accuracy, or claim production observability. Aggregated values are only as trustworthy as the supplied events.

```bash
npm install --ignore-scripts
npm run check
```

A future SKYCOIN4444 adapter may feed verified application events into this domain core. Collection consent/privacy, provenance, persistence, retention, access control, observability infrastructure, and deployment remain responsibilities of the consuming system.
