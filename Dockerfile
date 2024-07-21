# Use the official Node.js image as the base image
FROM node:14

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY .env .env

# Expose the port that your app runs on
EXPOSE 10000

# Define environment variable for production
ENV NODE_ENV=production

# Run the application
CMD ["node", "server.js"]
