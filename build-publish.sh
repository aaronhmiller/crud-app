#!/bin/sh
if [ $# -lt "1" ]
then
  echo "USAGE build-publish.sh TAG"
  echo ""
  exit
fi  

tag=$1

echo "*** Build image and publish to Docker Hub with the tags $tag and latest"
docker buildx build --no-cache --platform linux/amd64,linux/arm64 -t saltaaron/crud-app:$tag --push .
docker buildx build --no-cache --platform linux/amd64,linux/arm64 -t saltaaron/crud-app:latest --push .

