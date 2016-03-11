# Set the base image to ubuntu:trusty
FROM ubuntu:trusty

# Copy the server build files to the container's workspace
ADD ./server.bin /go/src/github.com/unchartedsoftware/census-hackathon-2016/server.bin
ADD ./public /go/src/github.com/unchartedsoftware/census-hackathon-2016/public

# Run the server by default when the container starts
ENTRYPOINT /go/src/github.com/unchartedsoftware/census-hackathon-2016/server.bin

# Document that the service listens on port 8080
EXPOSE 8080
