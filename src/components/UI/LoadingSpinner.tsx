import styles from "./LoadingSpinner.module.css";

type Props = {
  size: number;
};

const LoadingSpinner = (props: Props) => {
  return (
    <div
      className={styles["lds-roller"]}
      style={{ transform: `scale(${props.size})` }}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingSpinner;
