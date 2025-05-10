import "reflect-metadata/lite";
import { container } from "tsyringe";
import fastify from "fastify";
import pino from "pino";
import { AuthUserEntity } from "@/domain/entity/auth-user";
import { AuthService } from "@/domain/services/auth.service";
import { z } from "zod";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { LoggerService, Logger } from "@/domain/services/logger.service";
import { CreatePractitionerUseCase } from "@/domain/use-cases/employees/create-practitioner";
import { WelcomeUseCase } from "@/domain/use-cases/welcome/welcome";
import type { UseCase, UseCaseError } from "@/domain/use-cases/use-case";

const users = new Map<string, { id: string; email: string; name: string; role: string }>();
users.set("1", { id: "1", email: "john@example", name: "John Doe", role: "admin" });
users.set("2", { id: "2", email: "jane@example", name: "Jane Doe", role: "user" });
users.set("3", { id: "3", email: "johnjr@example", name: "John Jr Doe", role: "user" });

container.registerInstance(
  AuthService,
  new AuthService(
    new AuthUserEntity()
  )
)

const app = fastify().withTypeProvider<ZodTypeProvider>()
  .setValidatorCompiler(validatorCompiler)
  .setSerializerCompiler(serializerCompiler);

app.addHook("onRequest", async (request, reply) => {
  container.registerInstance(
    LoggerService,
    Logger.child({
      requestId: request.id,
      userId: request.headers["x-user-id"],
    })
  );
  const context = container.createChildContainer();
  const userId = request.headers["x-user-id"] as string;
  if (userId && users.has(userId)) {
    const user = users.get(userId);
    context.registerInstance(
      AuthService,
      new AuthService(
        new AuthUserEntity({
          id: Number.parseInt(user?.id!),
          email: user?.email!,
          name: user?.name,
          role: user?.role,
        })
      )
    )
    Logger.info({ userId }, "User authenticated");
  } else {
    Logger.error({ userId }, "Unauthorized");
    reply.code(401).send({ error: "Unauthorized" });
  }
  request.container = context;
});

app.addHook("onResponse", async (request) => {
  await request.container.dispose();
});

app.get("/", async (request,reply) => {
  const useCase = request.container.resolve(WelcomeUseCase);
  try {
    return { hello: await useCase.execute() };
  } catch (error: unknown) {
    const err = error as UseCaseError;
    request.log.error(err);
    reply.code(err.httpCode).send(err.message);
  }
});

app.post("/practitioners", {
  schema: {
    body: z.object({
      name: z.string().min(1),
      email: z.string().email(),
    }),
  }
}, async (request) => {
  const useCase = request.container.resolve(CreatePractitionerUseCase);
  const record = await useCase.execute({
    name: request.body.name,
    email: request.body.email,
  })
  return record;
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
})