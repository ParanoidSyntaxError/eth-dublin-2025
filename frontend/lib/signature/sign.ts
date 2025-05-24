import "server-only";

import bs58 from "bs58";
import nacl from "tweetnacl";

const PRIVATE_KEY = process.env.SIGNATURE_PRIVATE_KEY;

export function sign(message: string): string | undefined {
    try {
        return bs58.encode(nacl.sign.detached(
            new TextEncoder().encode(message),
            bs58.decode(PRIVATE_KEY)
        ));
    } catch (error) {
        return undefined;
    }
}