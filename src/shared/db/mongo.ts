import { connectToMongoDB } from "../utils/db";

class MongoDB {
  #client: Awaited<ReturnType<typeof connectToMongoDB>> | null = null;

  async connect() {
    if (this.#client) {
      throw new Error("MongoDB already initialized");
    }

    this.#client = await connectToMongoDB();
  }

  get client() {
    if (!this.#client) {
      throw new Error("MongoDB not initialized");
    }

    return this.#client;
  }
}

export default new MongoDB();
