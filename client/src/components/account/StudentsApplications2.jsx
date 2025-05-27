import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import Notification from "../notification/Notification";

const StudentsApplications = ({ userData }) => {
  const [applications, setApplications] = useState(null);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [showNotificationDecline, setShowNotificationDecline] = useState(false);

  useEffect(() => {
    const getStudentApplications = async () => {
      try {
        setLoadingApplications(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/event/get-user-applications2`
        );
        setLoadingApplications(false);

        console.log(response);

        if (response.status === 200) {
          setApplications(response.data);
        }
      } catch (error) {
        setLoadingApplications(false);
      }
    };

    getStudentApplications();
  }, []);

  const concelApplication = async (_id) => {
    try {
      const response = await axios.patch(`/event/cancel-application/${_id}`);

      if (response.status === 200) {
        setShowNotificationDecline(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={style.admins_directing}>
      {showNotificationDecline && (
        <Notification title={"Успешно!"} text={"Вы отменили заявку!"} />
      )}

      <div
        className={`${style.admins_directing__wrapper} ${style.admins_directing__wrapper_2}`}
      >
        <h3>Вы подали заявку на мероприятия:</h3>
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

                  <button
                    style={{ background: "red" }}
                    onClick={() => concelApplication(_id)}
                  >
                    Отменить
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
