import React, { useEffect, useState, useCallback } from "react";
import style from "./style.module.scss";
import { Link, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import Notification from "../../components/notification/Notification";

const Directing = ({ userData }) => {
  const [directing, setDirecting] = useState(null);
  const [loadingDirecting, setLoadingDirecting] = useState(false);

  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);

  const [showNotification1, setShowNotification1] = useState(false);
  const [showNotification2, setShowNotification2] = useState(false);

  const { id } = useParams();

  const fetchDirecting = useCallback(async () => {
    setLoadingDirecting(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/directing/get-directing/${id}`
      );
      setDirecting(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingDirecting(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDirecting();
  }, [fetchDirecting]);

  const addUserToApplications = async () => {
    try {
      const pushUser = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/directing/add-to-applications/${id}`
      );

      if (pushUser.status === 200) {
        setShowNotification1(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getAdmins = async () => {
      try {
        setAdminsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/directing/get-admins/${id}`
        );

        if (response.status === 200) {
          setAdmins(response.data);
          setAdminsLoading(false);
        }
      } catch (error) {
        setAdminsLoading(false);
        console.log(error);
      }
    };

    getAdmins();
  }, []);

  const concelApplication = async () => {
    try {
      const response = await axios.patch(`/directing/cancel-application/${id}`);

      console.log(response);

      if (response.status === 200) {
        setShowNotification2(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={style.directing}>
      {showNotification1 && (
        <Notification
          title={"Успешно!"}
          text={"Ваша заявка успешно подана, ожидайте!"}
        />
      )}

      {showNotification2 && (
        <Notification title={"Успешно!"} text={"Вы отменили заявку!"} />
      )}
      <div className={style.directing__wrapper}>
        {loadingDirecting ? (
          <p>Загрузка...</p>
        ) : (
          directing && (
            <>
              <div
                className={style.directing__head}
                style={{
                  backgroundImage: `url(${process.env.REACT_APP_SERVER_URL}${directing.imagePath})`,
                }}
              >
                <div className="container">
                  <div className={style.head__wrapper}>
                    <div>
                      <h2>{directing.name}</h2>
                      <p>{directing.description}</p>

                      {userData?.role === "Студент" && (
                        <div className={style.directing__buttons}>
                          <button
                            onClick={addUserToApplications}
                            disabled={
                              directing.applications.includes(userData._id) ||
                              directing.members.includes(userData._id)
                            }
                          >
                            {directing.applications.includes(userData._id)
                              ? "Ожидание подтверждения"
                              : directing.members.includes(userData._id)
                              ? "Вы уже записаны"
                              : "Записаться"}
                          </button>

                          {directing.applications.includes(userData._id) && (
                            <button
                              className={style.directing__buttons__red}
                              onClick={concelApplication}
                            >
                              Отменить заявку
                            </button>
                          )}
                        </div>
                      )}

                      {userData &&
                        (["Администратор", "Зам. в.о."].includes(
                          userData.role
                        ) ||
                          directing.admins.includes(userData._id)) && (
                          <Link to={`/admin-directing/${id}`}>Управлять</Link>
                        )}

                      {/* {(userData?.role?.toLowerCase() === "зам. в.о." ||
                        userData?.role?.toLowerCase() === "администратор") && (
                        <Link
                          className={style.directing__head__excel}
                          to={`${process.env.REACT_APP_SERVER_URL}/excel-direction/${id}`}
                          target="_blank"
                        >
                          Скачать Excel
                        </Link>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="container">
                <div className={style.directing__content}>
                  <div className={style.directing__about}>
                    <div className="container">
                      <div className={style.directing__about__wrapper}>
                        <div className={style.directing__about__text}>
                          <h3>О студенческом объединении</h3>
                        </div>

                        <div className={style.directing__about__content}>
                          <p>{directing.secondDescription}</p>

                          <img
                            src={`${process.env.REACT_APP_SERVER_URL}${directing.secondImagePath}`}
                            alt="second image"
                          />
                        </div>
                      </div>

                      <div className={style.directing__admins}>
                        <h2>Руководители студенческого объединения:</h2>

                        {adminsLoading
                          ? "Загрузка..."
                          : admins && (
                              <ul>
                                {admins.map((item) => (
                                  <li key={item._id}>
                                    <Link to={`/user/${item._id}`}>
                                      <h3>{item.fullName}</h3>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                      </div>

                      <div className={style.directing__skills}>
                        <h3>Навыки:</h3>

                        <ol>
                          {directing.skills.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className={style.directing__gallery}>
                    <div className="container">
                      <div className={style.directing__gallery__wrapper}>
                        <h3>Галлерея</h3>

                        <ul>
                          {directing.gallery.map((imagePath) => (
                            <li key={imagePath}>
                              <img
                                src={`${process.env.REACT_APP_SERVER_URL}${imagePath}`}
                                alt="image"
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Directing;
