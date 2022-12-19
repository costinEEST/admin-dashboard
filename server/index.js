import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastifyHelmet from "@fastify/helmet";
import fastifyFormbody from "@fastify/formbody";
import mongoose from "mongoose";

const app = Fastify({ logger: true });

// await fastify.register(cors, {
//   // put your options here
// });

// await fastify.register(fastifyHelmet, {
//   crossOriginResourcePolicy: {
//     policy: "cross-origin",
//   },
// });

// await fastify.register(fastifyFormbody);

app.get("/", async (request, reply) => {
  return "hello";
});

/**
 * Initialize
 * */

(async () => {
  app
    .register(fastifyEnv, {
      dotenv: true,
      schema: {
        type: "object",
        required: ["HOST", "PORT"],
        properties: {
          HOST: {
            type: "string",
            default: "localhost",
          },
          MONGO_URL: {
            type: "string",
          },
          PORT: {
            type: "string",
            default: 5001,
          },
        },
      },
    })
    .ready((err) => {
      if (err) console.error(err);

      console.log({ envSchemaConfig: app.config });
    });

  await app.after();

  /**
   * Mongoose setup
   * */
  mongoose
    .set("strictQuery", false)
    .connect(app.config.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => app.log.info("MongoDB connected..."))
    .catch((err) => app.log.error(err));
})();

// fastify.addContentTypeParser(
//   "application/json",
//   { parseAs: "string" },
//   function (_, body, done) {
//     try {
//       const json = JSON.parse(body);
//       done(null, json);
//     } catch (err) {
//       err.statusCode = 400;
//       done(err, undefined);
//     }
//   }
// );

(async () => {
  /**
   * Fire up the server
   * */
  try {
    await app.ready();
    await app.listen({
      port: app.config.PORT,
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
