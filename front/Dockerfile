FROM node:alpine

WORKDIR /app/frontend

# Copy package.json and package-lock.json (or yarn.lock) separately
COPY package.json .
COPY package-lock.json .


COPY . .

RUN npm i


# Expose the port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]