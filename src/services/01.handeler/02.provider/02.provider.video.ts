import { message } from "telegraf/filters";
import { app } from "./00.provide.index.js";
import { StarStorage } from "src/utils/storage.star.js";

export class ProviderVideoExecution {
  readonly starStorage: StarStorage
  constructor(){
    this.cut()
    this.gen()
    this.starStorage = new StarStorage()
  }
  readonly cut = async ()=> {
    app.post("/api/video/cut", async (r) => {
      const body = await r.req.json();
      const { file_id, duration, cutLength, outputPath } = body;
      if (!file_id || !duration || !cutLength) {
        return r.json(
          {
            status: false,
            message: "missing required field",
          },
          400,
        );
      } else {
        return r.json({
          status: true,
          message: `Cutting video successed `,
        }, 200);
      }
    });
  }

  readonly gen = async()=> {
    app.post("/api/video/gen", async(r)=> {
      const param = r.req.query('seconds')
      const headers = r.req.header()
      const xInternalSec = headers['x-internal-secret']
      const xUserId = headers['x-user-id']
      const userStar = await this.starStorage.getStorageUserInfor(Number(xUserId))

      const body =  await r.req.json()
      const message = body.message
      if(xInternalSec != process.env.SECRET_KEY) {
        return r.json({
          message: "Authorization failed"
        }, 401)
      }
      else if (!param){
        return r.json({
          message: "Missing required field"
        }, 404)
      } else if (userStar.star < Number(param)*20 ) {
        return r.json({
          message: "Your Star is not enough"
        }, 401)
      }
      else {
        const remainStar = userStar.star - Number(param)*20
        this.starStorage.storageStarOfUser({
          "star": remainStar,
          "userId": Number(xUserId),
          "username": userStar.username
        })
        return r.json({
          message: `Success create video with length: ${param} seconds, \nyour request: ${message}, \nyour balance stars: ${remainStar} ⭐ `
        }, 200)
      }
    })
  }

  }
