"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const urlShortener_controller_1 = require("../controllers/urlShortener.controller");
const router = (0, express_1.Router)();
// POST /shorten
router.post("/shorten", urlShortener_controller_1.createShortenedUrl);
// GET /active
router.get("/active", urlShortener_controller_1.listActiveUrls);
// GET /:shortUrl
router.get("/:shortUrl", urlShortener_controller_1.getFullUrl);
exports.default = router;
