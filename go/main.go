package main

import (
	"context"
	"log"
	"net"

	pb "github.com/shyu61/nest-sand-backend/proto"
	"google.golang.org/grpc"
)

type authorServer struct {
	pb.UnimplementedAuthorServiceServer
}

func (authorServer) GetAuthor(ctx context.Context, in *pb.GetAuthorRequest) (*pb.GetAuthorResponse, error) {
	return &pb.GetAuthorResponse{
		Id:        in.Id,
		FirstName: "shu",
		LastName:  "omura",
	}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen. error=%v", err)
	}
	grpcServer := grpc.NewServer()
	pb.RegisterAuthorServiceServer(grpcServer, &authorServer{})

	log.Println("Starting server...")
	grpcServer.Serve(lis)
}
