import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";

const StudentsEvents = ({ userData, userId }) => {
  const [applications, setApplications] = useState(null);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    const getStudentApplications = async () => {
      try {
        setLoadingApplications(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/event/get-user-events/${userId}`
        );
        setLoadingApplications(false);

        if (response.status === 200) {
          setApplications(response.data);
        }
      } catch (error) {
        setLoadingApplications(false);
        console.error("Ошибка загрузки файла:", error);
      }
    };

    getStudentApplications();
  }, []);

  return (
    <div className={style.admins_directing}>
      <div
        className={`${style.admins_directing__wrapper} ${style.admins_directing__wrapper_2}`}
      >
        <h3>Вы учавствуете:</h3>
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
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
};

export default StudentsEvents;
