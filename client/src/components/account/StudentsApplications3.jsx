import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";

const StudentsApplications = ({ userData }) => {
  const [applications, setApplications] = useState(null);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    const getStudentApplications = async () => {
      try {
        setLoadingApplications(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/directing/get-user-applications3`
        );
        setLoadingApplications(false);

        console.log(response);

        if (response.status === 200) {
          setApplications(response.data);
        }
      } catch (error) {
        setLoadingApplications(false);
        alert(`Произошла ошибка: ${error.response.data.message}`);
      }
    };

    getStudentApplications();
  }, []);

  const concelApplication = async (_id) => {
    try {
      const isConfirm = window.confirm(
        "Вы уверены что хотите отменить заявку?"
      );

      if (!isConfirm) return;

      const response = await axios.patch(
        `/directing/cancel-application/${_id}`
      );

      if (response.status === 200) {
        alert("Вы отменили заявку");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      alert("Не удалось отменить заявку");
    }
  };

  return (
    <div className={style.admins_directing}>
      <div className="container">
        <div
          className={`${style.admins_directing__wrapper} ${style.admins_directing__wrapper_2}`}
        >
          <h3>Вы подали заявку на направления:</h3>
          {loadingApplications ? (
            <p>Загрузка направлений...</p>
          ) : (
            applications && (
              <ul>
                {applications.map(
                  ({ name, description, _id, start, finish }) => (
                    <li key={_id}>
                      <Link to={`/directing/${_id}`}>
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
                  )
                )}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsApplications;
