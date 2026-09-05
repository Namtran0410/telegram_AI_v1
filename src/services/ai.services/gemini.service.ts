import dotenv from 'dotenv'
dotenv.config()
export class GeminiService {
    async callGemini(url: string, input: string){
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': process.env.GEMINI_TOKEN as string
            },
            body: JSON.stringify(
                {
                    "model": "gemini-2.5-flash",
                    "input": input
                }
            )
        })
        console.log({status: res.status})
        const data = await res.json()
        return {status: res.status, data: data}
    }
    async triggerAPI(url: string, input : string){
        let res = await this.callGemini(url, input)

        let attempt = 2
        while(attempt > 0) {
            if(res.status == 200) {
                break
            } else {
                res = await this.callGemini(url, input)
                attempt --
            }
        }
        // console.dir(res.data, {depth: null, color: true})
        const foundItem = res.data.steps.find((item: any) => Object.hasOwn(item, "content"));
        const content = foundItem ? foundItem.content[0]['text'] : undefined;
        const rawText= content.replace(/\\n/g, '\n')
        console.log({rawText})
        return rawText
    }
    async callAPIByTurn(list: Array<string>){
    let url = process.env.GEMINI_2_5_URL as string
    let responseText = ""
    let contents: Array<Object> = []
        for(let text of list) {
            contents.push(
                {
                    "role": "user",
                    "parts": [{"text": text}]
                }
            )
            let body = JSON.stringify({
                "contents": contents
            })

            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': process.env.GEMINI_TOKEN as string
                },
                body: body
            })
            const pureResponse = await res.json()
            console.log(res.status)
            console.dir("rrrrrrrrrrrrrrrrrrrrr",pureResponse)
            responseText = pureResponse.candidates[0].content.parts[0].text
            
            console.dir("aaaaaaaaaaaaaaaaaaaaacl",responseText)
            contents.push(
                {
                    "role": "model",
                    "parts": [{"text": responseText}]
                }
            )
        }
        return responseText
    }   
}

// const geminiServ = new GeminiService()
// const content = await geminiServ.callAPIByTurn(["Bạn là ai?", "Tôi vừa hỏi bạn gì nhỉ?"])
// console.log(content)
