FROM ubuntu:

MAINTAINER xui

RUN apt-get update

RUN apt-get install -y nodejs npm

COPY ./RentalApi /RentalApi

EXPOSE 80

CMD ["nodejs","RentalApi/Server.js"]