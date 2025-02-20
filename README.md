# URL Shortener with Expiration

This is a simple URL Shortener service built in TypeScript and Express, using TypeORM with an **SQLite** database. Each shortened URL can have a custom expiration time in **minutes**, defaulting to **24 hours** if no value is specified.

---

## Features

- **POST /shorten**: Shorten a URL and optionally specify expiry in minutes.
- **GET /:shortUrl**: Retrieve (or get info about) the original full URL if not expired.
- **GET /active**: Lists all active (non-expired) shortened URLs.

---

## Requirements / Notable Dependencies

1. **TypeScript**  
2. **TypeORM**  
3. **SQLite** (so we need `sqlite3` installed)  
4. **uuid** (for generating unique short IDs)  
5. **cors** (to allow cross-origin requests if your front end is on a different port)

### How to install

- `npm install --save typeorm reflect-metadata express cors uuid sqlite3`
- `npm install --save-dev typescript ts-node-dev @types/node @types/express @types/cors @types/uuid`
  
  - `typescript`: The TypeScript compiler.  
  - `ts-node-dev`: For development with auto-restart.  
  - `@types/express, @types/cors, @types/uuid`: Type definitions.

---

## Local Setup (Without Docker)

1. **Clone** or download this repository:
   ```bash
   git clone https://github.com/AVHo/url-shortener.git
   cd url-shortener

## Docker build commands

  docker build -t url-shortener .

  docker run -p 3000:3000 url-shortener

## Run server, without Docker setup - Server runs on PORT: 3000

  npm install       - to install all dependencies

  npm run build

  npm start

  The server is now accessible at http://localhost:3000

## Run React Client - Force client to run on PORT: 3001

  cd client
  npm install                             - install all dependencies

  PORT=3001 npm start

  The client React App is now accessible at http://localhost:3001

## Test with Curl

Shorten:
curl -X POST -H "Content-Type: application/json" \
-d '{"url":"https://example.com","expiryMinutes":30}' \
http://localhost:3000/shorten

Retrieve:
curl http://localhost:3000/abc12345

List Active:
curl http://localhost:3000/active
