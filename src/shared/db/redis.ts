import { connectToRedis } from "../utils/db";

class Redis {
  #client: Awaited<ReturnType<typeof connectToRedis>> | null = null;

  async connect() {
    if (this.#client) {
      throw new Error("Redis already initialized");
    }

    this.#client = await connectToRedis();
  }

  get client() {
    if (!this.#client) {
      throw new Error("Redis not initialized");
    }

    return this.#client;
  }
}

export default new Redis();
