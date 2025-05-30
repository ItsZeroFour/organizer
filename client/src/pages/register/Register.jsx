import React, { useState } from "react";
import style from "./style.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import NotificationNoReload from "../../components/notification/NotificationNoReload";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [showNotification, setShowNotification] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const { email, password, fullName } = formData;

    if (!email || !password || !fullName) {
      setShowNotification(true);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/register`,
        formData
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
    <section className={style.register}>
      {showNotification && (
        <NotificationNoReload
          title={"Ошибка!"}
          text={"Пожалуйста, заполните все поля!"}
        />
      )}

      <div className="container">
        <div className={style.register__wrapper}>
          <div className={style.register__content}>
            <h1>ЗАРЕГИСТРИРОВАТЬСЯ</h1>

            <form onSubmit={submitForm}>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="ФИО"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-mail"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Пароль"
              />

              <div className={style.register__box}>
                <input id="pass" type="checkbox" />
                <label htmlFor="pass">Запомнить пароль</label>
              </div>

              <button type="submit">Зарегистрироваться</button>
            </form>
          </div>

          <div className={style.signin__links}>
            <p>
              Уже есть аккаунт? <Link to="/signin">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
