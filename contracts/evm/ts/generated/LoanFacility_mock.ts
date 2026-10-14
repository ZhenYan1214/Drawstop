// Code generated — DO NOT EDIT.
import type { Address } from 'viem'
import { addContractMock, type ContractMock, type EvmMock } from '@chainlink/cre-sdk/test'

import { LoanFacilityABI } from './LoanFacility'

export type LoanFacilityMock = {
  bINDINGTYPEHASH?: () => `0x${string}`
  hARDMASK?: () => number
  pETITIONMASK?: () => number
  rEQUIREDSOURCES?: () => number
  wATCHMASK?: () => number
  arbiter?: () => `0x${string}`
  bindingDigest?: (nonce: bigint, deadline: bigint) => `0x${string}`
  bindingNonce?: () => bigint
  borrower?: () => `0x${string}`
  bound?: () => boolean
  clockAnchor?: () => number
  companyNumber?: () => string
  coveredBits?: (firstSeen: readonly bigint[]) => number
  defaulted?: () => boolean
  domainSeparator?: () => `0x${string}`
  drawdownCount?: () => bigint
  drawdowns?: (arg0: bigint) => readonly [bigint, bigint, boolean]
  entityId?: () => `0x${string}`
  graceStart?: (a: { id: bigint; checkedAt: bigint; validUntil: bigint; eventBits: number; unavailableBits: number; activeBits: number; chUpdatedAt: bigint; gazetteUpdatedAt: bigint; gleifUpdatedAt: bigint; petitionPresentedAt: bigint; petitionPublishedAt: bigint; petitionCaseRef: `0x${string}`; evidenceHash: `0x${string}`; requestId: `0x${string}` }, firstSeen: readonly bigint[]) => bigint
  lei?: () => string
  lender?: () => `0x${string}`
  petitionGracePeriod?: () => bigint
  registry?: () => `0x${string}`
  repaidSincePetitionPresented?: () => bigint
  repaidToLenderSince?: (since: bigint) => bigint
  repaymentCount?: () => bigint
  repayments?: (arg0: bigint) => readonly [bigint, bigint, boolean]
  requestId?: (drawdownId: bigint) => `0x${string}`
  reviewCount?: () => bigint
  reviews?: (arg0: bigint) => readonly [`0x${string}`, number, bigint, `0x${string}`, bigint, bigint]
  status?: () => number
  suspenseBalance?: () => bigint
  token?: () => `0x${string}`
} & Pick<ContractMock<typeof LoanFacilityABI>, 'writeReport'>

export function newLoanFacilityMock(address: Address, evmMock: EvmMock): LoanFacilityMock {
  return addContractMock(evmMock, { address, abi: LoanFacilityABI }) as LoanFacilityMock
}

