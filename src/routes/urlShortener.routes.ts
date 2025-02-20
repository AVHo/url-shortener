import { Router } from "express";
import {
  createShortenedUrl,
  getFullUrl,
  listActiveUrls
} from "../controllers/urlShortener.controller";

const router = Router();

// POST /shorten
router.post("/shorten", createShortenedUrl);

// GET /active
router.get("/active", listActiveUrls);

// GET /:shortUrl
router.get("/:shortUrl", getFullUrl);

export default router;
