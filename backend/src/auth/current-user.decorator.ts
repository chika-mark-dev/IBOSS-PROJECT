import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/users/entities/user.entity';

export interface AuthUser {
  id: string;
  role: Role;
}

export const CurrentUser = createParamDecorator(
  (field: keyof AuthUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{ user: AuthUser }>();
    const user = request.user;
    return field ? user?.[field] : user;
  },
);
