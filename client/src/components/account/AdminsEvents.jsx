import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";

const AdminsDirecting = ({ userId }) => {
  const [adminsDirecting, setAdminsDirecting] = useState(null);
  const [adminsDirectindLoading, setAdminsDirectindLoading] = useState(false);

  useEffect(() => {
    const getAdminsDirecting = async () => {
      try {
        setAdminsDirectindLoading(true);
        const getData = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/event/get-admins-events/${userId}`
        );
        setAdminsDirectindLoading(false);

        if (getData.status === 200) {
          setAdminsDirecting(getData.data);
        }
      } catch (error) {
        setAdminsDirectindLoading(false);
        alert(`Произошла ошибка: ${error.response.data.message}`);
        console.error("Ошибка загрузки файла:", error);
      }
    };

    getAdminsDirecting();
  }, []);

  return (
    <div className={style.admins_directing}>
      <div className="container">
        <div className={style.admins_directing__wrapper}>
          <h3>Мои мероприятия:</h3>
          {adminsDirectindLoading ? (
            <p>Загрузка мероприятий...</p>
          ) : (
            adminsDirecting && (
              <ul>
                {adminsDirecting.map(({ name, description, _id }) => (
                  <li key={_id}>
                    <Link to={`/event/${_id}`}>
                      <h3>{name}</h3>
                      <p>
                        {description.length > 200
                          ? `${description.slice(0, 200)}...`
                          : description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminsDirecting;
