# Use official Node.js base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
