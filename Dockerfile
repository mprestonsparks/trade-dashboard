# Use Node.js LTS version
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install dependencies first for better caching
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Set Next.js to development mode
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port the app runs on
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]
