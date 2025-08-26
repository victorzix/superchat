import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    console.log(exception);
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    if (exception instanceof HttpException) {
      const error = exception.getResponse();
      this.logger.error(error);
      return response
        .status(exception.getStatus())
        .json({ response: error, timestamp: new Date().toISOString() });
    } else {
      this.logger.error(exception);
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Erro no servidor' });
    }
  }
}
