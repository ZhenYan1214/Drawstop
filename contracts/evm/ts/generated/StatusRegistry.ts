// Code generated — DO NOT EDIT.
import {
  decodeEventLog,
  decodeFunctionResult,
  encodeEventTopics,
  encodeFunctionData,
  zeroAddress,
} from 'viem'
import type { Address, Hex } from 'viem'
import {
  bytesToHex,
  encodeCallMsg,
  EVMClient,
  hexToBase64,
  LAST_FINALIZED_BLOCK_NUMBER,
  prepareReportRequest,
  type EVMLog,
  type Runtime,
} from '@chainlink/cre-sdk'

export interface DecodedLog<T> extends Omit<EVMLog, 'data'> { data: T }

const encodeTopicValue = (t: Hex | Hex[] | null): string[] => {
  if (t == null) return []
  if (Array.isArray(t)) return t.map(hexToBase64)
  return [hexToBase64(t)]
}





/**
 * Filter params for AttestationRecorded. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type AttestationRecordedTopics = {
  entityId?: `0x${string}`
  attestationId?: bigint
  requestId?: `0x${string}`
}

/**
 * Decoded AttestationRecorded event data.
 */
export type AttestationRecordedDecoded = {
  entityId: `0x${string}`
  attestationId: bigint
  requestId: `0x${string}`
  attestation: { id: bigint; checkedAt: bigint; validUntil: bigint; eventBits: number; unavailableBits: number; activeBits: number; chUpdatedAt: bigint; gazetteUpdatedAt: bigint; gleifUpdatedAt: bigint; petitionPresentedAt: bigint; petitionPublishedAt: bigint; petitionCaseRef: `0x${string}`; evidenceHash: `0x${string}`; requestId: `0x${string}` }
}


/**
 * Filter params for EntityRegistered. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type EntityRegisteredTopics = {
  entityId?: `0x${string}`
}

/**
 * Decoded EntityRegistered event data.
 */
export type EntityRegisteredDecoded = {
  entityId: `0x${string}`
  companyNumber: string
  lei: string
}


/**
 * Filter params for ExpectedAuthorUpdated. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type ExpectedAuthorUpdatedTopics = {
  previousAuthor?: `0x${string}`
  newAuthor?: `0x${string}`
}

/**
 * Decoded ExpectedAuthorUpdated event data.
 */
export type ExpectedAuthorUpdatedDecoded = {
  previousAuthor: `0x${string}`
  newAuthor: `0x${string}`
}


/**
 * Filter params for ExpectedWorkflowIdUpdated. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type ExpectedWorkflowIdUpdatedTopics = {
  previousId?: `0x${string}`
  newId?: `0x${string}`
}

/**
 * Decoded ExpectedWorkflowIdUpdated event data.
 */
export type ExpectedWorkflowIdUpdatedDecoded = {
  previousId: `0x${string}`
  newId: `0x${string}`
}


/**
 * Filter params for ExpectedWorkflowNameUpdated. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type ExpectedWorkflowNameUpdatedTopics = {
  previousName?: `0x${string}`
  newName?: `0x${string}`
}

/**
 * Decoded ExpectedWorkflowNameUpdated event data.
 */
export type ExpectedWorkflowNameUpdatedDecoded = {
  previousName: `0x${string}`
  newName: `0x${string}`
}


/**
 * Filter params for ForwarderAddressUpdated. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type ForwarderAddressUpdatedTopics = {
  previousForwarder?: `0x${string}`
  newForwarder?: `0x${string}`
}

/**
 * Decoded ForwarderAddressUpdated event data.
 */
export type ForwarderAddressUpdatedDecoded = {
  previousForwarder: `0x${string}`
  newForwarder: `0x${string}`
}


/**
 * Filter params for OwnershipTransferred. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type OwnershipTransferredTopics = {
  previousOwner?: `0x${string}`
  newOwner?: `0x${string}`
}

/**
 * Decoded OwnershipTransferred event data.
 */
export type OwnershipTransferredDecoded = {
  previousOwner: `0x${string}`
  newOwner: `0x${string}`
}


/**
 * Filter params for RegistrarSet. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type RegistrarSetTopics = {
  registrar?: `0x${string}`
}

/**
 * Decoded RegistrarSet event data.
 */
export type RegistrarSetDecoded = {
  registrar: `0x${string}`
  allowed: boolean
}


export const StatusRegistryABI = [{"type":"constructor","inputs":[{"name":"forwarder","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"EVENT_COUNT","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"EV_CH_INSOLVENCY_HISTORY","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"EV_CH_STATUS_ADVERSE","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"EV_GLEIF_LEI_LAPSED","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"EV_GZ_INSOLVENCY_PROCEEDING","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"EV_GZ_PETITION_DISMISSED","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"EV_GZ_PETITION_PENDING","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"EV_SOURCE_CONFLICT","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"MAX_CLOCK_SKEW","inputs":[],"outputs":[{"name":"","type":"uint64","internalType":"uint64"}],"stateMutability":"view"},{"type":"function","name":"MAX_VALIDITY","inputs":[],"outputs":[{"name":"","type":"uint64","internalType":"uint64"}],"stateMutability":"view"},{"type":"function","name":"SRC_COMPANIES_HOUSE","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"SRC_GAZETTE","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"SRC_GLEIF","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"attestationCount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"entityIdFor","inputs":[{"name":"companyNumber","type":"string","internalType":"string"}],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"pure"},{"type":"function","name":"getEntity","inputs":[{"name":"entityId","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"","type":"tuple","internalType":"structStatusRegistry.Entity","components":[{"name":"companyNumber","type":"string","internalType":"string"},{"name":"lei","type":"string","internalType":"string"},{"name":"monitored","type":"bool","internalType":"bool"}]}],"stateMutability":"view"},{"type":"function","name":"getExpectedAuthor","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"getExpectedWorkflowId","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"getExpectedWorkflowName","inputs":[],"outputs":[{"name":"","type":"bytes10","internalType":"bytes10"}],"stateMutability":"view"},{"type":"function","name":"getFirstSeen","inputs":[{"name":"entityId","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"firstSeen","type":"uint64[]","internalType":"uint64[]"}],"stateMutability":"view"},{"type":"function","name":"getForwarderAddress","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"getLatest","inputs":[{"name":"entityId","type":"bytes32","internalType":"bytes32"}],"outputs":[{"name":"","type":"tuple","internalType":"structStatusRegistry.Attestation","components":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"checkedAt","type":"uint64","internalType":"uint64"},{"name":"validUntil","type":"uint64","internalType":"uint64"},{"name":"eventBits","type":"uint32","internalType":"uint32"},{"name":"unavailableBits","type":"uint32","internalType":"uint32"},{"name":"activeBits","type":"uint32","internalType":"uint32"},{"name":"chUpdatedAt","type":"uint64","internalType":"uint64"},{"name":"gazetteUpdatedAt","type":"uint64","internalType":"uint64"},{"name":"gleifUpdatedAt","type":"uint64","internalType":"uint64"},{"name":"petitionPresentedAt","type":"uint64","internalType":"uint64"},{"name":"petitionPublishedAt","type":"uint64","internalType":"uint64"},{"name":"petitionCaseRef","type":"bytes32","internalType":"bytes32"},{"name":"evidenceHash","type":"bytes32","internalType":"bytes32"},{"name":"requestId","type":"bytes32","internalType":"bytes32"}]}],"stateMutability":"view"},{"type":"function","name":"getMonitored","inputs":[],"outputs":[{"name":"ids","type":"bytes32[]","internalType":"bytes32[]"},{"name":"companyNumbers","type":"string[]","internalType":"string[]"},{"name":"leis","type":"string[]","internalType":"string[]"}],"stateMutability":"view"},{"type":"function","name":"isRegistrar","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"onReport","inputs":[{"name":"metadata","type":"bytes","internalType":"bytes"},{"name":"report","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"registerEntity","inputs":[{"name":"companyNumber","type":"string","internalType":"string"},{"name":"lei","type":"string","internalType":"string"}],"outputs":[{"name":"entityId","type":"bytes32","internalType":"bytes32"}],"stateMutability":"nonpayable"},{"type":"function","name":"renounceOwnership","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setExpectedAuthor","inputs":[{"name":"_author","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setExpectedWorkflowId","inputs":[{"name":"_id","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setExpectedWorkflowName","inputs":[{"name":"_name","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setForwarderAddress","inputs":[{"name":"_forwarder","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setRegistrar","inputs":[{"name":"registrar","type":"address","internalType":"address"},{"name":"allowed","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"sourceOf","inputs":[{"name":"eventBit","type":"uint8","internalType":"uint8"}],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"pure"},{"type":"function","name":"supportsInterface","inputs":[{"name":"interfaceId","type":"bytes4","internalType":"bytes4"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"transferOwnership","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"AttestationRecorded","inputs":[{"name":"entityId","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"attestationId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"requestId","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"attestation","type":"tuple","indexed":false,"internalType":"structStatusRegistry.Attestation","components":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"checkedAt","type":"uint64","internalType":"uint64"},{"name":"validUntil","type":"uint64","internalType":"uint64"},{"name":"eventBits","type":"uint32","internalType":"uint32"},{"name":"unavailableBits","type":"uint32","internalType":"uint32"},{"name":"activeBits","type":"uint32","internalType":"uint32"},{"name":"chUpdatedAt","type":"uint64","internalType":"uint64"},{"name":"gazetteUpdatedAt","type":"uint64","internalType":"uint64"},{"name":"gleifUpdatedAt","type":"uint64","internalType":"uint64"},{"name":"petitionPresentedAt","type":"uint64","internalType":"uint64"},{"name":"petitionPublishedAt","type":"uint64","internalType":"uint64"},{"name":"petitionCaseRef","type":"bytes32","internalType":"bytes32"},{"name":"evidenceHash","type":"bytes32","internalType":"bytes32"},{"name":"requestId","type":"bytes32","internalType":"bytes32"}]}],"anonymous":false},{"type":"event","name":"EntityRegistered","inputs":[{"name":"entityId","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"companyNumber","type":"string","indexed":false,"internalType":"string"},{"name":"lei","type":"string","indexed":false,"internalType":"string"}],"anonymous":false},{"type":"event","name":"ExpectedAuthorUpdated","inputs":[{"name":"previousAuthor","type":"address","indexed":true,"internalType":"address"},{"name":"newAuthor","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ExpectedWorkflowIdUpdated","inputs":[{"name":"previousId","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"newId","type":"bytes32","indexed":true,"internalType":"bytes32"}],"anonymous":false},{"type":"event","name":"ExpectedWorkflowNameUpdated","inputs":[{"name":"previousName","type":"bytes10","indexed":true,"internalType":"bytes10"},{"name":"newName","type":"bytes10","indexed":true,"internalType":"bytes10"}],"anonymous":false},{"type":"event","name":"ForwarderAddressUpdated","inputs":[{"name":"previousForwarder","type":"address","indexed":true,"internalType":"address"},{"name":"newForwarder","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"RegistrarSet","inputs":[{"name":"registrar","type":"address","indexed":true,"internalType":"address"},{"name":"allowed","type":"bool","indexed":false,"internalType":"bool"}],"anonymous":false},{"type":"error","name":"InvalidAuthor","inputs":[{"name":"received","type":"address","internalType":"address"},{"name":"expected","type":"address","internalType":"address"}]},{"type":"error","name":"InvalidForwarderAddress","inputs":[]},{"type":"error","name":"InvalidMetadataLength","inputs":[{"name":"received","type":"uint256","internalType":"uint256"},{"name":"expected","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"InvalidSender","inputs":[{"name":"sender","type":"address","internalType":"address"},{"name":"expected","type":"address","internalType":"address"}]},{"type":"error","name":"InvalidWindow","inputs":[{"name":"checkedAt","type":"uint64","internalType":"uint64"},{"name":"validUntil","type":"uint64","internalType":"uint64"}]},{"type":"error","name":"InvalidWorkflowId","inputs":[{"name":"received","type":"bytes32","internalType":"bytes32"},{"name":"expected","type":"bytes32","internalType":"bytes32"}]},{"type":"error","name":"InvalidWorkflowName","inputs":[{"name":"received","type":"bytes10","internalType":"bytes10"},{"name":"expected","type":"bytes10","internalType":"bytes10"}]},{"type":"error","name":"LeiMismatch","inputs":[{"name":"entityId","type":"bytes32","internalType":"bytes32"}]},{"type":"error","name":"NotRegistrar","inputs":[{"name":"caller","type":"address","internalType":"address"}]},{"type":"error","name":"OwnableInvalidOwner","inputs":[{"name":"owner","type":"address","internalType":"address"}]},{"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"}]},{"type":"error","name":"StaleReport","inputs":[{"name":"entityId","type":"bytes32","internalType":"bytes32"},{"name":"checkedAt","type":"uint64","internalType":"uint64"},{"name":"latestCheckedAt","type":"uint64","internalType":"uint64"}]},{"type":"error","name":"UnknownEntity","inputs":[{"name":"entityId","type":"bytes32","internalType":"bytes32"}]},{"type":"error","name":"WorkflowNameRequiresAuthorValidation","inputs":[]}] as const

export class StatusRegistry {
  constructor(
    private readonly client: EVMClient,
    public readonly address: Address,
  ) {}

  eVENTCOUNT(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'EVENT_COUNT' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'EVENT_COUNT' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  eVCHINSOLVENCYHISTORY(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'EV_CH_INSOLVENCY_HISTORY' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'EV_CH_INSOLVENCY_HISTORY' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  eVCHSTATUSADVERSE(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'EV_CH_STATUS_ADVERSE' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'EV_CH_STATUS_ADVERSE' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  eVGLEIFLEILAPSED(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'EV_GLEIF_LEI_LAPSED' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'EV_GLEIF_LEI_LAPSED' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  eVGZINSOLVENCYPROCEEDING(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'EV_GZ_INSOLVENCY_PROCEEDING' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'EV_GZ_INSOLVENCY_PROCEEDING' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  eVGZPETITIONDISMISSED(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'EV_GZ_PETITION_DISMISSED' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'EV_GZ_PETITION_DISMISSED' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  eVGZPETITIONPENDING(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'EV_GZ_PETITION_PENDING' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'EV_GZ_PETITION_PENDING' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  eVSOURCECONFLICT(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'EV_SOURCE_CONFLICT' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'EV_SOURCE_CONFLICT' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  mAXCLOCKSKEW(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'MAX_CLOCK_SKEW' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'MAX_CLOCK_SKEW' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  mAXVALIDITY(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'MAX_VALIDITY' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'MAX_VALIDITY' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  sRCCOMPANIESHOUSE(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'SRC_COMPANIES_HOUSE' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'SRC_COMPANIES_HOUSE' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  sRCGAZETTE(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'SRC_GAZETTE' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'SRC_GAZETTE' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  sRCGLEIF(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'SRC_GLEIF' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'SRC_GLEIF' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  attestationCount(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'attestationCount' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'attestationCount' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  entityIdFor(
    runtime: Runtime<unknown>,
    companyNumber: string,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'entityIdFor' as const,
      args: [companyNumber],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'entityIdFor' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  getEntity(
    runtime: Runtime<unknown>,
    entityId: `0x${string}`,
  ): { companyNumber: string; lei: string; monitored: boolean } {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'getEntity' as const,
      args: [entityId],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'getEntity' as const,
      data: bytesToHex(result.data),
    }) as { companyNumber: string; lei: string; monitored: boolean }
  }

  getExpectedAuthor(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'getExpectedAuthor' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'getExpectedAuthor' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  getExpectedWorkflowId(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'getExpectedWorkflowId' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'getExpectedWorkflowId' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  getExpectedWorkflowName(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'getExpectedWorkflowName' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'getExpectedWorkflowName' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  getFirstSeen(
    runtime: Runtime<unknown>,
    entityId: `0x${string}`,
  ): readonly bigint[] {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'getFirstSeen' as const,
      args: [entityId],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'getFirstSeen' as const,
      data: bytesToHex(result.data),
    }) as readonly bigint[]
  }

  getForwarderAddress(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'getForwarderAddress' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'getForwarderAddress' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  getLatest(
    runtime: Runtime<unknown>,
    entityId: `0x${string}`,
  ): { id: bigint; checkedAt: bigint; validUntil: bigint; eventBits: number; unavailableBits: number; activeBits: number; chUpdatedAt: bigint; gazetteUpdatedAt: bigint; gleifUpdatedAt: bigint; petitionPresentedAt: bigint; petitionPublishedAt: bigint; petitionCaseRef: `0x${string}`; evidenceHash: `0x${string}`; requestId: `0x${string}` } {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'getLatest' as const,
      args: [entityId],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'getLatest' as const,
      data: bytesToHex(result.data),
    }) as { id: bigint; checkedAt: bigint; validUntil: bigint; eventBits: number; unavailableBits: number; activeBits: number; chUpdatedAt: bigint; gazetteUpdatedAt: bigint; gleifUpdatedAt: bigint; petitionPresentedAt: bigint; petitionPublishedAt: bigint; petitionCaseRef: `0x${string}`; evidenceHash: `0x${string}`; requestId: `0x${string}` }
  }

  getMonitored(
    runtime: Runtime<unknown>,
  ): readonly [readonly `0x${string}`[], readonly string[], readonly string[]] {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'getMonitored' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'getMonitored' as const,
      data: bytesToHex(result.data),
    }) as readonly [readonly `0x${string}`[], readonly string[], readonly string[]]
  }

  isRegistrar(
    runtime: Runtime<unknown>,
    arg0: `0x${string}`,
  ): boolean {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'isRegistrar' as const,
      args: [arg0],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'isRegistrar' as const,
      data: bytesToHex(result.data),
    }) as boolean
  }

  owner(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'owner' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'owner' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  sourceOf(
    runtime: Runtime<unknown>,
    eventBit: number,
  ): number {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'sourceOf' as const,
      args: [eventBit],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'sourceOf' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  supportsInterface(
    runtime: Runtime<unknown>,
    interfaceId: `0x${string}`,
  ): boolean {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'supportsInterface' as const,
      args: [interfaceId],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: StatusRegistryABI,
      functionName: 'supportsInterface' as const,
      data: bytesToHex(result.data),
    }) as boolean
  }

  writeReportFromOnReport(
    runtime: Runtime<unknown>,
    metadata: `0x${string}`,
    report: `0x${string}`,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'onReport' as const,
      args: [metadata, report],
    })

    const reportResponse = runtime
      .report(prepareReportRequest(callData))
      .result()

    return this.client
      .writeReport(runtime, {
        receiver: this.address,
        report: reportResponse,
        gasConfig,
      })
      .result()
  }

  writeReportFromRegisterEntity(
    runtime: Runtime<unknown>,
    companyNumber: string,
    lei: string,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'registerEntity' as const,
      args: [companyNumber, lei],
    })

    const reportResponse = runtime
      .report(prepareReportRequest(callData))
      .result()

    return this.client
      .writeReport(runtime, {
        receiver: this.address,
        report: reportResponse,
        gasConfig,
      })
      .result()
  }

  writeReportFromSetExpectedAuthor(
    runtime: Runtime<unknown>,
    author: `0x${string}`,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'setExpectedAuthor' as const,
      args: [author],
    })

    const reportResponse = runtime
      .report(prepareReportRequest(callData))
      .result()

    return this.client
      .writeReport(runtime, {
        receiver: this.address,
        report: reportResponse,
        gasConfig,
      })
      .result()
  }

  writeReportFromSetExpectedWorkflowId(
    runtime: Runtime<unknown>,
    id: `0x${string}`,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'setExpectedWorkflowId' as const,
      args: [id],
    })

    const reportResponse = runtime
      .report(prepareReportRequest(callData))
      .result()

    return this.client
      .writeReport(runtime, {
        receiver: this.address,
        report: reportResponse,
        gasConfig,
      })
      .result()
  }

  writeReportFromSetExpectedWorkflowName(
    runtime: Runtime<unknown>,
    name: string,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'setExpectedWorkflowName' as const,
      args: [name],
    })

    const reportResponse = runtime
      .report(prepareReportRequest(callData))
      .result()

    return this.client
      .writeReport(runtime, {
        receiver: this.address,
        report: reportResponse,
        gasConfig,
      })
      .result()
  }

  writeReportFromSetForwarderAddress(
    runtime: Runtime<unknown>,
    forwarder: `0x${string}`,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'setForwarderAddress' as const,
      args: [forwarder],
    })

    const reportResponse = runtime
      .report(prepareReportRequest(callData))
      .result()

    return this.client
      .writeReport(runtime, {
        receiver: this.address,
        report: reportResponse,
        gasConfig,
      })
      .result()
  }

  writeReportFromSetRegistrar(
    runtime: Runtime<unknown>,
    registrar: `0x${string}`,
    allowed: boolean,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'setRegistrar' as const,
      args: [registrar, allowed],
    })

    const reportResponse = runtime
      .report(prepareReportRequest(callData))
      .result()

    return this.client
      .writeReport(runtime, {
        receiver: this.address,
        report: reportResponse,
        gasConfig,
      })
      .result()
  }

  writeReportFromTransferOwnership(
    runtime: Runtime<unknown>,
    newOwner: `0x${string}`,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: StatusRegistryABI,
      functionName: 'transferOwnership' as const,
      args: [newOwner],
    })

    const reportResponse = runtime
      .report(prepareReportRequest(callData))
      .result()

    return this.client
      .writeReport(runtime, {
        receiver: this.address,
        report: reportResponse,
        gasConfig,
      })
      .result()
  }

  writeReport(
    runtime: Runtime<unknown>,
    callData: Hex,
    gasConfig?: { gasLimit?: string },
  ) {
    const reportResponse = runtime
      .report(prepareReportRequest(callData))
      .result()

    return this.client
      .writeReport(runtime, {
        receiver: this.address,
        report: reportResponse,
        gasConfig,
      })
      .result()
  }

  /**
   * Creates a log trigger for AttestationRecorded events.
   * The returned trigger's adapt method decodes the raw log into AttestationRecordedDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerAttestationRecorded(
    filters?: AttestationRecordedTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'AttestationRecorded' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        entityId: f.entityId,
        attestationId: f.attestationId,
        requestId: f.requestId,
      }
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'AttestationRecorded' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          entityId: f.entityId,
          attestationId: f.attestationId,
          requestId: f.requestId,
        }
        return encodeEventTopics({
          abi: StatusRegistryABI,
          eventName: 'AttestationRecorded' as const,
          args,
        })
      })
      topics = allEncoded[0].map((_, i) => ({
        values: [...new Set(allEncoded.flatMap((row) => encodeTopicValue(row[i])))],
      }))
    }
    const baseTrigger = this.client.logTrigger({
      addresses: [hexToBase64(this.address)],
      topics,
    })
    const contract = this
    return {
      capabilityId: () => baseTrigger.capabilityId(),
      method: () => baseTrigger.method(),
      outputSchema: () => baseTrigger.outputSchema(),
      configAsAny: () => baseTrigger.configAsAny(),
      adapt: (rawOutput: EVMLog): DecodedLog<AttestationRecordedDecoded> => contract.decodeAttestationRecorded(rawOutput),
    }
  }

  /**
   * Decodes a log into AttestationRecorded data, preserving all log metadata.
   */
  decodeAttestationRecorded(log: EVMLog): DecodedLog<AttestationRecordedDecoded> {
    const decoded = decodeEventLog({
      abi: StatusRegistryABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as AttestationRecordedDecoded }
  }

  /**
   * Creates a log trigger for EntityRegistered events.
   * The returned trigger's adapt method decodes the raw log into EntityRegisteredDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerEntityRegistered(
    filters?: EntityRegisteredTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'EntityRegistered' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        entityId: f.entityId,
      }
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'EntityRegistered' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          entityId: f.entityId,
        }
        return encodeEventTopics({
          abi: StatusRegistryABI,
          eventName: 'EntityRegistered' as const,
          args,
        })
      })
      topics = allEncoded[0].map((_, i) => ({
        values: [...new Set(allEncoded.flatMap((row) => encodeTopicValue(row[i])))],
      }))
    }
    const baseTrigger = this.client.logTrigger({
      addresses: [hexToBase64(this.address)],
      topics,
    })
    const contract = this
    return {
      capabilityId: () => baseTrigger.capabilityId(),
      method: () => baseTrigger.method(),
      outputSchema: () => baseTrigger.outputSchema(),
      configAsAny: () => baseTrigger.configAsAny(),
      adapt: (rawOutput: EVMLog): DecodedLog<EntityRegisteredDecoded> => contract.decodeEntityRegistered(rawOutput),
    }
  }

  /**
   * Decodes a log into EntityRegistered data, preserving all log metadata.
   */
  decodeEntityRegistered(log: EVMLog): DecodedLog<EntityRegisteredDecoded> {
    const decoded = decodeEventLog({
      abi: StatusRegistryABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as EntityRegisteredDecoded }
  }

  /**
   * Creates a log trigger for ExpectedAuthorUpdated events.
   * The returned trigger's adapt method decodes the raw log into ExpectedAuthorUpdatedDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerExpectedAuthorUpdated(
    filters?: ExpectedAuthorUpdatedTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'ExpectedAuthorUpdated' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        previousAuthor: f.previousAuthor,
        newAuthor: f.newAuthor,
      }
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'ExpectedAuthorUpdated' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          previousAuthor: f.previousAuthor,
          newAuthor: f.newAuthor,
        }
        return encodeEventTopics({
          abi: StatusRegistryABI,
          eventName: 'ExpectedAuthorUpdated' as const,
          args,
        })
      })
      topics = allEncoded[0].map((_, i) => ({
        values: [...new Set(allEncoded.flatMap((row) => encodeTopicValue(row[i])))],
      }))
    }
    const baseTrigger = this.client.logTrigger({
      addresses: [hexToBase64(this.address)],
      topics,
    })
    const contract = this
    return {
      capabilityId: () => baseTrigger.capabilityId(),
      method: () => baseTrigger.method(),
      outputSchema: () => baseTrigger.outputSchema(),
      configAsAny: () => baseTrigger.configAsAny(),
      adapt: (rawOutput: EVMLog): DecodedLog<ExpectedAuthorUpdatedDecoded> => contract.decodeExpectedAuthorUpdated(rawOutput),
    }
  }

  /**
   * Decodes a log into ExpectedAuthorUpdated data, preserving all log metadata.
   */
  decodeExpectedAuthorUpdated(log: EVMLog): DecodedLog<ExpectedAuthorUpdatedDecoded> {
    const decoded = decodeEventLog({
      abi: StatusRegistryABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as ExpectedAuthorUpdatedDecoded }
  }

  /**
   * Creates a log trigger for ExpectedWorkflowIdUpdated events.
   * The returned trigger's adapt method decodes the raw log into ExpectedWorkflowIdUpdatedDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerExpectedWorkflowIdUpdated(
    filters?: ExpectedWorkflowIdUpdatedTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'ExpectedWorkflowIdUpdated' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        previousId: f.previousId,
        newId: f.newId,
      }
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'ExpectedWorkflowIdUpdated' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          previousId: f.previousId,
          newId: f.newId,
        }
        return encodeEventTopics({
          abi: StatusRegistryABI,
          eventName: 'ExpectedWorkflowIdUpdated' as const,
          args,
        })
      })
      topics = allEncoded[0].map((_, i) => ({
        values: [...new Set(allEncoded.flatMap((row) => encodeTopicValue(row[i])))],
      }))
    }
    const baseTrigger = this.client.logTrigger({
      addresses: [hexToBase64(this.address)],
      topics,
    })
    const contract = this
    return {
      capabilityId: () => baseTrigger.capabilityId(),
      method: () => baseTrigger.method(),
      outputSchema: () => baseTrigger.outputSchema(),
      configAsAny: () => baseTrigger.configAsAny(),
      adapt: (rawOutput: EVMLog): DecodedLog<ExpectedWorkflowIdUpdatedDecoded> => contract.decodeExpectedWorkflowIdUpdated(rawOutput),
    }
  }

  /**
   * Decodes a log into ExpectedWorkflowIdUpdated data, preserving all log metadata.
   */
  decodeExpectedWorkflowIdUpdated(log: EVMLog): DecodedLog<ExpectedWorkflowIdUpdatedDecoded> {
    const decoded = decodeEventLog({
      abi: StatusRegistryABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as ExpectedWorkflowIdUpdatedDecoded }
  }

  /**
   * Creates a log trigger for ExpectedWorkflowNameUpdated events.
   * The returned trigger's adapt method decodes the raw log into ExpectedWorkflowNameUpdatedDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerExpectedWorkflowNameUpdated(
    filters?: ExpectedWorkflowNameUpdatedTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'ExpectedWorkflowNameUpdated' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        previousName: f.previousName,
        newName: f.newName,
      }
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'ExpectedWorkflowNameUpdated' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          previousName: f.previousName,
          newName: f.newName,
        }
        return encodeEventTopics({
          abi: StatusRegistryABI,
          eventName: 'ExpectedWorkflowNameUpdated' as const,
          args,
        })
      })
      topics = allEncoded[0].map((_, i) => ({
        values: [...new Set(allEncoded.flatMap((row) => encodeTopicValue(row[i])))],
      }))
    }
    const baseTrigger = this.client.logTrigger({
      addresses: [hexToBase64(this.address)],
      topics,
    })
    const contract = this
    return {
      capabilityId: () => baseTrigger.capabilityId(),
      method: () => baseTrigger.method(),
      outputSchema: () => baseTrigger.outputSchema(),
      configAsAny: () => baseTrigger.configAsAny(),
      adapt: (rawOutput: EVMLog): DecodedLog<ExpectedWorkflowNameUpdatedDecoded> => contract.decodeExpectedWorkflowNameUpdated(rawOutput),
    }
  }

  /**
   * Decodes a log into ExpectedWorkflowNameUpdated data, preserving all log metadata.
   */
  decodeExpectedWorkflowNameUpdated(log: EVMLog): DecodedLog<ExpectedWorkflowNameUpdatedDecoded> {
    const decoded = decodeEventLog({
      abi: StatusRegistryABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as ExpectedWorkflowNameUpdatedDecoded }
  }

  /**
   * Creates a log trigger for ForwarderAddressUpdated events.
   * The returned trigger's adapt method decodes the raw log into ForwarderAddressUpdatedDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerForwarderAddressUpdated(
    filters?: ForwarderAddressUpdatedTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'ForwarderAddressUpdated' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        previousForwarder: f.previousForwarder,
        newForwarder: f.newForwarder,
      }
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'ForwarderAddressUpdated' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          previousForwarder: f.previousForwarder,
          newForwarder: f.newForwarder,
        }
        return encodeEventTopics({
          abi: StatusRegistryABI,
          eventName: 'ForwarderAddressUpdated' as const,
          args,
        })
      })
      topics = allEncoded[0].map((_, i) => ({
        values: [...new Set(allEncoded.flatMap((row) => encodeTopicValue(row[i])))],
      }))
    }
    const baseTrigger = this.client.logTrigger({
      addresses: [hexToBase64(this.address)],
      topics,
    })
    const contract = this
    return {
      capabilityId: () => baseTrigger.capabilityId(),
      method: () => baseTrigger.method(),
      outputSchema: () => baseTrigger.outputSchema(),
      configAsAny: () => baseTrigger.configAsAny(),
      adapt: (rawOutput: EVMLog): DecodedLog<ForwarderAddressUpdatedDecoded> => contract.decodeForwarderAddressUpdated(rawOutput),
    }
  }

  /**
   * Decodes a log into ForwarderAddressUpdated data, preserving all log metadata.
   */
  decodeForwarderAddressUpdated(log: EVMLog): DecodedLog<ForwarderAddressUpdatedDecoded> {
    const decoded = decodeEventLog({
      abi: StatusRegistryABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as ForwarderAddressUpdatedDecoded }
  }

  /**
   * Creates a log trigger for OwnershipTransferred events.
   * The returned trigger's adapt method decodes the raw log into OwnershipTransferredDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerOwnershipTransferred(
    filters?: OwnershipTransferredTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'OwnershipTransferred' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        previousOwner: f.previousOwner,
        newOwner: f.newOwner,
      }
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'OwnershipTransferred' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          previousOwner: f.previousOwner,
          newOwner: f.newOwner,
        }
        return encodeEventTopics({
          abi: StatusRegistryABI,
          eventName: 'OwnershipTransferred' as const,
          args,
        })
      })
      topics = allEncoded[0].map((_, i) => ({
        values: [...new Set(allEncoded.flatMap((row) => encodeTopicValue(row[i])))],
      }))
    }
    const baseTrigger = this.client.logTrigger({
      addresses: [hexToBase64(this.address)],
      topics,
    })
    const contract = this
    return {
      capabilityId: () => baseTrigger.capabilityId(),
      method: () => baseTrigger.method(),
      outputSchema: () => baseTrigger.outputSchema(),
      configAsAny: () => baseTrigger.configAsAny(),
      adapt: (rawOutput: EVMLog): DecodedLog<OwnershipTransferredDecoded> => contract.decodeOwnershipTransferred(rawOutput),
    }
  }

  /**
   * Decodes a log into OwnershipTransferred data, preserving all log metadata.
   */
  decodeOwnershipTransferred(log: EVMLog): DecodedLog<OwnershipTransferredDecoded> {
    const decoded = decodeEventLog({
      abi: StatusRegistryABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as OwnershipTransferredDecoded }
  }

  /**
   * Creates a log trigger for RegistrarSet events.
   * The returned trigger's adapt method decodes the raw log into RegistrarSetDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerRegistrarSet(
    filters?: RegistrarSetTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'RegistrarSet' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        registrar: f.registrar,
      }
      const encoded = encodeEventTopics({
        abi: StatusRegistryABI,
        eventName: 'RegistrarSet' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          registrar: f.registrar,
        }
        return encodeEventTopics({
          abi: StatusRegistryABI,
          eventName: 'RegistrarSet' as const,
          args,
        })
      })
      topics = allEncoded[0].map((_, i) => ({
        values: [...new Set(allEncoded.flatMap((row) => encodeTopicValue(row[i])))],
      }))
    }
    const baseTrigger = this.client.logTrigger({
      addresses: [hexToBase64(this.address)],
      topics,
    })
    const contract = this
    return {
      capabilityId: () => baseTrigger.capabilityId(),
      method: () => baseTrigger.method(),
      outputSchema: () => baseTrigger.outputSchema(),
      configAsAny: () => baseTrigger.configAsAny(),
      adapt: (rawOutput: EVMLog): DecodedLog<RegistrarSetDecoded> => contract.decodeRegistrarSet(rawOutput),
    }
  }

  /**
   * Decodes a log into RegistrarSet data, preserving all log metadata.
   */
  decodeRegistrarSet(log: EVMLog): DecodedLog<RegistrarSetDecoded> {
    const decoded = decodeEventLog({
      abi: StatusRegistryABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as RegistrarSetDecoded }
  }
}

