import { Queue, Worker, QueueEvents } from "bullmq";
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
       
    /** send email in time */

    /** Worker */

    /** Listener */
}