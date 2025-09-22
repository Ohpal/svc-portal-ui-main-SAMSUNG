# 최초 배포시
FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# dist 폴더와 해당 폴더내용을 실행시킬 server.js 배포
COPY ./deploy ./

CMD [ "node", "server.js" ]
