import React from "react";
import style from "./style.module.scss";

const Notification = ({ title, text }) => {
  return (
    <div className={style.notification}>
      <div className={style.notification__wrapper}>
        <div className={style.notification__content}>
          <h3>{title}</h3>
          <p>{text}</p>

          <button onClick={() => window.location.reload()}>Ок</button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
