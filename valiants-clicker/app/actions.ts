'use server'

import abiJson from '../lib/abi.json'
import { circle } from '@/lib/circle'

export async function contractQuery(body = {}) {
  const bearerKey = process.env.CIRCLE_API_KEY

  const response = await fetch(`${process.env.CIRCLE_API}/contracts/query`, {
    body: JSON.stringify({
      blockchain: 'ETH-SEPOLIA',
      address: '0xde5d27caa44951d7c361120f3e9ac059908a7dee',
      abiJson: JSON.stringify(abiJson),
      ...body,
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerKey}`,
    },
  })

  const data = await response.json()

  return data
}

export async function getTransaction(transactionId: string){
  const response = await circle.getTransaction({ id:transactionId })

  return response.data
}

export async function contractExecution(body: {
  abiFunctionSignature: string
  walletId: string
  abiParameters?: Array<any>
}) {
  const response = await circle.createContractExecutionTransaction({
    contractAddress: '0xde5d27caa44951d7c361120f3e9ac059908a7dee',
    ...body,
    fee: {
      type: 'level',
      config: {
        feeLevel: 'HIGH',
      },
    },
  })

  return response.data
}