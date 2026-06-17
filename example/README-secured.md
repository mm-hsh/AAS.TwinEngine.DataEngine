# TwinEngine Secured Setup (Keycloak + BaSyx Go ABAC)

## Overview

This guide documents the secured stack defined in [secured-docker-compose.yml](secured-docker-compose.yml).

It includes:

- Keycloak authentication (OIDC)
- BaSyx Go authorization (ABAC rules in [security_env/access-rules.json](security_env/access-rules.json))
- DataEngine header forwarding of `Authorization` to template endpoints
- Single Postgres container for both TwinEngine and BaSyx Go databases

## Start Secured Stack

From [example](.) run:

```bash
docker compose -f secured-docker-compose.yml down -v
docker compose -f secured-docker-compose.yml up -d
```

## URLs

- AAS UI (via nginx): http://localhost:8080/aas-ui/
- Keycloak: http://localhost:9090
- PGAdmin: http://localhost:8081
- Swagger (BaSyx Go environment): http://localhost:8080/swagger

## Login Information

### AAS UI Login

The UI is configured for Keycloak client `basyx-ui`.

Open [http://localhost:8080/aas-ui/](http://localhost:8080/aas-ui/) and login through Keycloak.

Test users from imported realm [keycloak/realm/basyx-realm.json](keycloak/realm/basyx-realm.json):

1. `admin` / `pwd`
2. `usera` / `pwd`
3. `userx` / `pwd`

### Keycloak Admin Login

Open [http://localhost:9090](http://localhost:9090) and use:

- Username: `admin`
- Password: `admin`

## Authorization Model

- ABAC enabled in `template-repository`:
  - `ABAC_ENABLED=true`
  - `ABAC_MODELPATH=/security_env/access-rules.json`
  - `OIDC_TRUSTLISTPATH=/security_env/trustlist.json`
- Trustlist is in [security_env/trustlist.json](security_env/trustlist.json)
- Rules are in [security_env/access-rules.json](security_env/access-rules.json)

The current rules are role-based by claim `role`:

- `admin`: full access to all configured routes
- `viewer`: read access to allowed descriptors/identifiables
- anonymous: limited read access for selected public items

## Header Forwarding Flow

DataEngine forwards incoming auth headers:

- `Authorization` -> `X-Auth-Token` (to DPP plugin)
- `Authorization` -> `Authorization` (to BaSyx template endpoints)

This is configured in [secured-docker-compose.yml](secured-docker-compose.yml) under `twinengine-dataengine` environment variables.

## Verify Secured Startup

```bash
docker compose -f secured-docker-compose.yml ps
docker compose -f secured-docker-compose.yml logs --tail=120 keycloak template-repository twinengine-dataengine
```

You should see:

- Keycloak realm import successful
- `template-repository` logs showing ABAC enabled and OIDC verifier initialized
- `twinengine-dataengine` and `dpp-plugin` running

## Stop

```bash
docker compose -f secured-docker-compose.yml down
```

Or remove volumes too:

```bash
docker compose -f secured-docker-compose.yml down -v
```

## Notes

- This is a local development/demo setup.
- Default passwords and non-TLS settings must be changed for production.
