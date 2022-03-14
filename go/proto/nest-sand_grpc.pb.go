// Code generated by protoc-gen-go-grpc. DO NOT EDIT.

package nest_sand_backend

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// AuthorsServiceClient is the client API for AuthorsService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type AuthorsServiceClient interface {
	GetAuthor(ctx context.Context, in *GetAuthorRequest, opts ...grpc.CallOption) (*Author, error)
	GetAuthors(ctx context.Context, in *Empty, opts ...grpc.CallOption) (AuthorsService_GetAuthorsClient, error)
}

type authorsServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewAuthorsServiceClient(cc grpc.ClientConnInterface) AuthorsServiceClient {
	return &authorsServiceClient{cc}
}

func (c *authorsServiceClient) GetAuthor(ctx context.Context, in *GetAuthorRequest, opts ...grpc.CallOption) (*Author, error) {
	out := new(Author)
	err := c.cc.Invoke(ctx, "/proto.AuthorsService/GetAuthor", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *authorsServiceClient) GetAuthors(ctx context.Context, in *Empty, opts ...grpc.CallOption) (AuthorsService_GetAuthorsClient, error) {
	stream, err := c.cc.NewStream(ctx, &AuthorsService_ServiceDesc.Streams[0], "/proto.AuthorsService/GetAuthors", opts...)
	if err != nil {
		return nil, err
	}
	x := &authorsServiceGetAuthorsClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type AuthorsService_GetAuthorsClient interface {
	Recv() (*Author, error)
	grpc.ClientStream
}

type authorsServiceGetAuthorsClient struct {
	grpc.ClientStream
}

func (x *authorsServiceGetAuthorsClient) Recv() (*Author, error) {
	m := new(Author)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

// AuthorsServiceServer is the server API for AuthorsService service.
// All implementations must embed UnimplementedAuthorsServiceServer
// for forward compatibility
type AuthorsServiceServer interface {
	GetAuthor(context.Context, *GetAuthorRequest) (*Author, error)
	GetAuthors(*Empty, AuthorsService_GetAuthorsServer) error
	mustEmbedUnimplementedAuthorsServiceServer()
}

// UnimplementedAuthorsServiceServer must be embedded to have forward compatible implementations.
type UnimplementedAuthorsServiceServer struct {
}

func (UnimplementedAuthorsServiceServer) GetAuthor(context.Context, *GetAuthorRequest) (*Author, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetAuthor not implemented")
}
func (UnimplementedAuthorsServiceServer) GetAuthors(*Empty, AuthorsService_GetAuthorsServer) error {
	return status.Errorf(codes.Unimplemented, "method GetAuthors not implemented")
}
func (UnimplementedAuthorsServiceServer) mustEmbedUnimplementedAuthorsServiceServer() {}

// UnsafeAuthorsServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to AuthorsServiceServer will
// result in compilation errors.
type UnsafeAuthorsServiceServer interface {
	mustEmbedUnimplementedAuthorsServiceServer()
}

func RegisterAuthorsServiceServer(s grpc.ServiceRegistrar, srv AuthorsServiceServer) {
	s.RegisterService(&AuthorsService_ServiceDesc, srv)
}

func _AuthorsService_GetAuthor_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetAuthorRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(AuthorsServiceServer).GetAuthor(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/proto.AuthorsService/GetAuthor",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(AuthorsServiceServer).GetAuthor(ctx, req.(*GetAuthorRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _AuthorsService_GetAuthors_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(Empty)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(AuthorsServiceServer).GetAuthors(m, &authorsServiceGetAuthorsServer{stream})
}

type AuthorsService_GetAuthorsServer interface {
	Send(*Author) error
	grpc.ServerStream
}

type authorsServiceGetAuthorsServer struct {
	grpc.ServerStream
}

func (x *authorsServiceGetAuthorsServer) Send(m *Author) error {
	return x.ServerStream.SendMsg(m)
}

// AuthorsService_ServiceDesc is the grpc.ServiceDesc for AuthorsService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var AuthorsService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "proto.AuthorsService",
	HandlerType: (*AuthorsServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetAuthor",
			Handler:    _AuthorsService_GetAuthor_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "GetAuthors",
			Handler:       _AuthorsService_GetAuthors_Handler,
			ServerStreams: true,
		},
	},
	Metadata: "proto/nest-sand.proto",
}
