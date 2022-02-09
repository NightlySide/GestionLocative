FROM node:erbium-slim

WORKDIR /app/

COPY frontend/package.json frontend/yarn.lock /app/
RUN yarn install --pure-lockfile

COPY frontend/. /app/
RUN yarn build

CMD yarn start