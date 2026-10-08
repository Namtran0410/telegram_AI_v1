import {Queue, Worker} from 'bullmq'
import {Redis}from 'ioredis'

const connection = new Redis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null
})

const queue = new Queue("house_hold", {connection})
await queue.add("Quet-Nha", {loc: "Master room"})
await queue.add("Quet-Nha", {loc: "Bed room"})
await queue.add("Quet-Nha", {loc: "Restroom"})
const workers = new Worker("house_hold", async(job)=> {
    },    
    {
        connection,
        limiter: {max: 2, duration: 5000}
    })
workers.on("active", async(job)=> {
    console.log(`Active job: ${job.name} at ${job.data.loc}`)
})
workers.on("completed", async(job)=> {
    console.log(`Completed job: ${job.name} at ${job.data.loc}`)
})
