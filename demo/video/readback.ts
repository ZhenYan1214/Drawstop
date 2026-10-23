// Scene 5: reads the live-source attestations back from the StatusRegistry on Sepolia (read-only) and writes
// clips/readback.json for make-chain.js.   bun demo/video/readback.ts [rpc]
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { createPublicClient, http, keccak256, toHex, type Hex } from '../../status-monitor/node_modules/viem'
import { sepolia } from '../../status-monitor/node_modules/viem/chains'

const REGISTRY = '0x1AE232515B9C011152335e68314f12926e4d1245'
const TXS: Record<string, Hex> = {
	'11877818': '0xfd78a1e72de6589e2dd1dda06b23b19219d9811de464011d0d4e437e10f1743e',
	'00445790': '0xeb8dc9acdb12b147e43d8673dc88e26480c876ea56b99849c447bca859e33e6a',
}
const client = createPublicClient({ chain: sepolia, transport: http(process.argv[2] ?? 'https://ethereum-sepolia-rpc.publicnode.com') })
const abi = [
	{
		type: 'function', name: 'getLatest', stateMutability: 'view', inputs: [{ name: 'entityId', type: 'bytes32' }],
		outputs: [{ type: 'tuple', components: [
			{ name: 'id', type: 'uint256' }, { name: 'checkedAt', type: 'uint64' }, { name: 'validUntil', type: 'uint64' },
			{ name: 'eventBits', type: 'uint32' }, { name: 'unavailableBits', type: 'uint32' }, { name: 'activeBits', type: 'uint32' },
			{ name: 'chUpdatedAt', type: 'uint64' }, { name: 'gazetteUpdatedAt', type: 'uint64' }, { name: 'gleifUpdatedAt', type: 'uint64' },
			{ name: 'petitionPresentedAt', type: 'uint64' }, { name: 'petitionPublishedAt', type: 'uint64' },
			{ name: 'petitionCaseRef', type: 'bytes32' }, { name: 'evidenceHash', type: 'bytes32' }, { name: 'requestId', type: 'bytes32' },
		] }],
	},
] as const

const out: unknown[] = []
for (const [company, tx] of Object.entries(TXS)) {
	const entityId = keccak256(toHex(`GB-CH:${company}`))
	const a = await client.readContract({ address: REGISTRY, abi, functionName: 'getLatest', args: [entityId] })
	const receipt = await client.getTransactionReceipt({ hash: tx })
	const block = await client.getBlock({ blockNumber: receipt.blockNumber })
	out.push({
		company, tx, status: receipt.status, block: Number(receipt.blockNumber), blockTime: Number(block.timestamp),
		id: Number(a.id), checkedAt: Number(a.checkedAt), eventBits: a.eventBits, unavailableBits: a.unavailableBits,
		petitionPresentedAt: Number(a.petitionPresentedAt), petitionPublishedAt: Number(a.petitionPublishedAt), evidenceHash: a.evidenceHash,
	})
}
mkdirSync(join(import.meta.dir, 'clips'), { recursive: true })
const file = join(import.meta.dir, 'clips', 'readback.json')
writeFileSync(file, JSON.stringify({ readAt: Math.floor(Date.now() / 1000), registry: REGISTRY, rows: out }, null, 1))
console.log(JSON.stringify(out, null, 1))
