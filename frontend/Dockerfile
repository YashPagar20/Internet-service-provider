# Build Stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run Stage (using simple serve for now, or nginx)
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
