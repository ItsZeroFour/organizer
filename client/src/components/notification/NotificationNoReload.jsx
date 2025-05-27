import React from "react";
import style from "./style.module.scss";

const NotificationNoReload = ({ title, text, open }) => {
  return (
    <div className={style.notification}>
      <div className={style.notification__wrapper}>
        <div className={style.notification__content}>
          <h3>{title}</h3>
          <p>{text}</p>

          <button onClick={() => open(false)}>Ок</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationNoReload;
