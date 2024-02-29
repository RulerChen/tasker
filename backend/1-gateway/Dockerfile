FROM node:20-alpine3.18

WORKDIR /app

COPY package*.json .npmrc ./
RUN --mount=type=secret,id=npmrc \
    NPM_TOKEN=$(cat /run/secrets/npmrc) \
    npm ci --production
COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]

# docker image build --secret id=npmrc,src=npmrc -t rulerchen/tasker-1-gateway .
# docker tag rulerchen/tasker-1-gateway rulerchen/tasker-1-gateway:stable
# docker push rulerchen/tasker-1-gateway:stable

