"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// src/data-source.ts
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const UrlMapping_1 = require("./entity/UrlMapping");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [UrlMapping_1.UrlMapping],
});
