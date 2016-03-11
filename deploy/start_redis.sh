#!/bin/bash
docker run --rm --name dev_redis -p $REDIS_PORT:$REDIS_PORT redis
