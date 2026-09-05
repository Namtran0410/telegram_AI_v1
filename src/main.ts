import { RunAiBot } from "./services/run.js";
import dotenv from 'dotenv'
dotenv.config()

class Executed {
    private run
    constructor(){
        this.run = new RunAiBot()
    }
    async executed(){
        await this.run.runBot()
    }
}

/** Execution */
const main = new Executed()
await main.executed()
