# Use Node.js LTS version
FROM node:20-slim

# Install Docker CLI
RUN apt-get update && \
    apt-get install -y ca-certificates curl gnupg && \
    install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    chmod a+r /etc/apt/keyrings/docker.gpg && \
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./

# Clean install dependencies
RUN rm -rf node_modules && \
    rm -rf package-lock.json && \
    npm cache clean --force && \
    npm install && \
    npm install @radix-ui/react-tooltip@1.1.4

# Copy the rest of the application
COPY . .

# Set Next.js to development mode
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the port the app runs on
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]
