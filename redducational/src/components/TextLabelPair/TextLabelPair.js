import utilStyles from "../../App/utils.module.css";

export default function TextLabelPair({ textOne, textTwo }) {
  return (
    <div className={`${utilStyles.flexRow} ${utilStyles.orange}`}>
      <div>{textOne}</div>
      <div className={utilStyles.pipe}>|</div>
      <div>{textTwo}</div>
    </div>
  );
}
