import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const fn = fileURLToPath(import.meta.url);
const dirname = path.dirname(fn);

const filepath = path.join(
    dirname,
    "..",
    "..",
    "..",
    "storage",
    "users.json"
);

export interface User {
    username: string;
    breezes: number;
    crystals: number;
    levelPoints: number;
    level: number;

    items: {
        item_id: string;
        name: string;
    }[];

    cards: {
        name: string;
    }[];

    usedCodes: string[];

    achievments: {
        id: string;
        name: string;
    }[];

    timestamps?: {
        ccards: {
            rolls: number;
        };
    };
}

export enum ObjectType {
    BREEZE = "breeze",
    CRYSTAL = "crystals",
    CARDS = "cards",
    C_ROLLS = "rolls"
}

export type GiveMap = {
    [ObjectType.BREEZE]: number;
    [ObjectType.CRYSTAL]: number;
    [ObjectType.CARDS]: string;
    [ObjectType.C_ROLLS]: number;
};

class DataManage {

    private static async saveUsers(users: Record<string, User>) {
        await fs.writeFile(
            filepath,
            JSON.stringify(users, null, 4),
            "utf8"
        );
    }


    public static async fetchAllUsers(): Promise<Record<string, User>> {
        return JSON.parse(
            await fs.readFile(filepath, "utf8")
        );
    }


    public static async createUser(
        id: string,
        username: string
    ): Promise<User> {

        const users = await this.fetchAllUsers();

        if (!users[id]) {

            users[id] = {
                username,

                breezes: 0,
                crystals: 0,

                levelPoints: 0,
                level: 0,

                items: [],

                cards: [],

                usedCodes: [],

                achievments: [],

                timestamps: {
                    ccards: {
                        rolls: 0
                    }
                }
            };

            await this.saveUsers(users);
        }

        return users[id];
    }


    public static async fetchUser(
        id: string,
        username?: string
    ): Promise<User | null> {

        const users = await this.fetchAllUsers();

        if (!users[id] && username) {
            return await this.createUser(id, username);
        }

        return users[id] ?? null;
    }

    public static async update(id: string, callback: (user: User) => void) {
    const users = await this.fetchAllUsers();
    const user = users[id];

    if (!user) return;

    callback(user);

    await this.saveUsers(users);
}

    public static async give(
        id: string,
        type: ObjectType,
        value: string | number
    ) {

        const users = await this.fetchAllUsers();

        const user = users[id];

        
        if (!user) return;


        switch (type) {

            case ObjectType.C_ROLLS:
                user.timestamps ??= {
                    ccards: {
                        rolls: 0
                    }
                };

                user.timestamps.ccards.rolls++;
                break;


            case ObjectType.BREEZE:

                if (typeof value !== "number")
                    throw new Error(
                        "Breezes deve ser number."
                    );

                user.breezes += value;
                break;


            case ObjectType.CRYSTAL:

                if (typeof value !== "number")
                    throw new Error(
                        "Crystals deve ser number."
                    );

                user.crystals += value;
                break;


            case ObjectType.CARDS:

                if (typeof value !== "string")
                    throw new Error(
                        "Card deve ser string."
                    );

                user.cards.push({
                    name: value
                });

                break;
        }


        await this.saveUsers(users);
    }
}

export {
    DataManage
};