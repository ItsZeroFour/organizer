import React, { useState } from "react";
import style from "./style.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const SignIn = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const { email, password } = credentials;

    if (!email || !password) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/login`,
        credentials
      );
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        alert("Вы успешно вошли!");
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      alert(`Произошла ошибка: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  return (
    <section className={style.signin}>
      <div className="container">
        <div className={style.signin__wrapper}>
          <h1>ВОЙТИ</h1>

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
            <button type="submit">Войти</button>
          </form>

          <div className={style.signin__links}>
            <p>
              Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
            <Link to="/forgot-password">Забыли пароль?</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
