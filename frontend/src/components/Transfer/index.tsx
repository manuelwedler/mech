import classes from "./Transfer.module.css"
import Button from "../Button"
import Modal from "@mui/material/Modal"
import React, { useState } from "react"
import { MoralisFungible } from "../../types/Token"
import FungibleLabel from "../FungibleLabel"
import { validateAddress } from "../../utils/addressValidation"
import { useTransferFungible } from "../../hooks/useTransferFungible"
import Loading from "../Loading"
import { useAccount } from "wagmi"
import { parseUnits } from "viem"

interface Props {
  asset: MoralisFungible
  mechAddress: `0x${string}`
  operatorAddress: `0x${string}`
  chainId: number
}

const Transfer: React.FC<Props> = ({
  asset,
  mechAddress,
  operatorAddress,
  chainId,
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [receiver, setReceiver] = useState("")
  const [validReceiver, setReceiverValid] = useState(false)
  const [amount, setAmount] = useState("")
  const [validAmount, setValidAmount] = useState(false)

  const { address } = useAccount()
  const isOperator = address === operatorAddress
  const validInputs = validReceiver && validAmount && isOperator

  const { transfer, transferPending } = useTransferFungible(
    mechAddress,
    asset.token_address as `0x${string}`,
    chainId
  )

  const handleReceiver = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value
    setReceiver(newAddress)
    const valid = validateAddress(newAddress) !== ""
    setReceiverValid(valid)
  }

  const handleAmount = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value
    setAmount(newAmount)
    let valid: boolean
    try {
      const parsedValue = parseUnits(newAmount, asset.decimals || 0)
      valid = parsedValue > 0 && parsedValue <= BigInt(asset.balance)
    } catch (e) {
      valid = false
    }
    setValidAmount(valid)
  }

  const handleTransferClick = () => {
    if (!validInputs) return
    const parsedAmount = parseUnits(amount, asset.decimals || 0)
    transfer(receiver as `0x${string}`, parsedAmount)
  }

  return (
    <>
      <Button
        className={classes.button}
        onClick={() => setModalOpen(true)}
        title="The operator can initiate to transfer this Token"
        disabled={!isOperator}
      >
        Transfer
      </Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className={classes.box}>
          {transferPending ? (
            <>
              <Loading />
              <p className={classes.loading}>
                Awaiting transaction confirmation...
              </p>
            </>
          ) : (
            <>
              <input
                value={receiver}
                onChange={handleReceiver}
                type="text"
                className={classes.input}
                placeholder="Receiver"
              />
              <div className={classes.inputContainer}>
                <FungibleLabel asset={asset} />
                <input
                  value={amount}
                  onChange={handleAmount}
                  type="text"
                  inputMode="decimal"
                  className={classes.input}
                  placeholder="Amount"
                />
              </div>
              <Button
                className={classes.button}
                onClick={handleTransferClick}
                disabled={!validInputs}
                title={
                  !validInputs
                    ? "Please use a valid receiver address and amount"
                    : ""
                }
              >
                Transfer
              </Button>
            </>
          )}
        </div>
      </Modal>
    </>
  )
}

export default Transfer
