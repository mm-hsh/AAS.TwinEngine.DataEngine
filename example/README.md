# TwinEngine Demonstrator Setup

## Overview

This folder provides a complete, containerized setup to demonstrate how **TwinEngine.DataEngine** can be integrated and run locally. It creates a fully functional environment for managing Asset Administration Shells (AAS), submodels, and related digital asset components using Docker Compose.

There are two variants:

1. [docker-compose.yml](docker-compose.yml): default setup
2. [secured-docker-compose.yml](secured-docker-compose.yml): secured setup (Keycloak + ABAC in BaSyx Go)

For secured login and role details, see [README-secured.md](README-secured.md).

## Included Submodel Templates

The preconfiguration imports these templates from [aas](aas):

- Nameplate
- MaintenanceInstructions
- TechnicalData
- CarbonFootprint
- HandoverDocumentation

## Prerequisites

Before running the demonstrator, ensure you have installed:

- **Docker** (v20.10+) — [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (v1.29+) — Usually included with Docker Desktop
- **Available Ports** - The following ports must be available on your machine:
  - 8080: nginx gateway + AAS UI path
  - 8081: PGAdmin

Secured setup also uses:

- 9090: Keycloak

## Running the Setup (Default Compose)

1. **Clone or extract this repository:**
   ```bash
   git clone https://github.com/AAS-TwinEngine/AAS.TwinEngine.DataEngine.git
   ```
2. **Go Inside example Folder**

```bash
cd AAS.TwinEngine.DataEngine\example
```
3. **Start all services:** - Form default compose
   ```bash
   docker-compose up -d
   ```
4. **Access the Web UI:**
   Open your browser and navigate to:
   ```
   http://localhost:8080/aas-ui/
   ```

5. **Stop all services:**
   ```bash
   docker-compose down
   ```

## Architecture & Services

The docker-compose setup includes the following services, all running on a shared `twinengine-network`:

### Core Services

| Service | Port | Image | Purpose |
|---------|------|-------|----------|
| **nginx** | 8080 | `nginx:trixie-perl` | API Gateway & Web UI proxy |
| **twinengine-dataengine** | - | `ghcr.io/aas-twinengine/dataengine:1.0.0` | Main TwinEngine DataEngine service |
| **template-repository** | - | `eclipsebasyx/aas-environment:2.0.0-SNAPSHOT` | AAS Environment & Submodel repository |
| **aas-template-registry** | - | `eclipsebasyx/aas-registry-log-mongodb:2.0.0-SNAPSHOT` | AAS Shell Descriptor Registry |
| **sm-template-registry** | - | `eclipsebasyx/submodel-registry-log-mongodb:2.0.0-SNAPSHOT` | Submodel Descriptor Registry |
| **dpp-plugin** | - | `ghcr.io/aas-twinengine/plugindpp:1.0.0` | Digital Product Passport Plugin |
| **aas-web-ui** | — | `eclipsebasyx/aas-gui:SNAPSHOT` | Web User Interface (served via nginx) |

### Infrastructure Services

| Service | Port | Image | Purpose |
|---------|------|-------|----------|
| **postgres** | - | `postgres:16-alpine` | Relational database for plugin data |
| **pgadmin** | 8081 | `dpage/pgadmin4:snapshot` | Web UI for managing PostgreSQL database |


Infrastructure:

- postgres (single shared DB container)
- pgadmin

Notes:

- `postgres` hosts both databases: `twinengine` (plugin data) and `basyxTestDB` (BaSyx Go data).
- DB initialization scripts are in [postgres](postgres).
- The setup no longer uses Java/Mongo-based BaSyx services.

## Database Access (PGAdmin)

1. Open http://localhost:8081
2. Login:
   - Email: admin@example.com
   - Password: admin
3. Add server:
   - Host: postgres
   - Port: 5432
   - User: postgres
   - Password: admin

## Secured Variant

Use the secured stack with Keycloak and ABAC:

```bash
docker compose -f secured-docker-compose.yml down -v
docker compose -f secured-docker-compose.yml up -d
```

Documentation and login details: [README-secured.md](README-secured.md)

## Troubleshooting

- Check container status:

```bash
docker compose ps
docker compose -f secured-docker-compose.yml ps
```

- Check logs:

```bash
docker compose logs --tail=200 nginx template-repository twinengine-dataengine dpp-plugin
docker compose -f secured-docker-compose.yml logs --tail=200 keycloak template-repository
```

- If schema/init changed, recreate volumes:

```bash
docker compose down -v
docker compose -f secured-docker-compose.yml down -v
```

## Security Notice

Default passwords and local-only settings in this folder are for development/demo use only.
Do not use these Compose files unchanged in production.
