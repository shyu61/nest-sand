import { join } from "path";

import { ClientOptions, Transport } from "@nestjs/microservices";

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: "proto",
    protoPath: join(__dirname, "../../proto/nest-sand.proto"),
    url: "localhost:50051",
  },
};
