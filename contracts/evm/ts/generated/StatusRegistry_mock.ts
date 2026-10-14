// Code generated — DO NOT EDIT.
import type { Address } from 'viem'
import { addContractMock, type ContractMock, type EvmMock } from '@chainlink/cre-sdk/test'

import { StatusRegistryABI } from './StatusRegistry'

export type StatusRegistryMock = {
  eVENTCOUNT?: () => number
  eVCHINSOLVENCYHISTORY?: () => number
  eVCHSTATUSADVERSE?: () => number
  eVGLEIFLEILAPSED?: () => number
  eVGZINSOLVENCYPROCEEDING?: () => number
  eVGZPETITIONDISMISSED?: () => number
  eVGZPETITIONPENDING?: () => number
  eVSOURCECONFLICT?: () => number
  sRCCOMPANIESHOUSE?: () => number
  sRCGAZETTE?: () => number
  sRCGLEIF?: () => number
  attestationCount?: () => bigint
  entityIdFor?: (companyNumber: string) => `0x${string}`
  getEntity?: (entityId: `0x${string}`) => { companyNumber: string; lei: string; monitored: boolean }
  getExpectedAuthor?: () => `0x${string}`
  getExpectedWorkflowId?: () => `0x${string}`
  getExpectedWorkflowName?: () => `0x${string}`
  getFirstSeen?: (entityId: `0x${string}`) => readonly bigint[]
  getForwarderAddress?: () => `0x${string}`
  getLatest?: (entityId: `0x${string}`) => { id: bigint; checkedAt: bigint; validUntil: bigint; eventBits: number; unavailableBits: number; activeBits: number; chUpdatedAt: bigint; gazetteUpdatedAt: bigint; gleifUpdatedAt: bigint; petitionPresentedAt: bigint; petitionPublishedAt: bigint; petitionCaseRef: `0x${string}`; evidenceHash: `0x${string}`; requestId: `0x${string}` }
  getMonitored?: () => readonly [readonly `0x${string}`[], readonly string[], readonly string[]]
  isRegistrar?: (arg0: `0x${string}`) => boolean
  owner?: () => `0x${string}`
  sourceOf?: (eventBit: number) => number
  supportsInterface?: (interfaceId: `0x${string}`) => boolean
} & Pick<ContractMock<typeof StatusRegistryABI>, 'writeReport'>

export function newStatusRegistryMock(address: Address, evmMock: EvmMock): StatusRegistryMock {
  return addContractMock(evmMock, { address, abi: StatusRegistryABI }) as StatusRegistryMock
}

