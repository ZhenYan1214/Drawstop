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
 * Filter params for Acknowledged. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type AcknowledgedTopics = {
  by?: `0x${string}`
  attestationId?: bigint
}

/**
 * Decoded Acknowledged event data.
 */
export type AcknowledgedDecoded = {
  by: `0x${string}`
  attestationId: bigint
  noteHash: `0x${string}`
}


/**
 * Filter params for Bound. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type BoundTopics = {
  borrower?: `0x${string}`
  entityId?: `0x${string}`
}

/**
 * Decoded Bound event data.
 */
export type BoundDecoded = {
  borrower: `0x${string}`
  entityId: `0x${string}`
  companyNumber: string
  lei: string
  nonce: bigint
}


/**
 * Filter params for DefaultDeclared. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type DefaultDeclaredTopics = {
  lender?: `0x${string}`
}

/**
 * Decoded DefaultDeclared event data.
 */
export type DefaultDeclaredDecoded = {
  lender: `0x${string}`
  attestationId: bigint
  at: bigint
}


/**
 * Filter params for DrawdownExecuted. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type DrawdownExecutedTopics = {
  drawdownId?: bigint
}

/**
 * Decoded DrawdownExecuted event data.
 */
export type DrawdownExecutedDecoded = {
  drawdownId: bigint
  attestationId: bigint
  amount: bigint
}


/**
 * Filter params for DrawdownRequested. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type DrawdownRequestedTopics = {
  drawdownId?: bigint
  requestId?: `0x${string}`
  entityId?: `0x${string}`
}

/**
 * Decoded DrawdownRequested event data.
 */
export type DrawdownRequestedDecoded = {
  drawdownId: bigint
  requestId: `0x${string}`
  entityId: `0x${string}`
  companyNumber: string
  lei: string
  amount: bigint
}


/**
 * Filter params for Repaid. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type RepaidTopics = {
  repaymentId?: bigint
}

/**
 * Decoded Repaid event data.
 */
export type RepaidDecoded = {
  repaymentId: bigint
  amount: bigint
  heldInSuspense: boolean
  status: number
}


/**
 * Filter params for ReviewRecorded. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type ReviewRecordedTopics = {
  reviewId?: bigint
  reviewer?: `0x${string}`
}

/**
 * Decoded ReviewRecorded event data.
 */
export type ReviewRecordedDecoded = {
  reviewId: bigint
  reviewer: `0x${string}`
  coveredBits: number
  attestationId: bigint
  reasonHash: `0x${string}`
  expiresAt: bigint
}


/**
 * Filter params for SuspenseReleased. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type SuspenseReleasedTopics = {
  to?: `0x${string}`
}

/**
 * Decoded SuspenseReleased event data.
 */
export type SuspenseReleasedDecoded = {
  to: `0x${string}`
  amount: bigint
  reasonHash: `0x${string}`
  by: `0x${string}`
}


export const LoanFacilityABI = [{"type":"constructor","inputs":[{"name":"registry_","type":"address","internalType":"contractStatusRegistry"},{"name":"token_","type":"address","internalType":"contractIERC20Minimal"},{"name":"lender_","type":"address","internalType":"address"},{"name":"borrower_","type":"address","internalType":"address"},{"name":"arbiter_","type":"address","internalType":"address"},{"name":"companyNumber_","type":"string","internalType":"string"},{"name":"lei_","type":"string","internalType":"string"},{"name":"petitionGracePeriod_","type":"uint64","internalType":"uint64"},{"name":"clockAnchor_","type":"uint8","internalType":"enumLoanFacility.ClockAnchor"}],"stateMutability":"nonpayable"},{"type":"function","name":"BINDING_TYPEHASH","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"HARD_MASK","inputs":[],"outputs":[{"name":"","type":"uint32","internalType":"uint32"}],"stateMutability":"view"},{"type":"function","name":"PETITION_MASK","inputs":[],"outputs":[{"name":"","type":"uint32","internalType":"uint32"}],"stateMutability":"view"},{"type":"function","name":"REQUIRED_SOURCES","inputs":[],"outputs":[{"name":"","type":"uint32","internalType":"uint32"}],"stateMutability":"view"},{"type":"function","name":"WATCH_MASK","inputs":[],"outputs":[{"name":"","type":"uint32","internalType":"uint32"}],"stateMutability":"view"},{"type":"function","name":"acknowledge","inputs":[{"name":"attestationId","type":"uint256","internalType":"uint256"},{"name":"noteHash","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"arbiter","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"bind","inputs":[{"name":"nonce","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"borrowerSignature","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"bindingDigest","inputs":[{"name":"nonce","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"bindingNonce","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"borrower","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"bound","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"clockAnchor","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"enumLoanFacility.ClockAnchor"}],"stateMutability":"view"},{"type":"function","name":"companyNumber","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"coveredBits","inputs":[{"name":"firstSeen","type":"uint64[]","internalType":"uint64[]"}],"outputs":[{"name":"covered","type":"uint32","internalType":"uint32"}],"stateMutability":"view"},{"type":"function","name":"declareDefault","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"defaulted","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"domainSeparator","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"drawdownCount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"drawdowns","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"requestedAt","type":"uint64","internalType":"uint64"},{"name":"executed","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"entityId","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"executeDrawdown","inputs":[{"name":"drawdownId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"graceStart","inputs":[{"name":"a","type":"tuple","internalType":"structStatusRegistry.Attestation","components":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"checkedAt","type":"uint64","internalType":"uint64"},{"name":"validUntil","type":"uint64","internalType":"uint64"},{"name":"eventBits","type":"uint32","internalType":"uint32"},{"name":"unavailableBits","type":"uint32","internalType":"uint32"},{"name":"activeBits","type":"uint32","internalType":"uint32"},{"name":"chUpdatedAt","type":"uint64","internalType":"uint64"},{"name":"gazetteUpdatedAt","type":"uint64","internalType":"uint64"},{"name":"gleifUpdatedAt","type":"uint64","internalType":"uint64"},{"name":"petitionPresentedAt","type":"uint64","internalType":"uint64"},{"name":"petitionPublishedAt","type":"uint64","internalType":"uint64"},{"name":"petitionCaseRef","type":"bytes32","internalType":"bytes32"},{"name":"evidenceHash","type":"bytes32","internalType":"bytes32"},{"name":"requestId","type":"bytes32","internalType":"bytes32"}]},{"name":"firstSeen","type":"uint64[]","internalType":"uint64[]"}],"outputs":[{"name":"","type":"uint64","internalType":"uint64"}],"stateMutability":"view"},{"type":"function","name":"lei","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"lender","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"petitionGracePeriod","inputs":[],"outputs":[{"name":"","type":"uint64","internalType":"uint64"}],"stateMutability":"view"},{"type":"function","name":"recordReview","inputs":[{"name":"coveredBits","type":"uint32","internalType":"uint32"},{"name":"attestationId","type":"uint256","internalType":"uint256"},{"name":"reasonHash","type":"bytes32","internalType":"bytes32"},{"name":"expiresAt","type":"uint64","internalType":"uint64"}],"outputs":[{"name":"reviewId","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"registry","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contractStatusRegistry"}],"stateMutability":"view"},{"type":"function","name":"releaseSuspense","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"repaidSincePetitionPresented","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"repaidToLenderSince","inputs":[{"name":"since","type":"uint64","internalType":"uint64"}],"outputs":[{"name":"total","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"repay","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"repaymentId","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"repaymentCount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"repayments","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"at","type":"uint64","internalType":"uint64"},{"name":"heldInSuspense","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"requestDrawdown","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"drawdownId","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"requestId","inputs":[{"name":"drawdownId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"resolveSuspense","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"reasonHash","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"reviewCount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"reviews","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"reviewer","type":"address","internalType":"address"},{"name":"coveredBits","type":"uint32","internalType":"uint32"},{"name":"attestationId","type":"uint256","internalType":"uint256"},{"name":"reasonHash","type":"bytes32","internalType":"bytes32"},{"name":"createdAt","type":"uint64","internalType":"uint64"},{"name":"expiresAt","type":"uint64","internalType":"uint64"}],"stateMutability":"view"},{"type":"function","name":"status","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"enumLoanFacility.Status"}],"stateMutability":"view"},{"type":"function","name":"suspenseBalance","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"token","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contractIERC20Minimal"}],"stateMutability":"view"},{"type":"event","name":"Acknowledged","inputs":[{"name":"by","type":"address","indexed":true,"internalType":"address"},{"name":"attestationId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"noteHash","type":"bytes32","indexed":false,"internalType":"bytes32"}],"anonymous":false},{"type":"event","name":"Bound","inputs":[{"name":"borrower","type":"address","indexed":true,"internalType":"address"},{"name":"entityId","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"companyNumber","type":"string","indexed":false,"internalType":"string"},{"name":"lei","type":"string","indexed":false,"internalType":"string"},{"name":"nonce","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"DefaultDeclared","inputs":[{"name":"lender","type":"address","indexed":true,"internalType":"address"},{"name":"attestationId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"at","type":"uint64","indexed":false,"internalType":"uint64"}],"anonymous":false},{"type":"event","name":"DrawdownExecuted","inputs":[{"name":"drawdownId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"attestationId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"DrawdownRequested","inputs":[{"name":"drawdownId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"requestId","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"entityId","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"companyNumber","type":"string","indexed":false,"internalType":"string"},{"name":"lei","type":"string","indexed":false,"internalType":"string"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Repaid","inputs":[{"name":"repaymentId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"heldInSuspense","type":"bool","indexed":false,"internalType":"bool"},{"name":"status","type":"uint8","indexed":false,"internalType":"enumLoanFacility.Status"}],"anonymous":false},{"type":"event","name":"ReviewRecorded","inputs":[{"name":"reviewId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"reviewer","type":"address","indexed":true,"internalType":"address"},{"name":"coveredBits","type":"uint32","indexed":false,"internalType":"uint32"},{"name":"attestationId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"reasonHash","type":"bytes32","indexed":false,"internalType":"bytes32"},{"name":"expiresAt","type":"uint64","indexed":false,"internalType":"uint64"}],"anonymous":false},{"type":"event","name":"SuspenseReleased","inputs":[{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"reasonHash","type":"bytes32","indexed":false,"internalType":"bytes32"},{"name":"by","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"error","name":"AlreadyBound","inputs":[]},{"type":"error","name":"AlreadyExecuted","inputs":[{"name":"drawdownId","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"AttestationNotFresh","inputs":[{"name":"checkedAt","type":"uint64","internalType":"uint64"},{"name":"requestedAt","type":"uint64","internalType":"uint64"}]},{"type":"error","name":"BadNonce","inputs":[{"name":"expected","type":"uint256","internalType":"uint256"},{"name":"got","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"BadSignature","inputs":[]},{"type":"error","name":"BindingExpired","inputs":[]},{"type":"error","name":"DefaultNotAllowed","inputs":[{"name":"status","type":"uint8","internalType":"enumLoanFacility.Status"}]},{"type":"error","name":"DrawdownsBlocked","inputs":[{"name":"status","type":"uint8","internalType":"enumLoanFacility.Status"}]},{"type":"error","name":"InvalidReview","inputs":[]},{"type":"error","name":"NoSuchDrawdown","inputs":[{"name":"drawdownId","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"NotBound","inputs":[]},{"type":"error","name":"NothingInSuspense","inputs":[]},{"type":"error","name":"OnlyArbiter","inputs":[]},{"type":"error","name":"OnlyBorrower","inputs":[]},{"type":"error","name":"OnlyLender","inputs":[]},{"type":"error","name":"OnlyParty","inputs":[]},{"type":"error","name":"SuspenseNotReleasable","inputs":[{"name":"status","type":"uint8","internalType":"enumLoanFacility.Status"}]},{"type":"error","name":"TransferFailed","inputs":[]}] as const

export class LoanFacility {
  constructor(
    private readonly client: EVMClient,
    public readonly address: Address,
  ) {}

  bINDINGTYPEHASH(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'BINDING_TYPEHASH' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'BINDING_TYPEHASH' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  hARDMASK(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'HARD_MASK' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'HARD_MASK' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  pETITIONMASK(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'PETITION_MASK' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'PETITION_MASK' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  rEQUIREDSOURCES(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'REQUIRED_SOURCES' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'REQUIRED_SOURCES' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  wATCHMASK(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'WATCH_MASK' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'WATCH_MASK' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  arbiter(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'arbiter' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'arbiter' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  bindingDigest(
    runtime: Runtime<unknown>,
    nonce: bigint,
    deadline: bigint,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'bindingDigest' as const,
      args: [nonce, deadline],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'bindingDigest' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  bindingNonce(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'bindingNonce' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'bindingNonce' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  borrower(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'borrower' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'borrower' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  bound(
    runtime: Runtime<unknown>,
  ): boolean {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'bound' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'bound' as const,
      data: bytesToHex(result.data),
    }) as boolean
  }

  clockAnchor(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'clockAnchor' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'clockAnchor' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  companyNumber(
    runtime: Runtime<unknown>,
  ): string {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'companyNumber' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'companyNumber' as const,
      data: bytesToHex(result.data),
    }) as string
  }

  coveredBits(
    runtime: Runtime<unknown>,
    firstSeen: readonly bigint[],
  ): number {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'coveredBits' as const,
      args: [firstSeen],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'coveredBits' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  defaulted(
    runtime: Runtime<unknown>,
  ): boolean {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'defaulted' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'defaulted' as const,
      data: bytesToHex(result.data),
    }) as boolean
  }

  domainSeparator(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'domainSeparator' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'domainSeparator' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  drawdownCount(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'drawdownCount' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'drawdownCount' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  drawdowns(
    runtime: Runtime<unknown>,
    arg0: bigint,
  ): readonly [bigint, bigint, boolean] {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'drawdowns' as const,
      args: [arg0],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'drawdowns' as const,
      data: bytesToHex(result.data),
    }) as readonly [bigint, bigint, boolean]
  }

  entityId(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'entityId' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'entityId' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  graceStart(
    runtime: Runtime<unknown>,
    a: { id: bigint; checkedAt: bigint; validUntil: bigint; eventBits: number; unavailableBits: number; activeBits: number; chUpdatedAt: bigint; gazetteUpdatedAt: bigint; gleifUpdatedAt: bigint; petitionPresentedAt: bigint; petitionPublishedAt: bigint; petitionCaseRef: `0x${string}`; evidenceHash: `0x${string}`; requestId: `0x${string}` },
    firstSeen: readonly bigint[],
  ): bigint {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'graceStart' as const,
      args: [a, firstSeen],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'graceStart' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  lei(
    runtime: Runtime<unknown>,
  ): string {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'lei' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'lei' as const,
      data: bytesToHex(result.data),
    }) as string
  }

  lender(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'lender' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'lender' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  petitionGracePeriod(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'petitionGracePeriod' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'petitionGracePeriod' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  registry(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'registry' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'registry' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  repaidSincePetitionPresented(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'repaidSincePetitionPresented' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'repaidSincePetitionPresented' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  repaidToLenderSince(
    runtime: Runtime<unknown>,
    since: bigint,
  ): bigint {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'repaidToLenderSince' as const,
      args: [since],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'repaidToLenderSince' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  repaymentCount(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'repaymentCount' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'repaymentCount' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  repayments(
    runtime: Runtime<unknown>,
    arg0: bigint,
  ): readonly [bigint, bigint, boolean] {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'repayments' as const,
      args: [arg0],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'repayments' as const,
      data: bytesToHex(result.data),
    }) as readonly [bigint, bigint, boolean]
  }

  requestId(
    runtime: Runtime<unknown>,
    drawdownId: bigint,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'requestId' as const,
      args: [drawdownId],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'requestId' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  reviewCount(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'reviewCount' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'reviewCount' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  reviews(
    runtime: Runtime<unknown>,
    arg0: bigint,
  ): readonly [`0x${string}`, number, bigint, `0x${string}`, bigint, bigint] {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'reviews' as const,
      args: [arg0],
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'reviews' as const,
      data: bytesToHex(result.data),
    }) as readonly [`0x${string}`, number, bigint, `0x${string}`, bigint, bigint]
  }

  status(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'status' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'status' as const,
      data: bytesToHex(result.data),
    }) as number
  }

  suspenseBalance(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'suspenseBalance' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'suspenseBalance' as const,
      data: bytesToHex(result.data),
    }) as bigint
  }

  token(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'token' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'token' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  writeReportFromAcknowledge(
    runtime: Runtime<unknown>,
    attestationId: bigint,
    noteHash: `0x${string}`,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'acknowledge' as const,
      args: [attestationId, noteHash],
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

  writeReportFromBind(
    runtime: Runtime<unknown>,
    nonce: bigint,
    deadline: bigint,
    borrowerSignature: `0x${string}`,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'bind' as const,
      args: [nonce, deadline, borrowerSignature],
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

  writeReportFromExecuteDrawdown(
    runtime: Runtime<unknown>,
    drawdownId: bigint,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'executeDrawdown' as const,
      args: [drawdownId],
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

  writeReportFromRecordReview(
    runtime: Runtime<unknown>,
    coveredBits: number,
    attestationId: bigint,
    reasonHash: `0x${string}`,
    expiresAt: bigint,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'recordReview' as const,
      args: [coveredBits, attestationId, reasonHash, expiresAt],
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

  writeReportFromRepay(
    runtime: Runtime<unknown>,
    amount: bigint,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'repay' as const,
      args: [amount],
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

  writeReportFromRequestDrawdown(
    runtime: Runtime<unknown>,
    amount: bigint,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'requestDrawdown' as const,
      args: [amount],
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

  writeReportFromResolveSuspense(
    runtime: Runtime<unknown>,
    to: `0x${string}`,
    reasonHash: `0x${string}`,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'resolveSuspense' as const,
      args: [to, reasonHash],
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
   * Creates a log trigger for Acknowledged events.
   * The returned trigger's adapt method decodes the raw log into AcknowledgedDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerAcknowledged(
    filters?: AcknowledgedTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'Acknowledged' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        by: f.by,
        attestationId: f.attestationId,
      }
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'Acknowledged' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          by: f.by,
          attestationId: f.attestationId,
        }
        return encodeEventTopics({
          abi: LoanFacilityABI,
          eventName: 'Acknowledged' as const,
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
      adapt: (rawOutput: EVMLog): DecodedLog<AcknowledgedDecoded> => contract.decodeAcknowledged(rawOutput),
    }
  }

  /**
   * Decodes a log into Acknowledged data, preserving all log metadata.
   */
  decodeAcknowledged(log: EVMLog): DecodedLog<AcknowledgedDecoded> {
    const decoded = decodeEventLog({
      abi: LoanFacilityABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as AcknowledgedDecoded }
  }

  /**
   * Creates a log trigger for Bound events.
   * The returned trigger's adapt method decodes the raw log into BoundDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerBound(
    filters?: BoundTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'Bound' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        borrower: f.borrower,
        entityId: f.entityId,
      }
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'Bound' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          borrower: f.borrower,
          entityId: f.entityId,
        }
        return encodeEventTopics({
          abi: LoanFacilityABI,
          eventName: 'Bound' as const,
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
      adapt: (rawOutput: EVMLog): DecodedLog<BoundDecoded> => contract.decodeBound(rawOutput),
    }
  }

  /**
   * Decodes a log into Bound data, preserving all log metadata.
   */
  decodeBound(log: EVMLog): DecodedLog<BoundDecoded> {
    const decoded = decodeEventLog({
      abi: LoanFacilityABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as BoundDecoded }
  }

  /**
   * Creates a log trigger for DefaultDeclared events.
   * The returned trigger's adapt method decodes the raw log into DefaultDeclaredDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerDefaultDeclared(
    filters?: DefaultDeclaredTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'DefaultDeclared' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        lender: f.lender,
      }
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'DefaultDeclared' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          lender: f.lender,
        }
        return encodeEventTopics({
          abi: LoanFacilityABI,
          eventName: 'DefaultDeclared' as const,
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
      adapt: (rawOutput: EVMLog): DecodedLog<DefaultDeclaredDecoded> => contract.decodeDefaultDeclared(rawOutput),
    }
  }

  /**
   * Decodes a log into DefaultDeclared data, preserving all log metadata.
   */
  decodeDefaultDeclared(log: EVMLog): DecodedLog<DefaultDeclaredDecoded> {
    const decoded = decodeEventLog({
      abi: LoanFacilityABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as DefaultDeclaredDecoded }
  }

  /**
   * Creates a log trigger for DrawdownExecuted events.
   * The returned trigger's adapt method decodes the raw log into DrawdownExecutedDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerDrawdownExecuted(
    filters?: DrawdownExecutedTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'DrawdownExecuted' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        drawdownId: f.drawdownId,
      }
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'DrawdownExecuted' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          drawdownId: f.drawdownId,
        }
        return encodeEventTopics({
          abi: LoanFacilityABI,
          eventName: 'DrawdownExecuted' as const,
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
      adapt: (rawOutput: EVMLog): DecodedLog<DrawdownExecutedDecoded> => contract.decodeDrawdownExecuted(rawOutput),
    }
  }

  /**
   * Decodes a log into DrawdownExecuted data, preserving all log metadata.
   */
  decodeDrawdownExecuted(log: EVMLog): DecodedLog<DrawdownExecutedDecoded> {
    const decoded = decodeEventLog({
      abi: LoanFacilityABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as DrawdownExecutedDecoded }
  }

  /**
   * Creates a log trigger for DrawdownRequested events.
   * The returned trigger's adapt method decodes the raw log into DrawdownRequestedDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerDrawdownRequested(
    filters?: DrawdownRequestedTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'DrawdownRequested' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        drawdownId: f.drawdownId,
        requestId: f.requestId,
        entityId: f.entityId,
      }
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'DrawdownRequested' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          drawdownId: f.drawdownId,
          requestId: f.requestId,
          entityId: f.entityId,
        }
        return encodeEventTopics({
          abi: LoanFacilityABI,
          eventName: 'DrawdownRequested' as const,
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
      adapt: (rawOutput: EVMLog): DecodedLog<DrawdownRequestedDecoded> => contract.decodeDrawdownRequested(rawOutput),
    }
  }

  /**
   * Decodes a log into DrawdownRequested data, preserving all log metadata.
   */
  decodeDrawdownRequested(log: EVMLog): DecodedLog<DrawdownRequestedDecoded> {
    const decoded = decodeEventLog({
      abi: LoanFacilityABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as DrawdownRequestedDecoded }
  }

  /**
   * Creates a log trigger for Repaid events.
   * The returned trigger's adapt method decodes the raw log into RepaidDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerRepaid(
    filters?: RepaidTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'Repaid' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        repaymentId: f.repaymentId,
      }
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'Repaid' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          repaymentId: f.repaymentId,
        }
        return encodeEventTopics({
          abi: LoanFacilityABI,
          eventName: 'Repaid' as const,
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
      adapt: (rawOutput: EVMLog): DecodedLog<RepaidDecoded> => contract.decodeRepaid(rawOutput),
    }
  }

  /**
   * Decodes a log into Repaid data, preserving all log metadata.
   */
  decodeRepaid(log: EVMLog): DecodedLog<RepaidDecoded> {
    const decoded = decodeEventLog({
      abi: LoanFacilityABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as RepaidDecoded }
  }

  /**
   * Creates a log trigger for ReviewRecorded events.
   * The returned trigger's adapt method decodes the raw log into ReviewRecordedDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerReviewRecorded(
    filters?: ReviewRecordedTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'ReviewRecorded' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        reviewId: f.reviewId,
        reviewer: f.reviewer,
      }
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'ReviewRecorded' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          reviewId: f.reviewId,
          reviewer: f.reviewer,
        }
        return encodeEventTopics({
          abi: LoanFacilityABI,
          eventName: 'ReviewRecorded' as const,
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
      adapt: (rawOutput: EVMLog): DecodedLog<ReviewRecordedDecoded> => contract.decodeReviewRecorded(rawOutput),
    }
  }

  /**
   * Decodes a log into ReviewRecorded data, preserving all log metadata.
   */
  decodeReviewRecorded(log: EVMLog): DecodedLog<ReviewRecordedDecoded> {
    const decoded = decodeEventLog({
      abi: LoanFacilityABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as ReviewRecordedDecoded }
  }

  /**
   * Creates a log trigger for SuspenseReleased events.
   * The returned trigger's adapt method decodes the raw log into SuspenseReleasedDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerSuspenseReleased(
    filters?: SuspenseReleasedTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'SuspenseReleased' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        to: f.to,
      }
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'SuspenseReleased' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          to: f.to,
        }
        return encodeEventTopics({
          abi: LoanFacilityABI,
          eventName: 'SuspenseReleased' as const,
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
      adapt: (rawOutput: EVMLog): DecodedLog<SuspenseReleasedDecoded> => contract.decodeSuspenseReleased(rawOutput),
    }
  }

  /**
   * Decodes a log into SuspenseReleased data, preserving all log metadata.
   */
  decodeSuspenseReleased(log: EVMLog): DecodedLog<SuspenseReleasedDecoded> {
    const decoded = decodeEventLog({
      abi: LoanFacilityABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as SuspenseReleasedDecoded }
  }
}

