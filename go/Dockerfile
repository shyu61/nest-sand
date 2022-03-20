FROM golang:1.17

WORKDIR /go/src/app
COPY ./go .
COPY ./proto ../proto

RUN apt update \
  && apt install -y curl vim \
  && curl -L https://github.com/golang-migrate/migrate/releases/download/v4.15.1/migrate.linux-amd64.tar.gz | tar xvz -C /tmp \
  && mv /tmp/migrate /usr/local/bin

RUN go mod download

CMD ["go", "run", "main.go"]
