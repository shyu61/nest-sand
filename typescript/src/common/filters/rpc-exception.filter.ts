import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

// @Catch(RpcException)
@Catch()
export class ExceptionFilter implements RpcExceptionFilter {
  catch(exception: RpcException): Observable<any> {
    console.log({ name: exception.name, message: exception.message });
    return throwError(() => exception.getError());
  }
}
