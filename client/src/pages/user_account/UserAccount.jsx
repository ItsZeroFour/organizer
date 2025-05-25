import React, { useState, useEffect } from "react";
import style from "../account/style.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import AdminsDirecting from "../../components/account/AdminsDirecting";
import StudentsDirecting from "../../components/account/StudentsDirectings";
import StudentsEvents from "../../components/account/StudentsEvents";

const UserAccount = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoadingUser(true);

        const userData = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/user/get-user/${id}`
        );

        if (userData.status === 200) {
          setLoadingUser(false);
          return setUser(userData.data);
        }
      } catch (error) {
        setLoadingUser(false);
        alert(`Произошла ошибка: ${error.response.data.message}`);
        console.error("Ошибка загрузки файла:", error);
      }
    };

    getUserData();
  }, []);

  return (
    <section className={style.account}>
      <div className="container">
        {loadingUser
          ? "Загрузка..."
          : user && (
              <div className={style.account__wrapper}>
                <div className={style.account__main}>
                  <h3>
                    {user.role.toLowerCase() === "студент"
                      ? "Студент"
                      : user.role.toLowerCase() === "организатор"
                      ? "Организатор воспитательног отдела"
                      : user.role.toLowerCase() === "руководитель в.о."
                      ? "руководителя воспитательного отдела"
                      : user.role.toLowerCase() === "руководитель направления"
                      ? "Руководитель направления"
                      : "Администратор"}
                  </h3>

                  <p>{user.fullName}</p>

                  <div className={style.account__newinfo}>
                    {user.role === "Студент" ? (
                      <React.Fragment>
                        <div>
                          <p>Группа</p>
                          <p>{user.group}</p>
                        </div>

                        <div>
                          <p>Номер телефона</p>
                          <p>{user.phone}</p>
                        </div>

                        <div>
                          <p>Дата рождения</p>
                          <p>{user.birthdate}</p>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <div>
                          <p>E-mail</p>
                          <p>{user.email}</p>
                        </div>

                        <div>
                          <p>Номер телефона</p>
                          <p>{user.phone}</p>
                        </div>

                        <div>
                          <p>Дата рождения</p>
                          <p>{user.birthdate}</p>
                        </div>
                      </React.Fragment>
                    )}
                  </div>

                  {/* <button
                    onClick={() => {
                      window.location.reload();
                      navigate("/");
                      localStorage.removeItem("token");
                    }}
                  >
                    Выйти
                  </button> */}
                </div>

                {user.role !== "Студент" ? (
                  <React.Fragment>
                    <AdminsDirecting userId={id} />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <StudentsDirecting userId={id} />
                    <StudentsEvents userId={id} />
                  </React.Fragment>
                )}
              </div>
            )}
      </div>
    </section>
  );
};

export default UserAccount;
