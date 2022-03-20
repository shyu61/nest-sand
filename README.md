# nest-sand
## Serve with docker
```bash
docker compose up -d
```
This command runs services below.
- **bff**: backend for frontend in `typescript/`.
- **backend**: in `go/`.
- **mysql**: db connected from backend.

## Create gRPC interface from protocol buffer
```bash
protoc --go_out=./go --go_opt=paths=source_relative \
  --go-grpc_out=./go --go-grpc_opt=paths=source_relative \
  ./proto/nest-sand.proto
```
## Use grpc CLI
In this example, you can use [grpcurl](https://github.com/fullstorydev/grpcurl).
### Install
```bash
brew install grpcurl
```
### Example
```bash
grpcurl -plaintext \
    0.0.0.0:50051 list

grpcurl -plaintext -d '{"id": 1}' \
  0.0.0.0:50051 proto.AuthorsService/ListAuthors
```

## Migration
You can use [migrate](https://github.com/golang-migrate/migrate).
### Create template
```bash
migrate create -ext sql -dir db/migrations -seq <table_name>
```
### Exec
```bash
migrate -database ${DATABASE_URL} -path migrations/authors up
```