# k6 Performance Scripts

This folder contains reusable k6 scripts for AAS.TwinEngine.DataEngine performance testing.

## Prerequisites

- k6 installed and available in PATH
- A running DataEngine instance, default `http://localhost:8080`
- Example data available from `example/docker-compose.yml`

## Scenarios

- `scenarios/response-time.js`: Response-time profile for percentile checks under constant arrival rate.
- `scenarios/load.js`: Sustained production-like load profile.
- `scenarios/stress.js`: Beyond-capacity profile to identify degradation boundaries.
- `scenarios/endurance.js`: Long-running stability profile (default 8h).

## Quick Start

Run from this directory:

```powershell
# Response-time (default)
./run.ps1

# Specific profile
./run.ps1 -Profile load
./run.ps1 -Profile stress
./run.ps1 -Profile endurance
```

Or run scripts directly:

```powershell
k6 run scenarios/response-time.js
k6 run scenarios/load.js
k6 run scenarios/stress.js
k6 run scenarios/endurance.js
```

## Runtime Overrides

All scripts support environment variable overrides.

Common variables:

- `BASE_URL` (default: `http://localhost:8080`)
- `THINK_TIME_SECONDS` (default: `0.2`)

Response-time variables:

- `RATE` (default: `10`)
- `DURATION` (default: `3m`)
- `PREALLOCATED_VUS` (default: `20`)
- `MAX_VUS` (default: `100`)

Load variables:

- `START_VUS`, `STAGE_1_TARGET`, `STAGE_2_TARGET`, `STAGE_3_TARGET`
- `STAGE_1_DURATION`, `STAGE_2_DURATION`, `STAGE_3_DURATION`

Stress variables:

- `START_VUS`, `STAGE_1_TARGET`, `STAGE_2_TARGET`, `STAGE_3_TARGET`, `STAGE_4_TARGET`
- `STAGE_1_DURATION`, `STAGE_2_DURATION`, `STAGE_3_DURATION`, `STAGE_4_DURATION`

Endurance variables:

- `VUS` (default: `20`)
- `DURATION` (default: `8h`)

Example:

```powershell
$env:BASE_URL = 'http://localhost:8080'
$env:RATE = '15'
$env:DURATION = '5m'
k6 run scenarios/response-time.js
```

## Covered Endpoints

The scripts currently exercise these API operations with encoded identifiers:

- `GET /shells/{aasIdentifier}`
- `GET /submodels/{submodelIdentifier}`
- `GET /submodels/{submodelIdentifier}/submodel-elements/{idShortPath}`
- `GET /serialization?...`

The identifiers are generated from the same default product IDs used in the Bruno collection (`000-001`, `000-002`, `001-001`).
