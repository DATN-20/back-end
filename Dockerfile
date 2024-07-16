FROM node:20 as backend

WORKDIR /artist_be

RUN apt-get update && apt-get install -y \
  build-essential \
  apt-get install -y git curl libmcrypt-dev default-mysql-client \ 
  python-is-python3 \
  && rm -rf /var/lib/apt/lists/*

COPY ./package.json ./package-lock.json ./

RUN npm install \
  npm install @css-inline/css-inline-linux-x64-gnu

COPY . ./

RUN npm rebuild bcrypt --build-from-source

RUN npm run build

EXPOSE 3000
EXPOSE 3001

CMD [ "npm", "run", "start:prod" ]
