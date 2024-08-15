import "reflect-metadata";
import "dotenv/config";
import "module-alias/register";

import fastify, { FastifyInstance } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import bootstrapApp from "./bootstrap";
import RouteVersion from "@config/route.config";
import routes from "./shared/routes/index.routes";

class App {
  private fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>;

  constructor() {
    this.fastify = fastify({ logger: false });

    bootstrapApp(this.fastify);

    this.registerModules();
  }

  private async registerModules() {
    this.fastify.register(routes.app);
    this.fastify.register(routes.health);
    this.fastify.register(routes.auditTrail, { prefix: RouteVersion.v1 });
  }

  public getInstance() {
    return this.fastify;
  }

  public async close() {
    await this.fastify.close();
  }

  public listen(port: number, address = "0.0.0.0") {
    return this.fastify.listen(port, address);
  }
}

export default App;
