import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const USERS_PATH = fileURLToPath(
    new URL("./storage/users.json", import.meta.url)
);

export class UserData {
    static async #read() {
        const data = await readFile(USERS_PATH, "utf8");
        return JSON.parse(data);
    }

    static async #write(users) {
        await writeFile(
            USERS_PATH,
            JSON.stringify(users, null, 4)
        );
    }

    static async create(user) {
        const users = await this.#read();

        if (!users[user.id]) {
            users[user.id] = {
                username: user.username,
                breezes: 0,
                crystals: 0,
                levelPoints: 0,
                level: 0,
                items: [],
                cards: [],
                usedCodes: [],
                achievments: []
            };

            await this.#write(users);
        }

        return users[user.id];
    }

    static async get(userId) {
        const users = await this.#read();
        return users[userId] ?? null;
    }

    static async save(userId, data) {
        const users = await this.#read();

        users[userId] = data;

        await this.#write(users);

        return data;
    }

    static async exists(userId) {
        const users = await this.#read();
        return userId in users;
    }

    static async all() {
        return await this.#read();
    }
}