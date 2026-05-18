"use client";
import styles from "./spinner.module.css";

export default function Spinner() {
  return (
    <div className={styles.center}>
      <div className={styles.spinner}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={styles.spinnerBlade}></div>
        ))}
      </div>
    </div>
  );
}
