package main

import (
	"context"
	"fmt"
	"log"
	"net"

	pb "github.com/shyu61/nest-sand-backend/proto"
	"google.golang.org/grpc"
)

type authorsServer struct {
	pb.UnimplementedAuthorsServiceServer
}

type Author struct {
	Id        int32
	FirstName string
	LastName  string
}

var (
	authors = []Author{
		{
			Id:        1,
			FirstName: "Michael",
			LastName:  "Kozin",
		},
		{
			Id:        2,
			FirstName: "John",
			LastName:  "Doe",
		},
		{
			Id:        3,
			FirstName: "Jane",
			LastName:  "Bond",
		},
	}
)

func (authorsServer) GetAuthor(ctx context.Context, in *pb.GetAuthorRequest) (*pb.Author, error) {
	for _, author := range authors {
		if author.Id == in.Id {
			return &pb.Author{
				Id:        author.Id,
				FirstName: author.FirstName,
				LastName:  author.LastName,
			}, nil
		}
	}
	return nil, fmt.Errorf("author not found")
}

func (authorsServer) GetAuthors(_ *pb.Empty, stream pb.AuthorsService_GetAuthorsServer) error {
	for _, author := range authors {
		a := &pb.Author{
			Id:        author.Id,
			FirstName: author.FirstName,
			LastName:  author.LastName,
		}
		if err := stream.Send(a); err != nil {
			return err
		}
	}
	return nil
}

func (authorsServer) CreateAuthor(ctx context.Context, in *pb.CreateAuthorRequest) (*pb.Author, error) {
	authors = append(authors, Author{
		Id:        int32(len(authors) + 1),
		FirstName: in.FirstName,
		LastName:  in.LastName,
	})
	a := authors[len(authors)-1]
	return &pb.Author{
		Id:        a.Id,
		FirstName: a.FirstName,
		LastName:  a.LastName,
	}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen. error=%v", err)
	}
	grpcServer := grpc.NewServer()
	pb.RegisterAuthorsServiceServer(grpcServer, &authorsServer{})

	log.Println("Starting server...")
	grpcServer.Serve(lis)
}
