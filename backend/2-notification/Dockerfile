FROM node:20-alpine3.18 as base

WORKDIR /app

COPY package*.json .npmrc tsconfig.json ./
COPY src ./src
COPY script ./script

RUN --mount=type=secret,id=npmrc \
    NPM_TOKEN=$(cat /run/secrets/npmrc) \
    npm ci && npm run build


FROM node:20-alpine3.18

WORKDIR /app

COPY package*.json .npmrc ./
RUN --mount=type=secret,id=npmrc \
    NPM_TOKEN=$(cat /run/secrets/npmrc) \
    npm ci --production
COPY --from=base /app/build ./build

EXPOSE 8000

CMD ["npm", "run", "start"]

# docker image build --secret id=npmrc,src=npmrc -t rulerchen/tasker-2-notification .
# docker tag rulerchen/tasker-2-notification rulerchen/tasker-2-notification:stable
# docker push rulerchen/tasker-2-notification:stable


