import React, { useState, useEffect, useRef } from "react";
import style from "./style.module.scss";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { addMonths } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Events = ({ userData }) => {
  const [events, setEvents] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addMonths(new Date(), 1),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [selectedDirection, setSelectedDirection] = useState("");
  const [dateFilterEnabled, setDateFilterEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/event/getAll`
        );

        if (response.status === 200) {
          setEvents(response.data);
          setLoadingEvents(false);
          return;
        }
      } catch (err) {
        setLoadingEvents(false);
        console.log(err);
        alert(`Произошла ошибка: ${err.response.data.message}`);
      }
    };

    getEvents();
  }, []);

  const monthNames = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const parseEventDate = (dateStr) => {
    // Разбиваем на дату и время
    const [datePart, timePart] = dateStr.split(", ");
    const [day, month, year] = datePart.split(".").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  const filteredEvents = events
    ? events.filter((event) => {
        const matchesDirection =
          selectedDirection === "" || event.directing === selectedDirection;

        const matchesSearch =
          searchQuery.trim() === "" ||
          event.name.toLowerCase().includes(searchQuery.toLowerCase());

        if (!dateFilterEnabled) return matchesDirection && matchesSearch;

        const eventStart = parseEventDate(event.start);
        const eventFinish = parseEventDate(event.finish);

        const inDateRange =
          eventFinish >= state[0].startDate && eventStart <= state[0].endDate;

        return matchesDirection && inDateRange && matchesSearch;
      })
    : [];

  function formatDateRange(startStr, finishStr) {
    const [startDatePart, startTimePart] = startStr.split(", ");
    const [finishDatePart, finishTimePart] = finishStr.split(", ");

    const [startDay, startMonth, startYear] = startDatePart
      .split(".")
      .map(Number);
    const [finishDay, finishMonth, finishYear] = finishDatePart
      .split(".")
      .map(Number);

    const startFormatted = `${startDay} ${
      monthNames[startMonth - 1]
    } ${startTimePart}`;
    const finishFormatted =
      startDay === finishDay && startMonth === finishMonth
        ? finishTimePart
        : `${finishDay} ${monthNames[finishMonth - 1]} ${finishTimePart}`;

    return `${startFormatted} - ${finishFormatted}`;
  }

  const formattedStart = format(state[0].startDate, "d MMMM yyyy", {
    locale: ru,
  });
  const formattedEnd = format(state[0].endDate, "d MMMM yyyy", { locale: ru });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const uniqueDirections = events
    ? Array.from(
        new Set(events.map((event) => event.directing).filter(Boolean))
      )
    : [];

  console.log(state);

  return (
    <section className={style.events} ref={ref}>
      <div className="container">
        <div className={style.events__wrapper}>
          {loadingEvents
            ? "Загрузка"
            : events && (
                <React.Fragment>
                  <div className={style.events__link}>
                    {(userData.role.toLowerCase() === "сотрудник в.о." ||
                      userData.role.toLowerCase() === "руководитель с.о." ||
                      userData.role.toLowerCase() === "зам. в.о." ||
                      userData.role.toLowerCase() === "руководитель в.о." ||
                      userData.role.toLowerCase() === "администратор") && (
                      <Link to="/create-event">Создание мероприятия</Link>
                    )}
                  </div>

                  <div className={style.events__content}>
                    <div className={style.events__filter}>
                      <input
                        type="text"
                        placeholder="Поиск"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />

                      <div style={{ position: "relative" }}>
                        <div className={style.events__filter__date}>
                          <button
                            onClick={() => setOpen(!open)}
                          >{`${formattedStart} - ${formattedEnd}`}</button>
                        </div>

                        {open && (
                          <div
                            style={{
                              position: "absolute",
                              zIndex: 10,
                              marginTop: "10px",
                              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                            }}
                          >
                            <DateRange
                              editableDateInputs={true}
                              onChange={(item) => {
                                setState([item.selection]);
                                setDateFilterEnabled(true); // ✅ включаем фильтр по дате
                              }}
                              moveRangeOnFirstSelection={false}
                              ranges={state}
                              locale={ru}
                            />
                          </div>
                        )}
                      </div>

                      <select
                        value={selectedDirection}
                        onChange={(e) => setSelectedDirection(e.target.value)}
                      >
                        <option value="">Направление</option>

                        {uniqueDirections.map((direction, index) => (
                          <option key={index} value={direction}>
                            {direction}
                          </option>
                        ))}
                      </select>
                    </div>

                    <ul>
                      {filteredEvents.length !== 0 &&
                        filteredEvents.map((item) => (
                          <li key={item._id}>
                            <Link to={`/event/${item._id}`}>
                              <p>{formatDateRange(item.start, item.finish)}</p>

                              <img
                                src={`${process.env.REACT_APP_SERVER_URL}${item.imagePath}`}
                                alt={item.name}
                              />
                              <div className={style.events__item__text}>
                                <h3>{item.name}</h3>
                                <div className={style.events__item__directing}>
                                  <p>{item.directing}</p>
                                </div>
                                <p>{item.place}</p>

                                {console.log(item.start, item.finish)}
                              </div>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </React.Fragment>
              )}
        </div>
      </div>
    </section>
  );
};

export default Events;
