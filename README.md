# nest-sand
## Create gRPC interface from protocol buffer
```bash
% protoc --go_out=./go --go_opt=paths=source_relative \
    --go-grpc_out=./go --go-grpc_opt=paths=source_relative \
    ./proto/nest-sand.proto
```
