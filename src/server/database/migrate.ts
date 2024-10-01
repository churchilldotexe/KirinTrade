import { migrate } from "drizzle-orm/libsql/migrator";
import config from "drizzle.config";
import db, { connection } from ".";

await migrate(db, { migrationsFolder: config.out! });

connection.close();
