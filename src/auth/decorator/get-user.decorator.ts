import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// creating custom decorators
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
