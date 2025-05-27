import axios from "../../utils/axios";
import React, { useState, useEffect } from "react";
import style from "./style.module.scss";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import NotificationNoReload from "../../components/notification/NotificationNoReload";

const CreateEvent = ({ userData }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainImagePath, setMainImagePath] = useState(null);
  const [dateStart, setDateStart] = useState("");
  const [dateFinish, setDateFinish] = useState("");
  const [dateApplicationFinish, setApplicationDateFinish] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeFinish, setTimeFinish] = useState("");
  const [directing, setDirecting] = useState("");
  const [place, setPlace] = useState("");
  const [contact_name, setContact_name] = useState("");
  const [contact_email, setContact_email] = useState("");
  const [contact_work, setContact_work] = useState("");
  const [loadingOrganizers, setLoadingOrganizers] = useState(false);
  const [organizers, setOrganizers] = useState(null);

  const [showNotificationOrganizers, setShowNotificationOrganizers] =
    useState(false);

  const [admins, setAdmins] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !(
        userData.role.toLowerCase() === "зам. в.о." ||
        userData.role.toLowerCase() === "сотрудник в.о." ||
        userData.role.toLowerCase() === "администратор"
      )
    ) {
      navigate("/");
    }
  }, [userData]);

  useEffect(() => {
    const getAllOrganizers = async () => {
      try {
        setLoadingOrganizers(true);

        const getOrganizers = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/directing/get-organizers`
        );

        setLoadingOrganizers(false);
        setOrganizers(getOrganizers.data);
      } catch (error) {
        console.log(error);
        setLoadingOrganizers(false);
      }
    };

    getAllOrganizers();
  }, []);

  const uploadImage = async (acceptedFiles, setImagePath) => {
    const formData = new FormData();
    formData.append("image", acceptedFiles[0]);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/upload`,
        formData
      );

      setImagePath(response.data.path);
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
    }
  };

  const onDropMain = (acceptedFiles) =>
    uploadImage(acceptedFiles, setMainImagePath);

  const { getRootProps: getRootPropsMain, getInputProps: getInputPropsMain } =
    useDropzone({ onDrop: onDropMain });

  const createEvent = async () => {
    try {
      if (admins.length === 0) {
        setShowNotificationOrganizers(true);
      }

      const fetch = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/event/create`,
        {
          name: name,
          description: description,
          imagePath: mainImagePath,
          start: `${dateStart}, ${timeStart}`,
          finish: `${dateFinish}, ${timeFinish}`,
          finish_applications: dateApplicationFinish,
          directing: directing,
          place: place,
          contact_name: contact_name,
          contact_email: contact_email,
          contact_work: contact_work,
          admins: admins,
        }
      );

      if (fetch.status === 200) {
        navigate("/events");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addAdmin = (id) => {
    setAdmins((prevAdmins) => [...prevAdmins, id]);
  };

  const removeAdmin = (id) => {
    setAdmins((prevAdmins) => prevAdmins.filter((adminId) => adminId !== id));
  };

  return (
    <section className={style.create_direction}>
      {showNotificationOrganizers && (
        <NotificationNoReload
          title={"Ошибка!"}
          text={"Должен быть хотя бы 1 ответственный"}
          open={setShowNotificationOrganizers}
        />
      )}

      <div className="container">
        <div className={style.create_direction__wrapper}>
          <h1>Создание мероприятия</h1>

          <form>
            <input
              type="text"
              onChange={(event) => setName(event.target.value)}
              value={name}
              placeholder="Название направления"
            />
            <textarea
              onChange={(event) => setDescription(event.target.value)}
              value={description}
              placeholder="Описание"
            />

            <input
              type="text"
              onChange={(event) => setDirecting(event.target.value)}
              value={directing}
              placeholder="Направление (например, патриотическое)"
            />

            <input
              type="text"
              onChange={(event) => setPlace(event.target.value)}
              value={place}
              placeholder="Место проведения"
            />

            <input
              type="text"
              onChange={(event) => setContact_name(event.target.value)}
              value={contact_name}
              placeholder="Контактное имя"
            />

            <input
              type="text"
              onChange={(event) => setContact_email(event.target.value)}
              value={contact_email}
              placeholder="Контактный email"
            />

            <input
              type="text"
              onChange={(event) => setContact_work(event.target.value)}
              value={contact_work}
              placeholder="Контактное место работы"
            />

            <div>
              <p>Дата начала</p>
              <InputMask
                mask="99.99.9999"
                placeholder="ДД.ММ.ГГГГ"
                value={dateStart}
                onChange={(event) => setDateStart(event.target.value)}
              />
            </div>

            <div>
              <p>Время начала</p>
              <InputMask
                mask="99:99"
                placeholder="00:00"
                value={timeStart}
                onChange={(event) => setTimeStart(event.target.value)}
              />
            </div>

            <div>
              <p>Дата конца</p>
              <InputMask
                mask="99.99.9999"
                placeholder="ДД.ММ.ГГГГ"
                value={dateFinish}
                onChange={(event) => setDateFinish(event.target.value)}
              />
            </div>

            <div>
              <p>Время конца</p>
              <InputMask
                mask="99:99"
                placeholder="00:00"
                value={timeFinish}
                onChange={(event) => setTimeFinish(event.target.value)}
              />
            </div>

            <div>
              <p>Дата конца записи</p>
              <InputMask
                mask="99.99.9999"
                placeholder="ДД.ММ.ГГГГ"
                value={dateStart}
                onChange={(event) => setDateStart(event.target.value)}
              />
            </div>
          </form>

          <div className={style.create_direction__images}>
            <div className={style.create_direction__image}>
              <p>Изображение</p>

              <input id="main-image" {...getInputPropsMain()} />

              <label htmlFor="main-image">
                <div>
                  {mainImagePath ? (
                    <img
                      src={`${process.env.REACT_APP_SERVER_URL}${mainImagePath}`}
                      alt="main image"
                    />
                  ) : (
                    <p>Перетащите файл сюда или нажмите для выбора</p>
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className={style.create_direction__organizers}>
            <p>Добавить ответственных</p>

            {loadingOrganizers ? (
              <p>Загрузка руководителей...</p>
            ) : (
              organizers && (
                <ul>
                  {organizers.map(({ fullName, role, _id }) => (
                    <li key={_id}>
                      <div>
                        <p>{role}</p>
                        <p>{fullName}</p>
                      </div>

                      {admins.includes(_id) ? (
                        <button
                          onClick={() => removeAdmin(_id)}
                          style={{ backgroundColor: "red" }}
                        >
                          Удалить
                        </button>
                      ) : (
                        <button
                          onClick={() => addAdmin(_id)}
                          style={{ backgroundColor: "#009dff" }}
                        >
                          Добавить
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>

          <button onClick={createEvent}>Создать мероприятие</button>
        </div>
      </div>
    </section>
  );
};

export default CreateEvent;
