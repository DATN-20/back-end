FROM node:20

WORKDIR /datn/back-end

COPY package.json package-lock.json ./

RUN npm install
RUN npm install @css-inline/css-inline-linux-arm64-gnu

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
