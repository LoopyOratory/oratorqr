import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { sql } from "drizzle-orm";

neonConfig.webSocketConstructor = ws;
const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL! }));

async function seed() {
  const id = crypto.randomUUID();
  const email = "admin@oratorqr.com";
  const name = "Admin";

  const existing = await db.execute(sql`SELECT id FROM "user" WHERE email = ${email}`);
  if (existing.rows.length > 0) {
    console.log("Admin user already exists");
    process.exit(0);
  }

  await db.execute(sql`
    INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
    VALUES (${id}, ${name}, ${email}, true, NOW(), NOW())
  `);

  await db.execute(sql`
    INSERT INTO user_credits (user_id, simple_credits, ai_credits, updated_at)
    VALUES (${id}, 999, 999, NOW())
  `);

  console.log(`Admin user created: ${email}`);
  console.log(`Credits: 999 simple, 999 AI`);
}

seed().catch(console.error).finally(() => process.exit(0));
