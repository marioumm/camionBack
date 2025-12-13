# Currency Rates API (via Utility Service)

This document describes the currency pricing endpoint exposed via the API Gateway, backed internally by the `utility-service` (which talks to `exchangerate.host`).

The goal is to provide frontend and mobile clients with fast, cached access to FX rates.

---

## Overview

- **Public HTTP entrypoint (via API Gateway)**  
  `GET <API_BASE_URL>/utility/currency-rates`

- **Upstream provider**: [`https://api.exchangerate.host`](https://exchangerate.host/)
- **Caching**: Rates are cached **per (base, symbols) combination** for **24 hours** in the `utility-service`.
- **Use cases**: display prices in multiple currencies, currency conversion UI, etc.

`<API_BASE_URL>` depends on your environment (for example, staging/production domains or `http://localhost:<port>` in local dev).

---

## HTTP Endpoint

### Method & Path

- **Method**: `GET`
- **Path**: `/utility/currency-rates`
- **Full URL**: `GET <API_BASE_URL>/utility/currency-rates`

### Query Parameters

- **`base`** (optional)
  - Type: string (ISO currency code, e.g. `USD`, `EUR`, `EGP`)
  - Default: `USD`
  - Meaning: base currency for the rates.

- **`symbols`** (optional)
  - Type: comma-separated string of ISO currency codes.  
    Example: `EGP,SAR,AED,EUR`.
  - Default: if omitted or empty, the service returns **all** available symbols from `exchangerate.host` for the selected base.

### Examples

- **All rates relative to USD**:

  `GET <API_BASE_URL>/utility/currency-rates`

- **All rates relative to EUR**:

  `GET <API_BASE_URL>/utility/currency-rates?base=EUR`

- **Filtered symbols (EGP and SAR) relative to USD**:

  `GET <API_BASE_URL>/utility/currency-rates?symbols=EGP,SAR`

- **Filtered symbols (EGP, SAR, AED) relative to EUR**:

  `GET <API_BASE_URL>/utility/currency-rates?base=EUR&symbols=EGP,SAR,AED`

---

## Response Shape

The endpoint wraps the raw `exchangerate.host` response in a simple envelope.  
The exact fields from `exchangerate.host` (e.g. `success`, `timestamp`, `base`, `date`, `rates`) are passed through as-is.

### Successful Response (live or cached)

```json
{
  "success": true,
  "source": "live",
  "base": "USD",
  "date": "2025-01-20",
  "timestamp": 1737379200,
  "rates": {
    "EGP": 48.12,
    "SAR": 3.75,
    "EUR": 0.92
  }
}
```

#### Fields

- **`success`**
  - `true` when rates are successfully returned.

- **`source`**
  - One of:
    - `"live"` – fresh response from `exchangerate.host`.
    - `"cache"` – served from in-memory cache (still within 24-hour TTL).
    - `"stale_cache"` – external refresh failed; returning last known cached data.

- **`base`**
  - The base currency actually used (string).  
    If the client did not pass `base`, this will typically be `"USD"`.

- **`rates`**
  - Map of currency code → numeric rate, mirroring `exchangerate.host`.

- **Other passthrough fields**
  - May include `date`, `timestamp`, and other fields from `exchangerate.host`.

- **When `source` is `"stale_cache"`**
  - A **`warning`** field is also present:

    ```json
    {
      "success": true,
      "source": "stale_cache",
      "warning": "Failed to refresh rates, returning stale cached data",
      "base": "USD",
      "rates": {
        "EGP": 48.12,
        "SAR": 3.75
      }
    }
    ```

### Error Response

When no cached data is available and the upstream call fails, the endpoint returns an error envelope:

```json
{
  "success": false,
  "message": "Failed to fetch exchange rates",
  "error": "<error message>"
}
```

- **`message`**
  - High-level description, usually `"Failed to fetch exchange rates"`.
- **`error`**
  - More detailed technical message (e.g. network error, timeout).

Frontend and mobile clients should:

- Check `success`.
- When `success` is `false`, display a fallback UI or message and optionally allow retry.

---

## Caching Behavior

### Cache Key

- The cache is keyed per combination of:
  - `base` (defaulting to `USD` when not provided)
  - `symbols` (using the exact comma-separated string or `"ALL"` when omitted)

Examples of cache keys:

- `"USD:ALL"`
- `"USD:EGP,SAR"`
- `"EUR:EGP,SAR,AED"`

Each unique key has its **own** cached entry and TTL.

### TTL

- Each cached entry is valid for **24 hours (1 day)** from the time it was fetched.
- Within that window, repeated requests with the same `base` and `symbols` will be served from:
  - `source = "cache"`.

### On Upstream Failure

- If a new fetch fails **but** there is still cached data for that key:
  - The endpoint returns the cached data with `source = "stale_cache"` and a `warning` field.
- If a new fetch fails **and** there is **no** cached data:
  - The endpoint returns an error response (`success = false`).

---

## Client Integration Notes

- Prefer **fixed, explicit sets** of `symbols` that you actually display/need, to maximise cache hits and avoid very large payloads.
- You can safely poll this endpoint from frontend/mobile, but there is usually no need to call it more than once per app session if you store the result locally, because the data changes slowly and is cached for 24 hours on the backend.
- The backend is responsible for talking to `exchangerate.host`; clients only need to talk to the API Gateway endpoint.

---

## Quick Summary for Implementers

- **Endpoint**: `GET <API_BASE_URL>/utility/currency-rates`
- **Query params**:
  - `base` (optional, default `USD`)
  - `symbols` (optional, comma-separated list, default all)
- **Success shape**: `{ success: true, source: 'live' | 'cache' | 'stale_cache', base, rates, ... }`
- **Error shape**: `{ success: false, message, error }`
- **Cache TTL**: 24 hours per `(base, symbols)` combination.
