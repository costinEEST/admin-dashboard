import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastifyHelmet from "@fastify/helmet";
import fastifyFormbody from "@fastify/formbody";

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  // put your options here
});

await fastify.register(fastifyHelmet, {
  crossOriginResourcePolicy: {
    policy: "cross-origin",
  },
});

await fastify.register(fastifyFormbody);

fastify
  .register(fastifyEnv, {
    schema: {
      type: "object",
      required: ["PORT"],
      properties: {
        PORT: {
          type: "string",
          default: 3000,
        },
      },
    },
  })
  .ready((err) => {
    if (err) console.error(err);

    console.log(fastify.config);
  });

fastify.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  function (_, body, done) {
    try {
      const json = JSON.parse(body);
      done(null, json);
    } catch (err) {
      err.statusCode = 400;
      done(err, undefined);
    }
  }
);

fastify.get("/", async (request, reply) => {});

(async () => {
  try {
    await fastify.listen({
      port: process.env.PORT,
      host: process.env.HOST || "0.0.0.0",
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
