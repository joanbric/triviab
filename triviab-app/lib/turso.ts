import { createClient, ResultSet } from "@libsql/client";

export const turso = createClient({
    url: process.env.TURSO_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN || ''
})

export type {ResultSet}
