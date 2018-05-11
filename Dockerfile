FROM nginx

# Node
RUN apt-get update && apt-get install -y curl git gnupg
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

RUN mkdir -p /home/tmp
WORKDIR /home/tmp

# keep node_modules cache if package.json is untouched
COPY package.json /home/tmp
RUN npm install

# Change CACHE_DATE each build to rerun npm run build
ARG CACHE_DATE=not_a_date

COPY . /home/tmp
RUN npm run build

RUN cp -R /home/tmp/public/* /usr/share/nginx/html/
