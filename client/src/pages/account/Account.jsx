import React, { useState } from "react";
import style from "./style.module.scss";
import { Link, useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import axios from "../../utils/axios";
import AdminsDirecting from "../../components/account/AdminsDirecting";
import AdminsEvents from "../../components/account/AdminsEvents";
import StudentsDirecting from "../../components/account/StudentsDirectings";
import StudentsApplications from "../../components/account/StudentsApplications";
import StudentsEvents from "../../components/account/StudentsEvents";

const Account = ({ userData }) => {
  const [group, setGroup] = useState(userData.group || "Не указано");
  const [phone, setPhone] = useState(userData.phone || "Не указано");
  const [birthdate, setBirthdate] = useState(
    userData.birthdate || "Не указано"
  );

  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const update = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/user/update`,
        {
          group,
          phone,
          birthdate,
        }
      );

      if (update.status === 200) {
        alert("Успешно!");
      }
    } catch (error) {
      alert(`Произошла ошибка: ${error.response.data.message}`);
      console.error("Ошибка загрузки файла:", error);
    }
  };

  return (
    <section className={style.account}>
      <div className="container">
        <div className={style.account__links}>
          {(userData.role.toLowerCase() === "руководитель в.о." ||
            userData.role.toLowerCase() === "зам. в.о." ||
            userData.role.toLowerCase() === "администратор") && (
            <Link to="/create-directing">Создание направления</Link>
          )}

          {(userData.role.toLowerCase() === "сотрудник в.о." ||
            userData.role.toLowerCase() === "руководитель с.о." ||
            userData.role.toLowerCase() === "зам. в.о." ||
            userData.role.toLowerCase() === "руководитель в.о." ||
            userData.role.toLowerCase() === "администратор") && (
            <Link to="/create-event">Создание мероприятия</Link>
          )}
        </div>

        <div className={style.account__wrapper}>
          <div className={style.account__main}>
            <h3>
              {userData.role.toLowerCase() === "студент"
                ? "Студент"
                : userData.role.toLowerCase() === "руководитель с.о."
                ? "Руководитель студенческого объединения"
                : userData.role.toLowerCase() === "сотрудник в.о."
                ? "Сотрудник воспитательного отдела"
                : userData.role.toLowerCase() === "зам. в.о."
                ? "Заместитель директора по воспитательной работе"
                : userData.role.toLowerCase() === "руководитель в.о."
                ? "Руководитель воспитательного отдела"
                : "Администратор"}
            </h3>

            <p>{userData.fullName}</p>

            {userData.role.toLowerCase() === "студент" ? (
              <div className={style.account__newinfo}>
                <div>
                  <p>Группа</p>
                  <input
                    type="text"
                    placeholder="Группа"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                  />
                </div>

                <div>
                  <p>Номер телефона</p>
                  <InputMask
                    mask="+7 (999) 999-99-99"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <p>Дата рождения</p>
                  <InputMask
                    mask="99.99.9999"
                    placeholder="ДД.ММ.ГГГГ"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </div>

                <button onClick={handleSave}>Сохранить</button>
              </div>
            ) : (
              <div className={style.account__newinfo}>
                <div>
                  <p>Номер телефона</p>
                  <InputMask
                    mask="+7 (999) 999-99-99"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <p>Дата рождения</p>
                  <InputMask
                    mask="99.99.9999"
                    placeholder="ДД.ММ.ГГГГ"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </div>

                <button onClick={handleSave}>Сохранить</button>
              </div>
            )}

            <button
              onClick={() => {
                window.location.reload();
                navigate("/");
                localStorage.removeItem("token");
              }}
            >
              Выйти
            </button>
          </div>

          {userData.role !== "Студент" ? (
            <React.Fragment>
              <AdminsDirecting userId={userData._id} />
              <AdminsEvents userId={userData._id} />
            </React.Fragment>
          ) : (
            <div className={style.account__list}>
              <div>
                <StudentsDirecting userId={userData._id} />
                <StudentsApplications
                  userData={userData}
                  userId={userData._id}
                />
              </div>
              <StudentsEvents userData={userData} userId={userData._id} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Account;
