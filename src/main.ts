import { RunAiBot } from "./services/run.js";
import { ProvideExecution } from "./services/01.handeler/02.provider/00.provide.execution.js";

import dotenv from "dotenv";
dotenv.config();

class Executed {
  private run;
  readonly provideExecution;
  constructor() {
    this.provideExecution = new ProvideExecution();
    this.run = new RunAiBot();
  }
  async executed() {
    await this.run.runBot();
  }
}

/** Execution */
const main = new Executed();
await main.executed();
