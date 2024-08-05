FROM node:20

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source code inside /app/src
COPY . .

# Copy .env file
COPY .env .env

# Set the working directory inside the container
WORKDIR /app/src

# Expose port 8000
EXPOSE 8000

# Start the application
CMD ["node", "server.js"]
