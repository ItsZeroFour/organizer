import React from "react";
import style from "./style.module.scss";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import user from "../../assets/user.svg";
import { NavLink } from "react-router-dom";

const Header = ({ userData }) => {
  const shortenName = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length < 2) return fullName;
    const [lastName, firstName, patronymic] = parts;
    const firstInitial = firstName ? firstName[0].toUpperCase() + "." : "";
    const patronymicInitial = patronymic
      ? patronymic[0].toUpperCase() + "."
      : "";
    return `${lastName} ${firstInitial} ${patronymicInitial}`.trim();
  };

  return (
    <header className={style.header}>
      <div className="container">
        <div className={style.header__wrapper}>
          <Link to="/">
            <img src={logo} alt="logo" />
            <p>внеучебная деятельность ИАТ</p>
          </Link>

          <nav>
            <ul>
              <li>
                <NavLink to="/" exact activeClassName="active">
                  Студенческие объединения
                </NavLink>
              </li>
              <li>
                <NavLink to="/events" activeClassName="active">
                  Мероприятия
                </NavLink>
              </li>
              <li>
                <NavLink to="/contacts" activeClassName="active">
                  Контакты
                </NavLink>
              </li>
            </ul>
          </nav>

          {!userData ? (
            <Link to="/signin">Войти</Link>
          ) : (
            <div className={style.header__user}>
              <Link to="/account">
                <img src={user} alt="user" /> {shortenName(userData.fullName)}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
