import { BotRunner } from "./run.js";

export class Main {
    readonly botRunner: BotRunner
    constructor(){
        this.botRunner = new BotRunner()
        this.assignAction()
    }
    async assignAction(){
        await this.botRunner.run()
    }
}