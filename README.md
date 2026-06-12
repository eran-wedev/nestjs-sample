# nestjs-sample

A small [NestJS](https://nestjs.com) REST API with an interactive items dashboard. Manage todos via JSON endpoints or a built-in web UI with live stats and charts.

**Repository:** https://github.com/eran-wedev/nestjs-sample

## Features

- **Items CRUD API** — create, read, update, and delete items with validation
- **Stats endpoint** — completion rate, activity by day, and velocity metrics
- **Interactive dashboard** — served at `/` with charts, stat cards, and inline item management
- **Global validation** — DTOs validated with `class-validator`

## Getting started

```bash
npm install
npm run start:dev
```

Open http://localhost:3000 for the dashboard.

Default port is `3000`. Override with the `PORT` environment variable.

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Interactive dashboard (HTML) |
| `GET` | `/api` | API welcome message and endpoint list |
| `GET` | `/items` | List all items |
| `GET` | `/items/stats` | Aggregated stats for charts |
| `GET` | `/items/:id` | Get a single item |
| `POST` | `/items` | Create an item |
| `PATCH` | `/items/:id` | Update an item |
| `DELETE` | `/items/:id` | Delete an item |

### Item shape

```json
{
  "id": 1,
  "name": "Learn NestJS",
  "description": "Build a small REST API with modules and services",
  "completed": false,
  "createdAt": "2026-06-12T10:30:00.000Z"
}
```

### Examples

Create an item:

```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"New task","description":"Optional description"}'
```

Mark an item complete:

```bash
curl -X PATCH http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

Get stats:

```bash
curl http://localhost:3000/items/stats
```

## Project structure

```
src/
├── dashboard/          # HTML dashboard served at /
├── items/
│   ├── dto/            # Create/update DTOs
│   ├── entities/       # Item model
│   ├── items.controller.ts
│   ├── items.service.ts
│   └── items.module.ts
├── app.controller.ts   # GET /api
├── app.module.ts
└── main.ts
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start in watch mode |
| `npm run start` | Start once |
| `npm run start:prod` | Run compiled output |
| `npm run build` | Compile TypeScript |
| `npm run test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |
| `npm run lint` | ESLint |

## License

UNLICENSED
