import { Link, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import React, { useEffect, useState } from "react";
import style from "./style.module.scss";

const Event = ({ userData }) => {
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [membersFull, setMembersFull] = useState(null);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const getEvent = async () => {
      try {
        setLoadingEvent(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/event/get/${id}`
        );

        console.log(response);

        if (response.status === 200) {
          setEvent(response.data);
          setLoadingEvent(false);
        }
      } catch (error) {
        console.log(error);
        setLoadingEvent(false);
        alert(`Произошла ошибка: ${error.response.data.message}`);
      }
    };

    getEvent();
  }, []);

  useEffect(() => {
    const getMembers = async () => {
      try {
        setLoadingMembers(true);

        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/event/get-members/${id}`
        );

        if (response.status === 200) {
          setMembersFull(response.data);
          setLoadingMembers(false);
        }
      } catch (error) {
        console.log(error);
        setLoadingMembers(false);
        alert(`Произошла ошибка: ${error?.response?.data.message}`);
      }
    };

    getMembers();
  }, []);

  const handleJoinEvent = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/event/add-to-userapplications/${id}`
      );

      if (response.status === 200) {
        alert("Заявка успешно подана!");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      alert(`Произошла ошибка: ${error.response.data.message}`);
    }
  };

  return (
    <div className={style.event}>
      <div className={style.event__wrapper}>
        {loadingEvent
          ? "Загрузка..."
          : event && (
              <React.Fragment>
                <div
                  className={style.event__head}
                  style={{
                    backgroundImage: `url(${process.env.REACT_APP_SERVER_URL}${event.imagePath}`,
                  }}
                >
                  <div className="container">
                    <div className={style.event__head__wrapper}>
                      <h1>{event.name}</h1>
                      <p>{event.description}</p>

                      {userData && userData.role === "Студент" && (
                        <button
                          onClick={handleJoinEvent}
                          disabled={
                            event.userApplications.includes(userData._id) ||
                            event.members.includes(userData._id) ||
                            event.applications.includes(userData._id)
                          }
                        >
                          {event.applications.includes(userData._id) ||
                          event.userApplications.includes(userData._id)
                            ? "Ожидание подтверждения"
                            : event.members.includes(userData._id)
                            ? "Вы уже записаны"
                            : "Записаться"}
                        </button>
                      )}

                      {userData &&
                        (["Администратор", "зам. в.о."].includes(
                          userData.role
                        ) ||
                          event.admins.includes(userData._id)) && (
                          <Link to={`/admin-event/${id}`}>Управлять</Link>
                        )}
                    </div>
                  </div>
                </div>

                <div className={style.event__main}>
                  <div className="container">
                    <div className={style.event__main__wrapper}>
                      <p>
                        Время проведения: {event.start} - {event.finish}
                      </p>

                      {/* <div className={style.event__members}>
                        <h2>Участники:</h2>

                        {loadingMembers
                          ? "Загрузка..."
                          : membersFull && (
                              <ul>
                                {membersFull.map((item) => (
                                  <li key={item._id}>
                                    <Link to={`/user/${item._id}`}>
                                      <h3>{item.fullName}</h3>
                                      <p>Группа: {item.group}</p>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                      </div> */}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
      </div>
    </div>
  );
};

export default Event;
