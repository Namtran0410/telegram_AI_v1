import { app } from "./00.provide.index.js";
import { StarStorage } from "src/utils/storage.star.js";

export class ProviderImageExecution {
  readonly starStorage: StarStorage;
  constructor() {
    this.edit();
    this.gen()
    this.starStorage = new StarStorage();
  }

  readonly edit = async () => {
    app.post("/api/image/edit", async(c)=> {
      const qrUserId = c.req.query("userId")
      const qrImageId = c.req.query("imageId")
      const headers = c.req.header()
      const xInternalSec = headers["x-internal-secret"]
      const userStar = await this.starStorage.getStorageUserInfor(Number(qrUserId))
      const body = await c.req.json()
      const message  = body.message

      if(xInternalSec != process.env.SECRET_KEY) {
        return c.json({
          message: "Authorization failed"
        }, 401)
      }
      else if(!qrImageId || !qrUserId  || !message ){
        return c.json({
            message: "Missing required field",
          },
          404,
        )
      }
      else if(userStar.star < Number(process.env.PRICE_IMAGE)) {
        return c.json({
          message: "Your Star is not enough"
        }, 404)
      } else {
        const remainStar = userStar.star - Number(process.env.PRICE_IMAGE)
        /** Call api falui in this line and get resource for video */
        this.starStorage.storageStarOfUser({
          star: remainStar,
          userId: Number(qrUserId),
          username: userStar.username
        })
        return c.json({
          message: `Image edited successfuly. \nYour request: ${message}, \nYour balance stars: ${remainStar} ⭐ `,
        })
      }
    })
  };
  readonly gen = async()=> {
    app.post("/api/image/gen", async(c)=>{
      const qrUserId = c.req.query("userId")
      const qrImageId = c.req.query("imageId")
      const headers = c.req.header()
      const xInternalSec = headers["x-internal-secret"]
      const userStar = await this.starStorage.getStorageUserInfor(Number(qrUserId))
      const body = await c.req.json()
      const message  = body.message

      if(xInternalSec != process.env.SECRET_KEY)  {
        return c.json({
          message: "Authorization failed"
        }, 401)
      } else if (!qrImageId || !message || !qrUserId){
        return c.json({
          message: "Missing required field",
        }, 404)      
      } else {
        const remainStar = userStar.star - Number(process.env.PRICE_IMAGE)
        /** 
         * Call api falui in this line and get resource for image */
        
        this.starStorage.storageStarOfUser({
          star: remainStar,
          userId: Number(qrUserId),
          username: userStar.username
        })
        return c.json({
          message: `Image generation successfuly. \nYour request: ${message}, \nYour balance stars: ${remainStar} ⭐ `,
        })
      }
    })
  }
}
