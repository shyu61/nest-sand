package main

import (
	"context"
	"database/sql"
	"io"
	"log"
	"net"
	"os"

	_ "github.com/go-sql-driver/mysql"
	pb "github.com/shyu61/nest-sand-backend/proto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/reflection"
	"google.golang.org/grpc/status"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
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
	db      *sql.DB
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
	return nil, status.Errorf(codes.NotFound, "author not found")
}

func (authorsServer) ListAuthors(stream pb.AuthorsService_ListAuthorsServer) error {
	for {
		in, err := stream.Recv()
		if err == io.EOF {
			return nil
		}
		if err != nil {
			return status.Errorf(codes.NotFound, "author not found")
		}
		for _, author := range authors {
			if author.Id == in.Id {
				a := &pb.Author{
					Id:        author.Id,
					FirstName: author.FirstName,
					LastName:  author.LastName,
				}
				if err := stream.Send(a); err != nil {
					return err
				}
			}
		}
	}
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

func (authorsServer) UpdateAuthor(ctx context.Context, in *pb.UpdateAuthorRequest) (*pb.Author, error) {
	for i, author := range authors {
		if author.Id == in.Id {
			if in.FirstName != nil {
				authors[i].FirstName = *in.FirstName
			}
			if in.LastName != nil {
				authors[i].LastName = *in.LastName
			}
			return &pb.Author{
				Id:        author.Id,
				FirstName: authors[i].FirstName,
				LastName:  authors[i].LastName,
			}, nil
		}
	}
	return nil, status.Errorf(codes.NotFound, "author not found")
}

func (authorsServer) DeleteAuthor(ctx context.Context, in *pb.DeleteAuthorRequest) (*emptypb.Empty, error) {
	for i, author := range authors {
		if author.Id == in.Id {
			authors = append(authors[:i], authors[i+1:]...)
			return &emptypb.Empty{}, nil
		}
	}
	return nil, status.Errorf(codes.NotFound, "author not found")
}

func main() {
	// seeds.Seed()
	url := os.Getenv("DATABASE_URL")
	var err error
	db, err = sql.Open("mysql", url+"?parseTime=true")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen. error=%v", err)
	}
	grpcServer := grpc.NewServer()
	reflection.Register(grpcServer)
	pb.RegisterAuthorsServiceServer(grpcServer, &authorsServer{})

	log.Println("Starting server...")
	grpcServer.Serve(lis)
}
