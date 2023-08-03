###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM --platform=linux/amd64 node:16-alpine As development

# Create app directory
WORKDIR /usr/src/app


# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=root:root . .

# COPY --chown=node:node .env ./

# Use the node user from the image (instead of the root user)
USER root

###################
# BUILD FOR PRODUCTION
###################

FROM --platform=linux/amd64 node:16-alpine As build

WORKDIR /usr/src/app



COPY --chown=root:root package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=root:root --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=root:root . .


# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production



# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production && npm cache clean --force

USER root


###################
# PRODUCTION
###################

FROM --platform=linux/amd64 node:16-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=root:root --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=root:root --from=build /usr/src/app/dist ./dist

# Install chromium
ENV CHROME_BIN=/usr/bin/chromium-browser
RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
      nss@edge \
      udev \
      ttf-freefont \
      chromium

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
