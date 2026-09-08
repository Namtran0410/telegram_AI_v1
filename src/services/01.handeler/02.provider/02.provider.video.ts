import { app } from "./00.provide.index.js";

export class ProviderVideoExecution {
    async execution(){
        app.post("/api/video/cut", async(r)=> {
            const body = await r.req.json()
            const {file_id, duration, cutLength, outputPath} = body
            if(!file_id || !duration || !cutLength) {
                return r.json({
                    status: false,
                    message: "missing required field"
                }, 400)
            } else {
                return r.json({
                    status: true,
                    message: `Cutting video with ${cutLength} seconds `
                })
            }
        })
    }
}