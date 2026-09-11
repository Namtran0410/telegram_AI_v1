import { getRequestListener } from "@hono/node-server";
import { app } from "./00.provide.index.js";
import http from "node:http";
import { ProviderVideoExecution } from "./02.provider.video.js";
import { ProviderImageExecution } from "./01.provider.image.js";

import { logger } from "hono/logger";
export class ProvideExecution {
  readonly provideVideoExecution;
  readonly  provideImageExecution

  constructor() {
    app.use("*", logger());
    this.provideVideoExecution = new ProviderVideoExecution();
    this.provideImageExecution = new ProviderImageExecution()
    http
      .createServer(getRequestListener(app.fetch))
      .listen(process.env.port, () => {
        console.log(
          `server is running at ${process.env.host}${process.env.port}`,
        );
      });
  }
}
