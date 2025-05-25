import React, { useState } from "react";
import style from "./style.module.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const { email, password, fullName } = formData;

    if (!email || !password || !fullName) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/user/register`,
        formData
      );
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        alert("Вы успешно зарегистировались!");
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      alert(
        `Произошла ошибка: ${error.response?.data?.message || error.message}`
      );
      console.error(error);
    }
  };

  return (
    <section className={style.register}>
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
