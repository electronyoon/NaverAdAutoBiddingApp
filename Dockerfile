# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Expose the port your Node.js application listens on (e.g., 3000)
EXPOSE 3000

# Start your Node.js application
CMD ["npm", "start"]