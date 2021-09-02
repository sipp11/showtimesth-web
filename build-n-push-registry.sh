#!/usr/bin/env sh

export DOCKER_IMAGE=dk-reg.10ninox.com/sipp11/stth-web:latest
docker build -t $DOCKER_IMAGE -f Dockerfile .
docker push $DOCKER_IMAGE
