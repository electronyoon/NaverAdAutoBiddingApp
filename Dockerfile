# Stage 1: Build stage
FROM public.ecr.aws/docker/library/node:18 AS build
WORKDIR /app
ADD package.json .
RUN npm install

# Stage 2: Final image stage
FROM public.ecr.aws/docker/library/node:18-slim

# Install necessary packages if required
RUN apt-get update && apt-get install -y \
    curl \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* && apt-get clean

COPY --from=build /app .
ADD . .
EXPOSE 3000
CMD ["node", "app.js"]