import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import urlShortenerRoutes from "./routes/urlShortener.routes";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect to DB
    // Initialize DataSource (replaces createConnection from older TypeORM)
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const app = express();

    // 1) Enable CORS with default settings (allows all origins)
    app.use(cors({
        origin: "*", // or "http://localhost:3001" if you want a specific origin
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }));            // To disable CORS error when calling localhost:3000 from localhost:3001; this enables CORS in express server

    // 2) Enable JSON body parsing
    app.use(express.json());

    // 3) Register our routes
    app.use("/", urlShortenerRoutes);

    // Listen on the given port
    app.listen(PORT, () => {
      console.log(`URL Shortener service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
