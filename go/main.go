package main

import (
	"context"
	"database/sql"
	"io"
	"log"
	"net"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/shyu61/nest-sand-backend/models"
	pb "github.com/shyu61/nest-sand-backend/proto"
	"github.com/volatiletech/sqlboiler/v4/boil"
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
	db *sql.DB
)

func (authorsServer) GetAuthor(ctx context.Context, in *pb.GetAuthorRequest) (*pb.Author, error) {
	author, err := models.FindAuthor(ctx, db, uint64(in.Id))
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, status.Errorf(codes.NotFound, "author not found")
		}
		return nil, status.Errorf(codes.Unknown, "failed to get author. error=%v", err)
	}
	return &pb.Author{
		Id:        int32(author.ID),
		FirstName: author.FirstName,
		LastName:  author.LastName,
	}, nil
}

// FIXME: N+1になるので、Server streaming RPCにする
func (authorsServer) ListAuthors(stream pb.AuthorsService_ListAuthorsServer) error {
	for {
		in, err := stream.Recv()
		if err == io.EOF {
			return nil
		}
		if err != nil {
			return status.Errorf(codes.NotFound, "author not found")
		}
		ctx := context.Background()
		author, err := models.FindAuthor(ctx, db, uint64(in.Id))
		if err != nil {
			return status.Errorf(codes.NotFound, "author not found")
		}
		out := &pb.Author{
			Id:        int32(author.ID),
			FirstName: author.FirstName,
			LastName:  author.LastName,
		}
		if err := stream.Send(out); err != nil {
			return err
		}
	}
}

func (authorsServer) CreateAuthor(ctx context.Context, in *pb.CreateAuthorRequest) (*pb.Author, error) {
	author := models.Author{
		FirstName: in.FirstName,
		LastName:  in.LastName,
	}
	err := author.Insert(ctx, db, boil.Infer())
	if err != nil {
		return nil, status.Errorf(codes.Unknown, "failed to create author. error=%v", err)
	}
	return &pb.Author{
		Id:        int32(author.ID),
		FirstName: author.FirstName,
		LastName:  author.LastName,
	}, nil
}

func (authorsServer) UpdateAuthor(ctx context.Context, in *pb.UpdateAuthorRequest) (*pb.Author, error) {
	author, err := models.FindAuthor(ctx, db, uint64(in.Id))
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "author not found")
	}
	if in.FirstName != nil {
		author.FirstName = *in.FirstName
	}
	if in.LastName != nil {
		author.LastName = *in.LastName
	}
	rowsAff, err := author.Update(ctx, db, boil.Infer())
	if err != nil {
		return nil, status.Errorf(codes.Unknown, "failed to update author. error=%v", err)
	}
	log.Printf("rows affected: %d", rowsAff)

	return &pb.Author{
		Id:        int32(author.ID),
		FirstName: author.FirstName,
		LastName:  author.LastName,
	}, nil
}

func (authorsServer) DeleteAuthor(ctx context.Context, in *pb.DeleteAuthorRequest) (*emptypb.Empty, error) {
	author, err := models.FindAuthor(ctx, db, uint64(in.Id))
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "author not found")
	}
	rowsAff, err := author.Delete(ctx, db)
	if err != nil {
		return nil, status.Errorf(codes.Unknown, "failed to delete author. error=%v", err)
	}
	log.Printf("rows affected: %d", rowsAff)

	return &emptypb.Empty{}, nil
}

func main() {
	// setup database
	url := os.Getenv("DATABASE_URL")
	var err error
	db, err = sql.Open("mysql", url+"?parseTime=true")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// setup grcp
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
