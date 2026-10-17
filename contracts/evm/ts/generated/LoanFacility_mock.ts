// Code generated — DO NOT EDIT.
import type { Address } from 'viem'
import { addContractMock, type ContractMock, type EvmMock } from '@chainlink/cre-sdk/test'

import { LoanFacilityABI } from './LoanFacility'

export type LoanFacilityMock = {
  arbiter?: () => `0x${string}`
  bindingDigest?: (nonce: bigint, deadline: bigint) => `0x${string}`
  borrower?: () => `0x${string}`
  bound?: () => boolean
  carveOutWindow?: () => number
  defaulted?: () => boolean
  drawdowns?: (arg0: bigint) => readonly [bigint, bigint, boolean]
  entityId?: () => `0x${string}`
  lender?: () => `0x${string}`
  officeHolder?: () => `0x${string}`
  officeHolderFrom?: () => bigint
  petitionGracePeriod?: () => bigint
  registry?: () => `0x${string}`
  repaidSincePetitionPresented?: () => bigint
  repayments?: (arg0: bigint) => readonly [bigint, bigint, boolean]
  reviews?: (arg0: bigint) => readonly [`0x${string}`, number, bigint, `0x${string}`, bigint, bigint]
  status?: () => number
  suspenseBalance?: () => bigint
  token?: () => `0x${string}`
} & Pick<ContractMock<typeof LoanFacilityABI>, 'writeReport'>

export function newLoanFacilityMock(address: Address, evmMock: EvmMock): LoanFacilityMock {
  return addContractMock(evmMock, { address, abi: LoanFacilityABI }) as LoanFacilityMock
}

