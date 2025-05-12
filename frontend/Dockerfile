# Use official Node image
FROM node:20.7.0-alpine3.18

# Refresh Alpine packages and clear cache
RUN apk update \
 && apk upgrade \
 && rm -rf /var/cache/apk/*

# Set workdir
WORKDIR /app

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy app code and build the app
COPY . .
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app using npx serve
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
