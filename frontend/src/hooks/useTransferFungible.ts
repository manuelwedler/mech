import { useCallback, useState } from "react"
import { usePublicClient, useWalletClient } from "wagmi"
import { encodeFunctionData } from "viem"
import { makeExecuteTransaction } from "mech-sdk"

export const useTransferFungible = (
  mechAddress: `0x${string}`,
  tokenAddress: `0x${string}`,
  chainId: number
) => {
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })

  const [transferPending, setTransferPending] = useState(false)

  const transfer = useCallback(
    async (receiver: `0x${string}`, amount: bigint) => {
      if (!walletClient) return
      const transferTx = {
        to: tokenAddress,
        from: mechAddress,
        data: encodeFunctionData({
          abi: ERC20TransferAbi,
          functionName: "transfer",
          args: [receiver, amount],
        }),
        value: 0,
      }

      const executeTx = makeExecuteTransaction(mechAddress, transferTx)
      setTransferPending(true)
      try {
        const hash = await walletClient.sendTransaction(executeTx)
        await publicClient.waitForTransactionReceipt({ hash })
        return
      } catch (e) {
        console.error(e)
      } finally {
        setTransferPending(false)
      }
    },
    [walletClient, publicClient, mechAddress, tokenAddress]
  )

  return { transfer, transferPending }
}

const ERC20TransferAbi = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
]
