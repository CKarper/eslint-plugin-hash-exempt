FROM docker-artifacts.ua-ecm.com/node:latest-onbuild

RUN npm run build
