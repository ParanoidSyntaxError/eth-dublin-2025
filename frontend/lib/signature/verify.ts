import bs58 from "bs58";
import nacl from "tweetnacl";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_SIGNATURE_PUBLIC_KEY;

export function verfiy(signature: string, message: string): boolean {
    try {
        return nacl.sign.detached.verify(
            new TextEncoder().encode(message),
            bs58.decode(signature),
            bs58.decode(PUBLIC_KEY)
        );
    } catch (error) {
        return false;
    }
}