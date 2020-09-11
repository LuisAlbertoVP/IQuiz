FROM node as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
ARG configuration=production
RUN npm run build -- --output-path=/dist/out --configuration=$configuration

FROM nginx
COPY --from=build /dist/out/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
