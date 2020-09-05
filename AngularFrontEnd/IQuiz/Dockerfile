FROM node
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx
COPY --from=builder /usr/src/app/dist/IQuiz/ /usr/share/nginx/html