import { Link, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";

const AdminEvent = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [finishTime, setFinishTime] = useState("");
  const [members, setMembers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [imagePath, setImagePath] = useState("");

  const [membersFull, setMembersFull] = useState(null);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [applicationsFull, setApplicationsFull] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const [loadingEvent, setLoadingEvent] = useState(false);

  const [userApplications, setUserApplications] = useState([]);
  const [userApplicationsFull, setUserApplicationsFull] = useState(null);
  const [loadingUserApplicationsFull, setLoadingUserApplicationsFull] =
    useState(false);

  const [loadingAdmins, setLoadingAdmins] = useState(false);

  const [directing, setDirecting] = useState("");
  const [place, setPlace] = useState("");
  const [contact_name, setContact_name] = useState("");
  const [contact_email, setContact_email] = useState("");
  const [contact_work, setContact_work] = useState("");
  const [loadingOrganizers, setLoadingOrganizers] = useState(false);
  const [organizers, setOrganizers] = useState(null);

  const [admins, setAdmins] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const getEvent = async () => {
      try {
        setLoadingEvent(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/event/get/${id}`
        );

        if (response.status === 200) {
          setName(response.data.name);
          setMembers(response.data.members);
          setApplications(response.data.applications);
          setImagePath(response.data.imagePath);
          setDescription(response.data.description);
          setUserApplications(response.data.userApplications);

          setDirecting(response.data.directing);
          setPlace(response.data.place);
          setContact_name(response.data.contact_name);
          setContact_email(response.data.contact_email);
          setContact_work(response.data.contact_work);

          const [startDate, startTime] = response.data.start.split(", ");
          setStartDate(startDate);
          setStartTime(startTime);

          const [finishDate, finishTime] = response.data.finish.split(", ");
          setFinishDate(finishDate);
          setFinishTime(finishTime);

          setLoadingEvent(false);
        }
      } catch (error) {
        console.log(error);
        setLoadingEvent(false);
        alert(`Произошла ошибка: ${error?.response?.data.message}`);
      }
    };

    getEvent();
  }, []);

  const updateEvent = async () => {
    try {
      const directing = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/event/update/${id}`,
        {
          name: name,
          description: description,
          imagePath: imagePath,
          start: `${startDate}, ${startTime}`,
          finish: `${finishDate}, ${finishTime}`,
          applications: applications,
          members: members,
          userApplications: userApplications,
          admins: admins,
        }
      );

      if (directing.status === 200) {
        alert("Мероприятие успешно обновлено!");
      }
    } catch (error) {
      console.log(error);
      alert(`Произошла ошибка: ${error?.response?.data.message}`);
    }
  };

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

  useEffect(() => {
    const getMembers = async () => {
      try {
        setLoadingUserApplicationsFull(true);

        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/event/get-user-applications-full/${id}`
        );

        if (response.status === 200) {
          setUserApplicationsFull(response.data);
          setLoadingUserApplicationsFull(false);
        }
      } catch (error) {
        console.log(error);
        setLoadingUserApplicationsFull(false);
        alert(`Произошла ошибка: ${error?.response?.data.message}`);
      }
    };

    getMembers();
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
      alert(`Произошла ошибка: ${error?.response?.data.message}`);
      console.error("Ошибка загрузки файла:", error);
    }
  };

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
        alert(`Произошла ошибка: ${error?.response?.data.message}`);
      }
    };

    getAllOrganizers();
  }, []);

  useEffect(() => {
    const getStudents = async () => {
      try {
        setLoadingStudents(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/event/get-students/${id}`
        );

        if (response.status === 200) {
          setStudents(response.data);
          setLoadingStudents(false);
        }
      } catch (error) {
        alert(`Произошла ошибка: ${error?.response?.data.message}`);
        console.error("Ошибка загрузки файла:", error);
        setLoadingStudents(false);
      }
    };

    getStudents();
  }, []);

  useEffect(() => {
    const getApplications = async () => {
      try {
        setLoadingApplications(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/event/get-applications/${id}`
        );

        if (response.status === 200) {
          setApplicationsFull(response.data);
          setLoadingApplications(false);
        }
      } catch (error) {
        alert(`Произошла ошибка: ${error?.response?.data.message}`);
        console.error("Ошибка загрузки файла:", error);
        setLoadingApplications(false);
      }
    };

    getApplications();
  }, []);

  useEffect(() => {
    const getAdmins = async () => {
      try {
        setLoadingAdmins(true);
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/event/get-admins/${id}`
        );

        if (response.status === 200) {
          setAdmins(response.data);
          setLoadingAdmins(false);
        }
      } catch (error) {
        alert(`Произошла ошибка: ${error?.response?.data.message}`);
        console.error("Ошибка загрузки файла:", error);
        setLoadingAdmins(false);
      }
    };

    getAdmins();
  }, []);

  const onDropMain = (acceptedFiles) =>
    uploadImage(acceptedFiles, setImagePath);

  const { getRootProps: getRootPropsMain, getInputProps: getInputPropsMain } =
    useDropzone({ onDrop: onDropMain });

  const addMember = (id) => {
    setMembers((prevAdmins) => [...prevAdmins, id]);
  };

  const removeMember = (id) => {
    setMembers((prevAdmins) => prevAdmins.filter((adminId) => adminId !== id));
  };

  const addApplications = (id) => {
    setApplications((prevAdmins) => [...prevAdmins, id]);
  };

  const removeApplications = (id) => {
    setApplications((prevAdmins) =>
      prevAdmins.filter((adminId) => adminId !== id)
    );
  };

  const addStudent = (id) => {
    setApplications((prevAdmins) => [...prevAdmins, id]);
  };

  const removeStudent = (id) => {
    setApplications((prevAdmins) =>
      prevAdmins.filter((adminId) => adminId !== id)
    );
  };

  const addStudentApplications = (id) => {
    setMembers((prevAdmins) => [...prevAdmins, id]);
    setUserApplications((prevApplications) =>
      prevApplications.filter((applicationId) => applicationId !== id)
    );
  };

  const removeStudentApplications = (id) => {
    setMembers((prevAdmins) => prevAdmins.filter((adminId) => adminId !== id));
  };

  const addAdmin = (id) => {
    setAdmins((prevAdmins) => [...prevAdmins, id]);
  };

  const removeAdmin = (id) => {
    setAdmins((prevAdmins) => prevAdmins.filter((adminId) => adminId !== id));
  };

  return (
    <section className={style.admin_event}>
      <div className="container">
        <div className={style.admin_event__wrapper}>
          {loadingEvent ? (
            <p>Загрузка...</p>
          ) : (
            <React.Fragment>
              <form>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Название направления"
                />
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
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
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </div>

                <div>
                  <p>Время начала</p>
                  <InputMask
                    mask="99:99"
                    placeholder="00:00"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                  />
                </div>

                <div>
                  <p>Дата конца</p>
                  <InputMask
                    mask="99.99.9999"
                    placeholder="ДД.ММ.ГГГГ"
                    value={finishDate}
                    onChange={(event) => setFinishDate(event.target.value)}
                  />
                </div>

                <div>
                  <p>Время конца</p>
                  <InputMask
                    mask="99:99"
                    placeholder="00:00"
                    value={finishTime}
                    onChange={(event) => setFinishTime(event.target.value)}
                  />
                </div>
              </form>

              <div className={style.create_direction__images}>
                <div className={style.create_direction__image}>
                  <p>Изображение</p>

                  <input id="main-image" {...getInputPropsMain()} />

                  <label htmlFor="main-image">
                    <div>
                      {imagePath ? (
                        <img
                          src={`${process.env.REACT_APP_SERVER_URL}${imagePath}`}
                          alt="main image"
                        />
                      ) : (
                        <p>Перетащите файл сюда или нажмите для выбора</p>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className={style.create_direction__people}>
                <div className={style.create_direction__organizers}>
                  <p>Участники мероприятия</p>

                  {loadingMembers ? (
                    <p>Загрузка участников...</p>
                  ) : (
                    membersFull && (
                      <ul>
                        {membersFull.map(({ fullName, role, _id }) => (
                          <li key={_id}>
                            <div>
                              <Link to={`/user/${_id}`}>
                                <p>{role}</p>
                                <p>{fullName}</p>
                              </Link>
                            </div>

                            {members.includes(_id) ? (
                              <button
                                onClick={() => removeMember(_id)}
                                style={{ backgroundColor: "red" }}
                              >
                                Удалить
                              </button>
                            ) : (
                              <button
                                onClick={() => addMember(_id)}
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

                <div className={style.create_direction__organizers}>
                  <p>Пригласить на участие</p>

                  {loadingStudents ? (
                    <p>Загрузка студентов...</p>
                  ) : (
                    students && (
                      <ul>
                        {students.map(({ fullName, role, _id }) => (
                          <li key={_id}>
                            <div>
                              <Link to={`/user/${_id}`}>
                                <p>{role}</p>
                                <p>{fullName}</p>
                              </Link>
                            </div>

                            {applications.includes(_id) ? (
                              <button
                                onClick={() => removeStudent(_id)}
                                style={{ backgroundColor: "red" }}
                              >
                                Удалить
                              </button>
                            ) : (
                              <button
                                onClick={() => addStudent(_id)}
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
              </div>

              <div className={style.create_direction__people}>
                <div className={style.create_direction__organizers}>
                  <p>Ожидают принятия</p>

                  {loadingUserApplicationsFull ? (
                    <p>Загрузка...</p>
                  ) : (
                    userApplicationsFull && (
                      <ul>
                        {userApplicationsFull.map(({ fullName, role, _id }) => (
                          <li key={_id}>
                            <div>
                              <Link to={`/user/${_id}`}>
                                <p>{role}</p>
                                <p>{fullName}</p>
                              </Link>
                            </div>

                            {members.includes(_id) ? (
                              <button
                                onClick={() => removeStudentApplications(_id)}
                                style={{ backgroundColor: "red" }}
                              >
                                Удалить
                              </button>
                            ) : (
                              <button
                                onClick={() => addStudentApplications(_id)}
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

                <div className={style.create_direction__organizers}>
                  <p>Приглашение отправлено</p>

                  {loadingApplications ? (
                    <p>Загрузка...</p>
                  ) : (
                    applicationsFull && (
                      <ul>
                        {applicationsFull.map(({ fullName, role, _id }) => (
                          <li key={_id}>
                            <div>
                              <Link to={`/user/${_id}`}>
                                <p>{role}</p>
                                <p>{fullName}</p>
                              </Link>
                            </div>

                            {applications.includes(_id) ? (
                              <button
                                onClick={() => removeApplications(_id)}
                                style={{ backgroundColor: "red" }}
                              >
                                Удалить
                              </button>
                            ) : (
                              <button
                                onClick={() => addApplications(_id)}
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
              </div>

              <div className={style.create_direction__organizers}>
                <p>Добавить ответственных</p>

                {loadingAdmins ? (
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

              <Link
                to={`${process.env.REACT_APP_SERVER_URL}/excel-event/${id}`}
                target="_blank"
              >
                Скачать Excel
              </Link>

              <button onClick={updateEvent}>Обновить</button>
            </React.Fragment>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminEvent;
