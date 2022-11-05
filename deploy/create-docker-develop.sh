#bin/bash
docker rmi -f healthdev/screen-previwer
docker rm -f screen-previwer

docker build -t healthdev/screen-previwer .
docker run --name screen-previwer -d -p 3333:3333 healthdev/screen-previwer
