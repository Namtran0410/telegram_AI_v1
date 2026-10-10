import { Queue, Worker, QueueEvents, Job } from "bullmq";
import {Redis} from "ioredis";

const connection = new Redis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null,
})
/**Tạo queue email. Đẩy 3 job gửi mail tới a@test.com, b@test.com, c@test.com. 
 * Worker in ra Gửi mail tới ... và trả về { sentAt }. Listener in ra kết quả của từng job. */

class ExerciseOne {
    /**Tạo queue */
    private registerQueue(message: string){
        return new Queue(message, {
            connection, 
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 1000
                }
            }
        })
    }
    /** Tạo message push */
    async registerPushMessage<h>(message: string, job: string, handler:h ) {
        const queue = this.registerQueue(message)
        queue.add(job, handler)
    }
    /** send email in time */
    async sendEmail(email: string){
        console.log("Send email to: ", email)
    }
    /** Worker */
    
    /** Listener */
}