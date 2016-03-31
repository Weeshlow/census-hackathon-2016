#!/bin/bash
docker run --rm --name census_server --link census_redis -p 8080:8080 docker.uncharted.software/census_server:1.0
