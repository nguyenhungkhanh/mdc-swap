import React from 'react';
import logoFly from "../../assets/images/logo-fly.png";

import styles from "./index.module.scss";

export default function Loader() {
  return (
    <div className={styles.wrapper}>
      <img src={logoFly} alt="logo fly" />
    </div>
  )
}