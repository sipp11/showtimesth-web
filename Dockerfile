FROM node:alpine as build

WORKDIR /app
COPY . /app
# add the node_modules folder to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install and cache dependencies
RUN npm i -g npm@latest
RUN npm i
# build the project for production
# set up production environment
RUN npm run build

# the base image for this is an alpine based nginx image
FROM nginx:alpine
# copy the build folder from react to the root of nginx (www)
RUN mkdir /www
COPY --from=build /app/build /www
# --------- only for those using react router ----------
# if you are using react router
# you need to overwrite the default nginx configurations
# remove default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
# replace with custom one
COPY nginx/nginx.conf /etc/nginx/conf.d
# --------- /only for those using react router ----------
# expose port 80 to the outer world
EXPOSE 80
# start nginx
CMD ["nginx", "-g", "daemon off;"]
