import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { Link, useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import axios from "../../utils/axios";
import AdminsDirecting from "../../components/account/AdminsDirecting";
import AdminsEvents from "../../components/account/AdminsEvents";
import StudentsDirecting from "../../components/account/StudentsDirectings";
import StudentsApplications from "../../components/account/StudentsApplications";
import StudentsApplications2 from "../../components/account/StudentsApplications2";
import StudentsApplications3 from "../../components/account/StudentsApplications3";
import StudentsEvents from "../../components/account/StudentsEvents";
import NotificationNoReload from "../../components/notification/NotificationNoReload";

const Account = ({ userData, findUserProcess }) => {
  useEffect(() => {
    if (!userData) {
      return navigate("/");
    }
  }, [userData]);

  const [group, setGroup] = useState(
    (userData && userData.group) || "Не указано"
  );
  const [phone, setPhone] = useState(
    (userData && userData.phone) || "Не указано"
  );
  const [post, setPost] = useState(
    (userData && userData.post) || "Должность не указана"
  );
  const [birthdate, setBirthdate] = useState(
    (userData && userData.birthdate) || "Не указано"
  );
  const [showPageIndex, setShowPageIndex] = useState(0);
  const [showNotificationUpdate, setShowNotificationUpdate] = useState(false);

  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const update = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/user/update`,
        {
          group,
          phone,
          birthdate,
          post,
        }
      );

      if (update.status === 200) {
        setShowNotificationUpdate(true);
      }
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
    }
  };

  return (
    <section className={style.account}>
      {showNotificationUpdate && (
        <NotificationNoReload
          title={"Успешно!"}
          text={"Профиль успешно обновлен!"}
          open={setShowNotificationUpdate}
        />
      )}

      <div className="container">
        <div className={style.account__wrapper}>
          <div className={style.account__content}>
            <div className={style.account__links}>
              <button
                onClick={() => setShowPageIndex(0)}
                className={showPageIndex === 0 && style.active}
              >
                Мой профиль
              </button>
              <button
                onClick={() => setShowPageIndex(1)}
                className={showPageIndex === 1 && style.active}
              >
                Мои студенческие объединения
              </button>
              <button
                onClick={() => setShowPageIndex(2)}
                className={showPageIndex === 2 && style.active}
              >
                Мои мероприятия
              </button>
            </div>

            {showPageIndex === 0 ? (
              <div className={style.account__main}>
                <h3>{userData && userData.fullName}</h3>

                <h5>
                  {userData && userData.role.toLowerCase() === "студент"
                    ? "Студент"
                    : userData &&
                      userData.role.toLowerCase() === "руководитель с.о."
                    ? "Руководитель студенческого объединения"
                    : userData &&
                      userData.role.toLowerCase() === "сотрудник в.о."
                    ? "Сотрудник воспитательного отдела"
                    : userData && userData.role.toLowerCase() === "зам. в.о."
                    ? "Заместитель директора по воспитательной работе"
                    : userData &&
                      userData.role.toLowerCase() === "руководитель в.о."
                    ? "Руководитель воспитательного отдела"
                    : "Администратор"}
                </h5>

                {userData && userData.role.toLowerCase() === "студент" ? (
                  <div className={style.account__newinfo}>
                    <p>Контактная информация</p>

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
                    <p>Контактная информация</p>

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

                    {userData &&
                      userData.role.toLowerCase() === "сотрудник в.о." && (
                        <div>
                          <p>Должность</p>
                          <input
                            type="text"
                            placeholder="Должность"
                            value={post}
                            onChange={(e) => setPost(e.target.value)}
                          />
                        </div>
                      )}

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
            ) : showPageIndex === 1 ? (
              <React.Fragment>
                <div className={style.account__main}>
                  <div className={style.account__items}>
                    {userData && userData.role !== "Студент" ? (
                      <React.Fragment>
                        <AdminsDirecting userId={userData && userData._id} />
                      </React.Fragment>
                    ) : (
                      <div className={style.account__list}>
                        <StudentsDirecting userId={userData && userData._id} />
                        {/* <StudentsApplications2
                          userData={userData}
                          userId={userData._id}
                        /> */}

                        <StudentsApplications3
                          userData={userData}
                          userId={userData._id}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className={style.account__main}>
                  <div className={style.account__items}>
                    {userData.role !== "Студент" ? (
                      <React.Fragment>
                        <AdminsEvents userId={userData._id} />
                      </React.Fragment>
                    ) : (
                      <div className={style.account__list}>
                        <StudentsApplications
                          userData={userData}
                          userId={userData._id}
                        />
                        <StudentsEvents
                          userData={userData}
                          userId={userData._id}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
