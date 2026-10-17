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
 * Filter params for OfficeHolderNominated. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type OfficeHolderNominatedTopics = {
  officeHolder?: `0x${string}`
}

/**
 * Decoded OfficeHolderNominated event data.
 */
export type OfficeHolderNominatedDecoded = {
  officeHolder: `0x${string}`
  effectiveAt: bigint
  evidenceHash: `0x${string}`
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


/**
 * Filter params for UndrawnCancelled. Only indexed fields can be used for filtering.
 * Indexed string/bytes must be passed as keccak256 hash (Hex).
 */
export type UndrawnCancelledTopics = {
  by?: `0x${string}`
}

/**
 * Decoded UndrawnCancelled event data.
 */
export type UndrawnCancelledDecoded = {
  by: `0x${string}`
  amount: bigint
}


export const LoanFacilityABI = [{"type":"constructor","inputs":[{"name":"registry_","type":"address","internalType":"contractStatusRegistry"},{"name":"token_","type":"address","internalType":"contractIERC20Minimal"},{"name":"lender_","type":"address","internalType":"address"},{"name":"borrower_","type":"address","internalType":"address"},{"name":"arbiter_","type":"address","internalType":"address"},{"name":"companyNumber_","type":"string","internalType":"string"},{"name":"lei_","type":"string","internalType":"string"},{"name":"petitionGracePeriod_","type":"uint64","internalType":"uint64"},{"name":"carveOutWindow_","type":"uint8","internalType":"enumLoanFacility.CarveOutWindow"}],"stateMutability":"nonpayable"},{"type":"function","name":"acknowledge","inputs":[{"name":"attestationId","type":"uint256","internalType":"uint256"},{"name":"noteHash","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"arbiter","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"bind","inputs":[{"name":"nonce","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"borrowerSignature","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"bindingDigest","inputs":[{"name":"nonce","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"borrower","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"bound","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"cancelUndrawn","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"carveOutWindow","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"enumLoanFacility.CarveOutWindow"}],"stateMutability":"view"},{"type":"function","name":"declareDefault","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"defaulted","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"drawdowns","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"requestedAt","type":"uint64","internalType":"uint64"},{"name":"executed","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"entityId","inputs":[],"outputs":[{"name":"","type":"bytes32","internalType":"bytes32"}],"stateMutability":"view"},{"type":"function","name":"executeDrawdown","inputs":[{"name":"drawdownId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"lender","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"nominateOfficeHolder","inputs":[{"name":"who","type":"address","internalType":"address"},{"name":"evidenceHash","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"officeHolder","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"officeHolderFrom","inputs":[],"outputs":[{"name":"","type":"uint64","internalType":"uint64"}],"stateMutability":"view"},{"type":"function","name":"petitionGracePeriod","inputs":[],"outputs":[{"name":"","type":"uint64","internalType":"uint64"}],"stateMutability":"view"},{"type":"function","name":"recordReview","inputs":[{"name":"coveredBits","type":"uint32","internalType":"uint32"},{"name":"attestationId","type":"uint256","internalType":"uint256"},{"name":"reasonHash","type":"bytes32","internalType":"bytes32"},{"name":"expiresAt","type":"uint64","internalType":"uint64"}],"outputs":[{"name":"reviewId","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"registry","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contractStatusRegistry"}],"stateMutability":"view"},{"type":"function","name":"releaseSuspense","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"repaidSincePetitionPresented","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"repay","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"repaymentId","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"repayments","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"at","type":"uint64","internalType":"uint64"},{"name":"heldInSuspense","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"requestDrawdown","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"drawdownId","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"resolveSuspense","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"reasonHash","type":"bytes32","internalType":"bytes32"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"reviews","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"reviewer","type":"address","internalType":"address"},{"name":"coveredBits","type":"uint32","internalType":"uint32"},{"name":"attestationId","type":"uint256","internalType":"uint256"},{"name":"reasonHash","type":"bytes32","internalType":"bytes32"},{"name":"asOf","type":"uint64","internalType":"uint64"},{"name":"expiresAt","type":"uint64","internalType":"uint64"}],"stateMutability":"view"},{"type":"function","name":"status","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"enumLoanFacility.Status"}],"stateMutability":"view"},{"type":"function","name":"suspenseBalance","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"token","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contractIERC20Minimal"}],"stateMutability":"view"},{"type":"event","name":"Acknowledged","inputs":[{"name":"by","type":"address","indexed":true,"internalType":"address"},{"name":"attestationId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"noteHash","type":"bytes32","indexed":false,"internalType":"bytes32"}],"anonymous":false},{"type":"event","name":"Bound","inputs":[{"name":"borrower","type":"address","indexed":true,"internalType":"address"},{"name":"entityId","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"companyNumber","type":"string","indexed":false,"internalType":"string"},{"name":"lei","type":"string","indexed":false,"internalType":"string"},{"name":"nonce","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"DefaultDeclared","inputs":[{"name":"lender","type":"address","indexed":true,"internalType":"address"},{"name":"attestationId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"at","type":"uint64","indexed":false,"internalType":"uint64"}],"anonymous":false},{"type":"event","name":"DrawdownExecuted","inputs":[{"name":"drawdownId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"attestationId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"DrawdownRequested","inputs":[{"name":"drawdownId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"requestId","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"entityId","type":"bytes32","indexed":true,"internalType":"bytes32"},{"name":"companyNumber","type":"string","indexed":false,"internalType":"string"},{"name":"lei","type":"string","indexed":false,"internalType":"string"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"OfficeHolderNominated","inputs":[{"name":"officeHolder","type":"address","indexed":true,"internalType":"address"},{"name":"effectiveAt","type":"uint64","indexed":false,"internalType":"uint64"},{"name":"evidenceHash","type":"bytes32","indexed":false,"internalType":"bytes32"}],"anonymous":false},{"type":"event","name":"Repaid","inputs":[{"name":"repaymentId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"heldInSuspense","type":"bool","indexed":false,"internalType":"bool"},{"name":"status","type":"uint8","indexed":false,"internalType":"enumLoanFacility.Status"}],"anonymous":false},{"type":"event","name":"ReviewRecorded","inputs":[{"name":"reviewId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"reviewer","type":"address","indexed":true,"internalType":"address"},{"name":"coveredBits","type":"uint32","indexed":false,"internalType":"uint32"},{"name":"attestationId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"reasonHash","type":"bytes32","indexed":false,"internalType":"bytes32"},{"name":"expiresAt","type":"uint64","indexed":false,"internalType":"uint64"}],"anonymous":false},{"type":"event","name":"SuspenseReleased","inputs":[{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"reasonHash","type":"bytes32","indexed":false,"internalType":"bytes32"},{"name":"by","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"UndrawnCancelled","inputs":[{"name":"by","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"AlreadyBound","inputs":[]},{"type":"error","name":"AlreadyExecuted","inputs":[{"name":"drawdownId","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"AttestationNotFresh","inputs":[{"name":"checkedAt","type":"uint64","internalType":"uint64"},{"name":"requestedAt","type":"uint64","internalType":"uint64"}]},{"type":"error","name":"BadSignature","inputs":[]},{"type":"error","name":"BindingExpired","inputs":[]},{"type":"error","name":"DefaultNotAllowed","inputs":[{"name":"status","type":"uint8","internalType":"enumLoanFacility.Status"}]},{"type":"error","name":"DrawdownsBlocked","inputs":[{"name":"status","type":"uint8","internalType":"enumLoanFacility.Status"}]},{"type":"error","name":"FundsReserved","inputs":[]},{"type":"error","name":"InvalidRecipient","inputs":[{"name":"to","type":"address","internalType":"address"}]},{"type":"error","name":"InvalidReview","inputs":[]},{"type":"error","name":"NoProceedingKnown","inputs":[]},{"type":"error","name":"NoSuchDrawdown","inputs":[{"name":"drawdownId","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"NotBound","inputs":[]},{"type":"error","name":"NothingInSuspense","inputs":[]},{"type":"error","name":"OnlyArbiter","inputs":[]},{"type":"error","name":"OnlyBorrower","inputs":[]},{"type":"error","name":"OnlyLender","inputs":[]},{"type":"error","name":"OnlyParty","inputs":[]},{"type":"error","name":"RequestExpired","inputs":[{"name":"drawdownId","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"SuspenseNotReleasable","inputs":[{"name":"status","type":"uint8","internalType":"enumLoanFacility.Status"}]},{"type":"error","name":"TransferFailed","inputs":[]}] as const

export class LoanFacility {
  constructor(
    private readonly client: EVMClient,
    public readonly address: Address,
  ) {}

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

  carveOutWindow(
    runtime: Runtime<unknown>,
  ): number {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'carveOutWindow' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'carveOutWindow' as const,
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

  officeHolder(
    runtime: Runtime<unknown>,
  ): `0x${string}` {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'officeHolder' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'officeHolder' as const,
      data: bytesToHex(result.data),
    }) as `0x${string}`
  }

  officeHolderFrom(
    runtime: Runtime<unknown>,
  ): bigint {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'officeHolderFrom' as const,
    })

    const result = this.client
      .callContract(runtime, {
        call: encodeCallMsg({ from: zeroAddress, to: this.address, data: callData }),
        blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
      })
      .result()

    return decodeFunctionResult({
      abi: LoanFacilityABI,
      functionName: 'officeHolderFrom' as const,
      data: bytesToHex(result.data),
    }) as bigint
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

  writeReportFromNominateOfficeHolder(
    runtime: Runtime<unknown>,
    who: `0x${string}`,
    evidenceHash: `0x${string}`,
    gasConfig?: { gasLimit?: string },
  ) {
    const callData = encodeFunctionData({
      abi: LoanFacilityABI,
      functionName: 'nominateOfficeHolder' as const,
      args: [who, evidenceHash],
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
   * Creates a log trigger for OfficeHolderNominated events.
   * The returned trigger's adapt method decodes the raw log into OfficeHolderNominatedDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerOfficeHolderNominated(
    filters?: OfficeHolderNominatedTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'OfficeHolderNominated' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        officeHolder: f.officeHolder,
      }
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'OfficeHolderNominated' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          officeHolder: f.officeHolder,
        }
        return encodeEventTopics({
          abi: LoanFacilityABI,
          eventName: 'OfficeHolderNominated' as const,
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
      adapt: (rawOutput: EVMLog): DecodedLog<OfficeHolderNominatedDecoded> => contract.decodeOfficeHolderNominated(rawOutput),
    }
  }

  /**
   * Decodes a log into OfficeHolderNominated data, preserving all log metadata.
   */
  decodeOfficeHolderNominated(log: EVMLog): DecodedLog<OfficeHolderNominatedDecoded> {
    const decoded = decodeEventLog({
      abi: LoanFacilityABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as OfficeHolderNominatedDecoded }
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

  /**
   * Creates a log trigger for UndrawnCancelled events.
   * The returned trigger's adapt method decodes the raw log into UndrawnCancelledDecoded,
   * so the handler receives typed event data directly.
   * When multiple filters are provided, topic values are merged with OR semantics (match any).
   */
  logTriggerUndrawnCancelled(
    filters?: UndrawnCancelledTopics[],
  ) {
    let topics: { values: string[] }[]
    if (!filters || filters.length === 0) {
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'UndrawnCancelled' as const,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else if (filters.length === 1) {
      const f = filters[0]
      const args = {
        by: f.by,
      }
      const encoded = encodeEventTopics({
        abi: LoanFacilityABI,
        eventName: 'UndrawnCancelled' as const,
        args,
      })
      topics = encoded.map((t) => ({ values: encodeTopicValue(t) }))
    } else {
      const allEncoded = filters.map((f) => {
        const args = {
          by: f.by,
        }
        return encodeEventTopics({
          abi: LoanFacilityABI,
          eventName: 'UndrawnCancelled' as const,
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
      adapt: (rawOutput: EVMLog): DecodedLog<UndrawnCancelledDecoded> => contract.decodeUndrawnCancelled(rawOutput),
    }
  }

  /**
   * Decodes a log into UndrawnCancelled data, preserving all log metadata.
   */
  decodeUndrawnCancelled(log: EVMLog): DecodedLog<UndrawnCancelledDecoded> {
    const decoded = decodeEventLog({
      abi: LoanFacilityABI,
      data: bytesToHex(log.data),
      topics: log.topics.map((t) => bytesToHex(t)) as [Hex, ...Hex[]],
    })
    const { data: _, ...rest } = log
    return { ...rest, data: decoded.args as unknown as UndrawnCancelledDecoded }
  }
}

