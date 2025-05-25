import { Bytes, json, dataSource, log } from "@graphprotocol/graph-ts";
import {
	Mint as MintEvent,
	NewHack as NewHackEvent,
	NewToken as NewTokenEvent,
} from "../generated/HackFund/HackFund"
import { Token, Hack, HackMetadata } from "../generated/schema";
import { HackMetadata as HackMetadataTemplate } from '../generated/templates';

export function handleNewToken(event: NewTokenEvent): void {
	let entity = new Token(tokenId(event.params.token));

	entity.name = event.params.name;
	entity.symbol = event.params.symbol;
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
	entity.metadata = Bytes.fromUTF8(event.params.metadataUri);

	log.warning("METADATA_URI: {}", [event.params.metadataUri]);
	HackMetadataTemplate.create(event.params.metadataUri);
	log.warning("CREATE", []);

	entity.save();
}

export function handleHackMetadata(content: Bytes): void {
	log.warning("CONTENT: {}", [content.toString()]);
	let metadata = new HackMetadata(Bytes.fromUTF8(dataSource.stringParam()));
	const value = json.fromBytes(content).toObject();
	log.warning("VALUE: {}", [json.fromBytes(content).toString()]);
	if (value) {
		log.warning("VALUE HIT", []);

		const name = value.get('name');
		const description = value.get('description');
		const avatar = value.get('avatar');
		const banner = value.get('banner');
		const category = value.get('category');
		const links = value.get('links');
		const nfts = value.get('nfts');
		const signature = value.get('signature');

		if (name && description && avatar && banner && category && links && nfts && signature) {
			log.warning("PARAMS HIT", []);

			metadata.cid = dataSource.stringParam();
			metadata.name = name.toString();
			metadata.description = description.toString();
			metadata.avatar = avatar.toString();
			metadata.banner = banner.toString();
			metadata.category = category.toString();
			metadata.links = links.toArray().map<string>((link) => link.toString());
			metadata.nfts = nfts.toArray().map<string>((nft) => nft.toString());
			metadata.signature = signature.toString();
		}

		metadata.save();
	}
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
    return token.concat(Bytes.fromUTF8("-token"))
}

export function hackId(token: Bytes): Bytes {
	return token.concat(Bytes.fromUTF8("-hack"));
}