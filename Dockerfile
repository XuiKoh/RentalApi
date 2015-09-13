FROM ubuntu:

MAINTAINER xui

RUN apt-get update

RUN apt-get install -y nodejs npm

COPY ./app /app

EXPOSE 80

CMD ["nodejs","app/server.js"]