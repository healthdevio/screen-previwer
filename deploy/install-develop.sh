#bin/bash

cd ..
rm -rf dist
yarn tsc --project ./
cp -R package.json dist/
cp -R deploy/Dockerfile dist/
cp -R deploy/create-docker-develop.sh dist/
cd dist 
./create-docker-develop.sh