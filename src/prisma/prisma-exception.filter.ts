import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter{
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    if(exception.code === 'P2025'){
      return response.status(404).json({
        message: exception.meta?.cause ?? exception.message
      })
    }

    return response.status(500).json({
      message: 'Internal server error'
    })
  }
}