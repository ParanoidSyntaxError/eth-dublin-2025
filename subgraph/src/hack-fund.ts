import { Bytes } from "@graphprotocol/graph-ts";
import {
	Mint as MintEvent,
	NewHack as NewHackEvent,
	NewToken as NewTokenEvent,
} from "../generated/HackFund/HackFund"
import { Token, Hack } from "../generated/schema";

export function handleNewToken(event: NewTokenEvent): void {
	let entity = new Token(tokenId(event.params.token));

	entity.address = event.params.token.toHexString();
	entity.name = event.params.name;
	entity.symbol = event.params.symbol;
	entity.initialSupply = event.params.totalSupply;
	entity.totalSupply = event.params.totalSupply;

	entity.save()
}

export function handleNewHack(event: NewHackEvent): void {
	let entity = new Hack(hackId(event.params.token));

	entity.token = tokenId(event.params.token);
	entity.deployer = event.transaction.from;
	entity.price = event.params.price;
	entity.expiration = event.params.expiration;
	entity.metadataUri = event.params.metadataUri;

	entity.save();
}

export function handleMint(event: MintEvent): void {
	let entity = Token.load(tokenId(event.params.token));
	if(entity == null) {
		throw new Error("Token not found");
	}

	entity.totalSupply = entity.totalSupply.plus(event.params.amount);

	entity.save();
}

export function tokenId(token: Bytes): Bytes {
    return token.concat(Bytes.fromUTF8("-token"));
}

export function hackId(token: Bytes): Bytes {
	return token.concat(Bytes.fromUTF8("-hack"));
}