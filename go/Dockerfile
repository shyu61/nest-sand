FROM golang:1.17

WORKDIR /go/src/app
COPY ./go .
COPY ./proto ../proto

RUN go mod download

CMD ["go", "run", "main.go"]
