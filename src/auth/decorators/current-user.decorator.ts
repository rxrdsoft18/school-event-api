import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx),
);

const getCurrentUserByContext = (ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user ?? null;
};
