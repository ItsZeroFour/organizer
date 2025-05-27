import React, { useState } from "react";
import style from "./style.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import NotificationNoReload from "../../components/notification/NotificationNoReload";

const SignIn = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const { email, password } = credentials;

    if (!email || !password) {
      setShowNotification(true);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/login`,
        credentials
      );
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className={style.signin}>
      {showNotification && (
        <NotificationNoReload
          title={"Ошибка!"}
          text={"Пожалуйста, заполните все поля!"}
        />
      )}

      <div className="container">
        <div className={style.signin__wrapper}>
          <div className={style.signin__content}>
            <h1>Авторизация</h1>

            <form onSubmit={submitForm}>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="E-mail"
              />
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Пароль"
              />
              <div className={style.register__box}>
                <input id="pass" type="checkbox" />
                <label htmlFor="pass">Запомнить пароль</label>
              </div>

              <button type="submit">Войти</button>
            </form>
          </div>

          <div className={style.signin__links}>
            <Link to="/register">Забыли свой пароль?</Link>
            <Link to="/register">Нет аккаунта в системе?</Link>
            {/* <Link to="/forgot-password">Забыли пароль?</Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
