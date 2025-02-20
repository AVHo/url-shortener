"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listActiveUrls = exports.getFullUrl = exports.createShortenedUrl = void 0;
const UrlMapping_1 = require("../entity/UrlMapping");
const uuid_1 = require("uuid");
const typeorm_1 = require("typeorm");
const data_source_1 = require("../data-source");
// Default expiration in hours
const DEFAULT_EXPIRATION_HOURS = process.env.DEFAULT_EXPIRATION_HOURS
    ? parseInt(process.env.DEFAULT_EXPIRATION_HOURS, 10)
    : 24;
async function createShortenedUrl(req, res) {
    try {
        const { url, expiryMinutes } = req.body;
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }
        // Default: 24 hours = 24 * 60 minutes
        const DEFAULT_EXPIRATION_MINUTES = 24 * 60;
        // Determine expiration
        const expiresIn = expiryMinutes
            ? parseInt(expiryMinutes, 10)
            : DEFAULT_EXPIRATION_MINUTES;
        const now = new Date();
        //const expiresAt = new Date(now.getTime() + expiresIn * 60 * 60 * 1000);
        // `expiresIn` minutes from now → in milliseconds
        const expiresAt = new Date(now.getTime() + expiresIn * 60 * 1000);
        // Generate short ID
        const shortId = (0, uuid_1.v4)().slice(0, 8);
        // Get the repository from the initialized DataSource
        const urlRepo = data_source_1.AppDataSource.getRepository(UrlMapping_1.UrlMapping);
        // Create and save
        const newMapping = urlRepo.create({
            shortId,
            fullUrl: url,
            expiresAt
        });
        await urlRepo.save(newMapping);
        // Construct shortened URL
        const shortenedUrl = `${req.protocol}://${req.get("host")}/${shortId}`;
        return res.status(201).json({
            shortenedUrl,
            expiresAt
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
exports.createShortenedUrl = createShortenedUrl;
async function getFullUrl(req, res) {
    try {
        const { shortUrl } = req.params;
        const urlRepo = data_source_1.AppDataSource.getRepository(UrlMapping_1.UrlMapping);
        const mapping = await urlRepo.findOne({ where: { shortId: shortUrl } });
        if (!mapping) {
            console.log("I am here");
            return res.status(404).json({ error: "Shortened URL not found" });
        }
        const now = new Date();
        if (mapping.expiresAt < now) {
            return res.status(410).json({ error: "Shortened URL has expired" });
        }
        return res.status(200).json({ fullUrl: mapping.fullUrl });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
exports.getFullUrl = getFullUrl;
async function listActiveUrls(req, res) {
    try {
        const urlRepo = data_source_1.AppDataSource.getRepository(UrlMapping_1.UrlMapping);
        // We want all mappings whose expiresAt is greater than now
        const now = new Date();
        const activeMappings = await urlRepo.find({
            where: {
                expiresAt: (0, typeorm_1.MoreThan)(now),
            }
        });
        const result = activeMappings.map((m) => ({
            shortId: m.shortId,
            fullUrl: m.fullUrl,
            createdAt: m.createdAt,
            expiresAt: m.expiresAt
        }));
        return res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
exports.listActiveUrls = listActiveUrls;
