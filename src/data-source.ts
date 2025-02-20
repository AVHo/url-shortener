// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { UrlMapping } from "./entity/UrlMapping";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [UrlMapping],
});