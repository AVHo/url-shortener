"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./data-source");
const urlShortener_routes_1 = __importDefault(require("./routes/urlShortener.routes"));
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        // Connect to DB
        // Initialize DataSource (replaces createConnection from older TypeORM)
        await data_source_1.AppDataSource.initialize();
        console.log("Data Source has been initialized!");
        const app = (0, express_1.default)();
        // 1) Enable CORS with default settings (allows all origins)
        app.use((0, cors_1.default)({
            origin: "*",
            methods: ["GET", "POST", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })); // To disable CORS error when calling localhost:3000 from localhost:3001; this enables CORS in express server
        // 2) Enable JSON body parsing
        app.use(express_1.default.json());
        // 3) Register our routes
        app.use("/", urlShortener_routes_1.default);
        // Listen on the given port
        app.listen(PORT, () => {
            console.log(`URL Shortener service running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting server:", error);
    }
}
startServer();
