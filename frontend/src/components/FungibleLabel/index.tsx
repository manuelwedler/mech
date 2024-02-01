import classes from "./FungibleLabel.module.css"
import { MoralisFungible } from "../../types/Token"

interface Props {
  asset: MoralisFungible
}

const FungibleLabel: React.FC<Props> = ({ asset }) => {
  return (
    <div className={classes.assetName}>
      <img src={asset.logo} alt={`logo for ${asset.name}`} />
      <div>{asset.name}</div>
    </div>
  )
}

export default FungibleLabel
