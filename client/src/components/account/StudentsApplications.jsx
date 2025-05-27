import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import Notification from "../notification/Notification";

const StudentsApplications = ({ userData }) => {
  const [applications, setApplications] = useState(null);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const [showNotificationAccept1, setShowNotificationAccept1] = useState(false);
  const [showNotificationAccept2, setShowNotificationAccept2] = useState(false);

  const [showNotificationDecline1, setShowNotificationDecline1] =
    useState(false);
  const [showNotificationDecline2, setShowNotificationDecline2] =
    useState(false);

  useEffect(() => {
    const getStudentApplications = async () => {
      try {
        setLoadingApplications(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/event/get-user-applications`
        );
        setLoadingApplications(false);

        if (response.status === 200) {
          setApplications(response.data);
        }
      } catch (error) {
        setLoadingApplications(false);
      }
    };

    getStudentApplications();
  }, []);

  const accept = async (eventId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/event/add-to-members`,
        {
          eventId: eventId,
          userId: userData._id,
        }
      );

      if (response.status === 200) {
        setShowNotificationAccept1(true);
      } else {
        setShowNotificationAccept2(true);
      }
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
    }
  };

  const cancel = async (eventId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/event/cancel-from-applications`,
        {
          eventId: eventId,
          userId: userData._id,
        }
      );

      if (response.status === 200) {
        setShowNotificationDecline1(true);
      } else {
        setShowNotificationDecline2(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.admins_directing}>
      {showNotificationAccept1 && (
        <Notification
          title={"Успешно!"}
          text={"Приглашение успешно принято!"}
        />
      )}

      {showNotificationAccept2 && (
        <Notification
          title={"Ошибка!"}
          text={"Не удалось принять приглашение"}
        />
      )}

      {showNotificationDecline1 && (
        <Notification
          title={"Успешно!"}
          text={"Приглашение успешно отклонено!"}
        />
      )}

      {showNotificationDecline2 && (
        <Notification
          title={"Ошибка!"}
          text={"Не удалось отклонить приглашение"}
        />
      )}

      <div
        className={`${style.admins_directing__wrapper} ${style.admins_directing__wrapper_2}`}
      >
        <h3>Вас пригласили:</h3>
        {loadingApplications ? (
          <p>Загрузка мероприятий...</p>
        ) : (
          applications && (
            <ul>
              {applications.map(({ name, description, _id, start, finish }) => (
                <li key={_id}>
                  <Link to={`/event/${_id}`}>
                    <h3>{name}</h3>
                    <p>
                      {description.length > 200
                        ? `${description.slice(0, 200)}...`
                        : description}
                    </p>

                    <p>
                      {start} - {finish}
                    </p>
                  </Link>

                  <button onClick={() => accept(_id)}>Принять</button>
                  <button
                    style={{ background: "red" }}
                    onClick={() => cancel(_id)}
                  >
                    Отклонить
                  </button>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default StudentsApplications;
