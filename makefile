version=0.1.0

.PHONY: all

all:
	@echo "make <cmd>"
	@echo ""
	@echo "commands:"
	@echo "  build         - build the dist binary"
	@echo "  lint          - lint the source code"
	@echo "  fmt           - format the code with gofmt"
	@echo "  clean         - clean the dist build"
	@echo ""
	@echo "  deps          - pull and install tool dependencies"

clean:
	@rm -rf ./build

lint:
	@go vet ./...
	@golint ./...

fmt:
	@gofmt -l -w .
	@./node_modules/.bin/jsfmt -w ./public/scripts ./public/*.js

build: clean lint
	@go build -o ./build/server.bin ./main.go

deploy: clean lint
	@GOARCH=amd64 GOOS=linux go build -o ./build/server.bin ./main.go
	@cp -r ./build/server.bin ./deploy/server
	@gulp deploy
	@cp -r ./build/public ./deploy/server

deps:
	@npm install
	@bower install
	@go get github.com/golang/lint/golint
	@go get github.com/robfig/glock
	@glock sync -n github.com/unchartedsoftware/census-hackathon-2016 < Glockfile
