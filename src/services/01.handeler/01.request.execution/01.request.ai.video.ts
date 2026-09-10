export class RequestAiVideo {
  async requestCutVideo(
    file_id: string,
    duration: number,
    cutLength: number,
  ): Promise<{
    status: boolean;
    message: string;
  }> {
    let url = `${process.env.base_url}/api/video/cut`;
    console.log({ url });
    const req = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        file_id,
        duration,
        cutLength,
      }),
    });
    const response = await req.json();
    return response;
  }
  async requestGenVideo(userId: number, seconds: number, message: string){
    const listOption = ["6", "30", "60", "120"]
    if(!listOption.some(item =>  item == String(seconds))) {
      return
    }
    let url = `${process.env.base_url}/api/video/gen?seconds=${seconds}`;
    const res =  await fetch(url, {
      method: "POST",
      headers: {
        "x-internal-secret": process.env.SECRET_KEY  as string,
        "x-user-id": String(userId)
      },
      body: JSON.stringify({message})
    })
    const response = await res.json()
    return response
  }
}
