# Hospital Management API

## Setup

1. Run `database/schema.sql` in MySQL.
2. Copy `.env.example` values into `.env` and configure the database/JWT.
3. Run `npm run create-admin` once to create the first administrator.
4. Start with `npm run dev`.

Use the login token as `Authorization: Bearer <token>` on every API request
except `POST /api/auth/login`.

## Main routes

- `POST /api/auth/login`
- `GET|POST|DELETE /api/users` (admin)
- `GET|POST|PUT|DELETE /api/doctors` (writes/deletes are admin)
- `GET|POST|PUT|DELETE /api/patients` (delete is admin)
- `GET /api/patients/:id/history`
- `GET|POST|PATCH|DELETE /api/appointments`
- `POST /api/prescriptions` (doctor; completed own appointment)
- `POST /api/lab-reports` (lab/admin multipart upload)
- `GET /api/lab-reports/:id/file`

For a lab upload, send `multipart/form-data` with `file`, `patientId`,
`testName`, optional `notes`, and `storageType` set to `LOCAL` or `S3`.
