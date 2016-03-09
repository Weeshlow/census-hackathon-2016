# Set the base image to ubuntu:trusty
FROM ubuntu:trusty

# Copy the server build files to the container's workspace
ADD ./server.bin /go/src/github.com/unchartedsoftware/census-hackathon-2016/server.bin
ADD ./public /go/src/github.com/unchartedsoftware/census-hackathon-2016/public

# Set env vars used by server
ENV PUBLIC_DIR="./public"
ENV ES_HOST="http://10.65.16.13"
ENV ES_PORT="9200"
ENV REDIS_HOST=$REDIS_1_PORT_6379_TCP_ADDR
ENV REDIS_PORT=$REDIS_1_PORT_6379_TCP_PORT

# Run the server by default when the container starts
ENTRYPOINT /go/src/github.com/unchartedsoftware/census-hackathon-2016/server.bin

# Document that the service listens on port 8080
EXPOSE 8080
