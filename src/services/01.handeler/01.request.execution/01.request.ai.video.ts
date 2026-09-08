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
}
