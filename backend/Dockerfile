FROM node:22.1.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x ./node_modules/.bin/prisma

RUN npx prisma generate

RUN chmod +x ./node_modules/.bin/tsc
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
