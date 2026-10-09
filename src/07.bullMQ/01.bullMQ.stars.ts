import { Queue, Worker, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import MessageQueueIndex from  './00.bullMQ.index.js';
import dataFeature from 'src/06.data/03.db/data.feature.js';

/** Push star to db, function will receive a callback function */
type input = {
    userId: string
    coin: number 
}
type output = {
    success: boolean
}

export class MessageQueueCoin{
    async registerQueueAddCoin(input: input){
        await MessageQueueIndex.RegisterListener("add-coin")
        await MessageQueueIndex.RegisterPushMessage<input>("add-coin", "push-coin", input)
        await MessageQueueIndex.RegisterWorkers<input,output>("add-coin", async(job)=> {
            dataFeature.registerAddCoinToUser(input.userId, input.coin)
            return {success: true}    
        })
    }
}

export default new MessageQueueCoin()