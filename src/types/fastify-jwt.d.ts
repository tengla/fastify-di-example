import { AuthUserProps } from "../domain/entity/auth-user";

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: AuthUserProps
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUserProps;
  }
}