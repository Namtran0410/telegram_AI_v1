export class RequestAiImage {
  /** ImageId is file photo name */
  async requestEditImage(
    imageId: string, //This is the imagename, used for get direction "userId/imageId"
    userId: string, 
    message: string
  ){
    let url = `${process.env.base_url}/api/image/edit?imageId=${imageId}&userId=${userId}`
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "x-internal-secret": process.env.SECRET_KEY as string,
      },
      body: JSON.stringify({ message }),
    })
    const data= await res.json()
    console.log({ message })
    console.log({status: res.status, data})
    
    return {status: res.status, data}
  }

  async requestGenVideo(
    imageId: string, 
    userId: string, 
    message: string
  ){

  }
}
