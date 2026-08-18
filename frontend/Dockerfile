# Stage 1: build the React app
FROM node:20-slim AS build
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Prove what actually arrived at build time, instead of finding out later
# from broken browser behavior. Empty means the --build-arg never got a
# real value from the CI/CD pipeline (check the repo variable).
RUN echo ">>> VITE_API_URL as seen at build time: [${VITE_API_URL}]"

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: serve the built static files with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]