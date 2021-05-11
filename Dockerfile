FROM node:16.0-alpine
WORKDIR /source
COPY ./ /source/ 
RUN mkdir -p /source/bin/src/logs/
RUN npm install -g typescript
RUN npm install --production
RUN npm run transpile

EXPOSE 5000

CMD ["node", "bin/server.js"]  