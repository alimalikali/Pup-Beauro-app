import "dotenv/config";
import { DataSource } from "typeorm";

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "mithaq",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  synchronize: false,
});
