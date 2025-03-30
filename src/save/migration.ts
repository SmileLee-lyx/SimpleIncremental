import { type Player } from "@/core/main/defines.js";

export function migration(data: any): Player {
    if (typeof data !== "object")
        throw new Error("data must be an object");
    if (typeof data.version !== 'number')
        throw new Error("data must contain a version");
    if (data.version > 0)
        throw new Error("Illegal version " + data.version);
    let result = data.data as Player;
    if (data.version <= 0) {
        // migration for version 1
    }
    return result;
}