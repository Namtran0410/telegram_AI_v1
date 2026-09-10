import fs from "node:fs";
import fsPromises from "node:fs/promises";
import lockfile from "proper-lockfile";

export type User = {
  userId: number;
  username: string | undefined;
  star: number;

  // last_purchase: string
};
export class StarStorage {
  private path = "src/data/user.json";
  async storageStarOfUser(user: User): Promise<void> {
    // Tạo file nếu chưa tồn tại
    if (!fs.existsSync(this.path)) {
      await fsPromises.writeFile(this.path, "[]", "utf-8");
    }

    const release = await lockfile.lock(this.path, { retries: 5 });

    try {
      // Đọc dữ liệu hiện tại
      let readData: User[] = [];
      try {
        const rawReadData = await fsPromises.readFile(this.path, "utf-8");
        readData = JSON.parse(rawReadData);
      } catch {
        readData = [];
      }

      // Tìm user theo userId
      const index = readData.findIndex(
        (item: User) => item.userId === user.userId,
      );

      if (index !== -1) {
        // Update user cũ
        readData[index] = user;
      } else {
        // Thêm user mới
        readData.push(user);
      }

      // Ghi lại toàn bộ dữ liệu
      await fsPromises.writeFile(
        this.path,
        JSON.stringify(readData, null, 2),
        "utf-8",
      );
    } finally {
      await release();
    }
  }
  async getStorageUserInfor(userId: number): Promise<User> {
    let rawDataRead = await fsPromises.readFile(this.path, "utf-8");
    if (!rawDataRead) {
      await fsPromises.writeFile(this.path, "[]", "utf-8");
      rawDataRead = "[]";
    }

    const readData = JSON.parse(rawDataRead);
    let userInfor = readData.find((item: any) => item.userId == userId);
    if (!userInfor) {
      userInfor = {
        userId: 0,
        username: "noName",
        star: 0,
      };
    }
    return userInfor;
  }

}
