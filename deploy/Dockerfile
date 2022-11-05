# Base image
FROM nginx

LABEL version="1.0.0" description="Healthdev/Screen previwer" maintainer="Healthdev<pedro@healthdev>"

WORKDIR /usr/src/app

RUN apt-get update

RUN mkdir -p files

#instalação do nodejs no nginx
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs tzdata
RUN npm i -g yarn
#Instalação de outras dependencias
RUN apt install -y libglib2.0-0 libgio2.0-cil-dev libxinerama1 libcairo2 libcups2 libsm6 libx11-xcb-dev
# RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget


RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
RUN rm google-chrome-stable_current_amd64.deb
# RUN apt-get install chromium-browser


COPY . .
RUN yarn
ENV APP_PORT=3333

EXPOSE 3333

CMD [ "node", "main.js" ]
