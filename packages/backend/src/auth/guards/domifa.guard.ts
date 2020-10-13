import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../../users/user-role.type";
import { ConfigService } from "../../config";
import { appLogger } from "../../util";

@Injectable()
export class DomifaGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService
  ) { }

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const isValidRole =
      !!user &&
      user.role === "admin" &&
      (user.structureId === 1 ||
        (this.configService.getEnvId() === "preprod" &&
          user.structureId === 205));
    if (user && !isValidRole) {
      appLogger.warn(
        `[DomifaGuard] invalid role "${user.role}" or structureId "${user.structureId}" for user "${user._id}" with role "${user.role}"`,
        {
          sentryBreadcrumb: true,
        }
      );
      appLogger.error(`[DomifaGuard] invalid role`);
    }
    return isValidRole;
  }
}
