# Stage 1: Build stage
FROM --platform=linux/amd64 public.ecr.aws/docker/library/node:18 AS build
WORKDIR /app
COPY . .
RUN npm install

# Stage 2: Final image stage
FROM --platform=linux/amd64 public.ecr.aws/docker/library/node:18-slim

# Install necessary packages if required
RUN apt-get update && apt-get install -y \
    curl \
    tzdata \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* && apt-get clean

WORKDIR /app
COPY --from=build /app .
ADD . .
EXPOSE 3000
CMD ["node", "app.js"]