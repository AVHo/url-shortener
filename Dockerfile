# Use an official Node.js LTS Alpine image
FROM node:18-alpine

# Create a directory for the app
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
