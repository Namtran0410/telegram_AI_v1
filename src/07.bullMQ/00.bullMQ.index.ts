import { Job, Queue, QueueEvents, Worker } from "bullmq"
import {Redis} from "ioredis"

export const config = {
    host: "127.0.0.1",
    port: 6379,
    attempt: 3,
    retryDelay: 1000
}
export class MessageQueueIndex {
    readonly producerConn: Redis
    readonly workerConn: Redis
    constructor(){
        this.producerConn = new Redis({
            host: config.host,
            port: config.port,
            maxRetriesPerRequest: null
        })
        this.workerConn = new Redis({
            host: config.host,
            port: config.port,
            maxRetriesPerRequest: 2
        })
    }
    /** Declare Message Queue */
    private RegisterMessageQueue<I,U>(message: string){
        return new Queue<I,U>(message, {
            connection: this.producerConn,
            defaultJobOptions: {
                attempts: config.attempt,
                backoff: {
                    type: "exponential",
                    delay: config.retryDelay
                } 
            }
        })
    }
    async RegisterPushMessage<I>(message: string, job: string, input:I ){
        const queue = this.RegisterMessageQueue(message)
        await queue.add(job, input)
    }
    async RegisterWorkers<I, U>(message: string, handler: (job: Job<I>) => Promise<U>) {
        return new Worker<I, U>(message, handler, {
            connection: this.producerConn
        })
    }
    async RegisterListener(message: string) {
        const listener = new QueueEvents(message, {connection: this.producerConn})
        listener.on("completed", ({jobId, returnvalue})=>{
            console.log(`completed job: ${jobId} with return value: ${JSON.stringify(returnvalue)}`)
        })
        listener.on("failed", ({jobId, failedReason})=> {
            console.log(`failed job: ${jobId} with return value: ${JSON.stringify(failedReason)}`)
        })
        listener.on("error", (err)=> {
            console.log(err)
        })
    }
}

export default new MessageQueueIndex()