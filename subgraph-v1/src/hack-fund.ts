import { BigInt, Bytes, json, dataSource } from "@graphprotocol/graph-ts";
import {
	Mint as MintEvent,
	NewHack as NewHackEvent,
} from "../generated/HackFund/HackFund";
import { Hack, HackMetadata } from "../generated/schema";
import { HackMetadata as HackMetadataTemplate } from '../generated/templates'
import { HackFund } from '../generated/HackFund/HackFund';

export function handleNewHack(event: NewHackEvent): void {
	let entity = new Hack(event.params.token);

	let hackFund = HackFund.bind(event.address);
	let hack = hackFund.getHack(event.params.token);

	entity.token = event.params.token;
	entity.deployer = event.transaction.from;
	entity.totalSupply = BigInt.zero(); // TODO: Get total supply from token

	const metadataUri = "";
	HackMetadataTemplate.create(metadataUri);

	entity.save();
}

export function handleMint(event: MintEvent): void {
	let entity = Hack.load(event.params.token);
	if (entity == null) {
		throw new Error("Hack not found");
	}

	entity.totalSupply = entity.totalSupply.plus(event.params.amount);

	entity.save();
}

export function handleMetadata(content: Bytes): void {
	let metadata = new HackMetadata(Bytes.fromUTF8(dataSource.stringParam()));
	const value = json.fromBytes(content).toObject();
	if (value) {
		const name = value.get('name');
		const description = value.get('description');
		const avatar = value.get('avatar');
		const banner = value.get('banner');
		const category = value.get('category');
		const links = value.get('links');
		const nfts = value.get('nfts');
		const signature = value.get('signature');

		if (name && description && avatar && banner && category && links && nfts && signature) {
			metadata.name = name.toString();
			metadata.description = description.toString();
			metadata.avatar = avatar.toString();
			metadata.banner = banner.toString();
			metadata.category = category.toString();
			metadata.links = links.toArray().map((link) => link.toString());
			metadata.nfts = nfts.toArray().map((nft) => nft.toString());
			metadata.signature = signature.toString();
		}

		metadata.save();
	}
}