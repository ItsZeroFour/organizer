import { Link, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import location from "../../assets/location.svg";
import clock from "../../assets/clock.svg";
import info from "../../assets/info.svg";

import user from "../../assets/user_2.svg";
import message from "../../assets/message.svg";
import bag from "../../assets/bag.svg";

const Event = ({ userData }) => {
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [membersFull, setMembersFull] = useState(null);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

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

  const concelApplication = async () => {
    try {
      const isConfirm = window.confirm(
        "Вы уверены что хотите отменить заявку?"
      );

      if (!isConfirm) return;

      const response = await axios.patch(`/event/cancel-application/${id}`);

      if (response.status === 200) {
        alert("Вы отменили заявку");
        console.log(123);

        // window.location.reload();
      } else {
        const response = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/event/cancel-from-applications`,
          {
            eventId: id,
            userId: userData._id,
          }
        );

        if (response.status === 200) {
          alert("Вы отменили заявку");
          window.location.reload();
        }
      }
    } catch (err) {
      console.log(err);
      alert("Не удалось отменить заявку");
    }
  };

  useEffect(() => {
    let interval;

    if (event && event.finish) {
      const updateTimer = () => {
        const [datePart, timePart] = event.finish.split(", ");
        const [day, month, year] = datePart.split(".");
        const [hours, minutes] = timePart.split(":");
        const finishDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );

        const now = new Date();
        const diff = finishDate - now;

        if (diff <= 0) {
          setTimeLeft("Срок завершён");
          clearInterval(interval);
          return;
        }

        const seconds = Math.floor((diff / 1000) % 60);
        const minutesLeft = Math.floor((diff / 1000 / 60) % 60);
        const hoursLeft = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));

        setTimeLeft(
          `${daysLeft} дн. ${hoursLeft} ч. ${minutesLeft} мин. ${seconds} сек.`
        );
      };

      updateTimer();
      interval = setInterval(updateTimer, 1000);
    }

    return () => clearInterval(interval);
  }, [event]);

  // url(${process.env.REACT_APP_SERVER_URL}${event.imagePath}

  return (
    <div className={style.event}>
      <div className={style.event__wrapper}>
        <div className="container">
          {loadingEvent
            ? "Загрузка..."
            : event && (
                <div className={style.event__content}>
                  <div className={style.event__head}>
                    <div className={style.event__head__wrapper}>
                      <div className={style.event__head__left}>
                        <h1>{event.name}</h1>
                        <p>{event.directing}</p>

                        <ul>
                          <li>
                            <div>
                              <img src={location} alt="location" />
                            </div>
                            <p>{event.place}</p>
                          </li>

                          <li>
                            <div>
                              <img src={clock} alt="clock" />
                            </div>
                            <p>
                              {event.start} - {event.finish}
                            </p>
                          </li>
                          <li>
                            <div>
                              <img src={info} alt="info" />
                            </div>
                            <p>До конца записи: {timeLeft}</p>
                          </li>
                        </ul>

                        {userData && userData.role === "Студент" && (
                          <React.Fragment>
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

                            {(event.userApplications.includes(userData._id) ||
                              event.applications.includes(userData._id)) && (
                              <button
                                onClick={concelApplication}
                                style={{ background: "red" }}
                              >
                                Отменить заявку
                              </button>
                            )}
                          </React.Fragment>
                        )}

                        {userData &&
                          (["Администратор", "Зам. в.о."].includes(
                            userData.role
                          ) ||
                            event.admins.includes(userData._id)) && (
                            <Link to={`/admin-event/${id}`}>Управлять</Link>
                          )}
                      </div>

                      <div className={style.event__head__right}>
                        <img
                          src={`${process.env.REACT_APP_SERVER_URL}${event.imagePath}`}
                          alt={event.name}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={style.event__main}>
                    <div className={style.event__main__wrapper}>
                      <h2>О мероприятии</h2>
                      <p>{event.description}</p>

                      <div className={style.event__contacts}>
                        <h2>Контакты</h2>

                        <ul>
                          <li>
                            <div>
                              <img src={user} alt="" />
                            </div>
                            <p>{event.contact_name}</p>
                          </li>

                          <li>
                            <div>
                              <img src={message} alt="" />
                            </div>
                            <p>{event.contact_email}</p>
                          </li>

                          <li>
                            <div>
                              <img src={bag} alt="" />
                            </div>
                            <p>{event.contact_work}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default Event;
