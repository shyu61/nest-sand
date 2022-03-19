import { join } from "path";

import { ClientOptions, Transport } from "@nestjs/microservices";

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: "proto",
    protoPath: join(__dirname, "../../proto/nest-sand.proto"),
    url: process.env.GRPC_SERVER_URL,
  },
};
