import { Link, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import React, { useEffect, useMemo, useState } from "react";
import style from "./style.module.scss";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import Notification from "../../components/notification/Notification";

const AdminEvent = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [finishTime, setFinishTime] = useState("");
  const [dateApplicationFinish, setApplicationDateFinish] = useState("");
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

  const [showPageIndex, setShowPageIndex] = useState(0);
  const [showExcelDownloadPage, setShowExcelDownloadPage] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    title: "",
    place: "",
    person: "",
    desc: "",
    count: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchMemberTerm, setSearchMemberTerm] = useState("");
  const [searchInviteTerm, setSearchInviteTerm] = useState("");
  const [searchInviteGroup, setSearchInviteGroup] = useState("");

  const [searchApplicationTerm, setSearchApplicationTerm] = useState("");
  const [searchApplicationGroup, setSearchApplicationGroup] = useState("");

  const [searchSentApplicationTerm, setSearchSentApplicationTerm] =
    useState("");
  const [searchSentApplicationTermGroup, setSearchSentApplicationTermGroup] =
    useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchGroupTerm, setSearchGroupTerm] = useState("");

  const [showNotificationDelete, setShowNotificationDelete] = useState(false);
  const [showNotificationUpdate, setShowNotificationUpdate] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();

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

          setApplicationDateFinish(response.data.finish_applications);

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
        return navigate("/");
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
          finish_applications: dateApplicationFinish,
          applications: applications,
          members: members,
          userApplications: userApplications,
          admins: admins,
        }
      );

      if (directing.status === 200) {
        setShowNotificationUpdate(true);
      }
    } catch (error) {
      console.log(error);
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
        console.error("Ошибка:", error);
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
        console.error("Ошибка загрузки файла:", error);
        setLoadingAdmins(false);
      }
    };

    getAdmins();
  }, []);

  const deleteEvent = async () => {
    try {
      // const isDelete = window.confirm("Вы точно хотите удалить мероприятие?");

      // if (!isDelete) return;

      const response = await axios.delete(`/event/delete/${id}`);

      if (response.status === 200) {
        setShowNotificationDelete(true);
        // navigate("/");
        // return window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value, // ВСЕГДА сохраняем строку, даже если это input type="number"
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataWithTitle = {
        ...formData,
        title: name,
        date: startDate,
        place: place,
        person: organizers.map(({ fullName }) => fullName).join(", "),
      };

      const response = await axios.post(
        `/excel-event/${id}`,
        formDataWithTitle,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "table.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Ошибка при создании или скачивании Excel:", err);
      setError("Не удалось создать Excel файл. Попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMembers = useMemo(() => {
    if (!Array.isArray(membersFull)) return [];

    const name = searchMemberTerm.toLowerCase();
    const group = searchGroupTerm.toLowerCase();

    return membersFull.filter(({ fullName, group: groupName }) => {
      const matchesName = fullName.toLowerCase().includes(name);
      const matchesGroup = groupName?.toLowerCase().includes(group);
      return matchesName && matchesGroup;
    });
  }, [searchMemberTerm, searchGroupTerm, membersFull]);

  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students)) return [];

    const name = searchInviteTerm.toLowerCase();
    const group = searchInviteGroup.toLowerCase();

    return students.filter(({ fullName, group: groupName }) => {
      const matchName = fullName.toLowerCase().includes(name);
      const matchGroup = groupName?.toLowerCase().includes(group);
      return matchName && matchGroup;
    });
  }, [students, searchInviteTerm, searchInviteGroup]);

  const filteredApplications = useMemo(() => {
    if (!Array.isArray(userApplicationsFull)) return [];

    const name = searchApplicationTerm.toLowerCase();
    const group = searchApplicationGroup.toLowerCase();

    return userApplicationsFull.filter(({ fullName, group: groupName }) => {
      const matchName = fullName.toLowerCase().includes(name);
      const matchGroup = groupName?.toLowerCase().includes(group);
      return matchName && matchGroup;
    });
  }, [userApplicationsFull, searchApplicationTerm, searchApplicationGroup]);

  const filteredApplications2 = useMemo(() => {
    if (!Array.isArray(applicationsFull)) return [];

    const name = searchSentApplicationTerm.toLowerCase();
    const group = searchSentApplicationTermGroup.toLowerCase();

    return applicationsFull.filter(({ fullName, group: groupName }) => {
      const matchName = fullName.toLowerCase().includes(name);
      const matchGroup = groupName?.toLowerCase().includes(group);
      return matchName && matchGroup;
    });
  }, [
    applicationsFull,
    searchSentApplicationTerm,
    searchSentApplicationTermGroup,
  ]);

  const filteredOrganizers = Array.isArray(organizers)
    ? organizers.filter(({ fullName }) =>
        fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
      {showNotificationDelete && (
        <Notification
          title={"Успешно!"}
          text={"Мероприятие удалено успешно!"}
        />
      )}

      {showNotificationUpdate && (
        <Notification
          title={"Успешно!"}
          text={"Мероприятие успешно обновлено!"}
        />
      )}

      <div className="container">
        {showExcelDownloadPage ? (
          <div className={style.admin_event__wrapper}>
            <div className={style.admin_event__excel}>
              <h3>Создание отчета для мероприятия</h3>

              <form>
                {/* <div>
                  <label htmlFor="date">Дата:</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div> */}

                {/* <div>
                  <label htmlFor="person">
                    Сотрудник воспитательного отдела:
                  </label>
                  <input
                    id="person"
                    name="person"
                    type="text"
                    value={formData.person}
                    onChange={handleChange}
                    required
                  />
                </div> */}

                <div>
                  <label htmlFor="desc">Описание мероприятия:</label>
                  <textarea
                    id="desc"
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="count">Человек присутствовало:</label>
                  <input
                    type="number"
                    id="count"
                    name="count"
                    value={formData.count}
                    onChange={handleChange}
                    required
                  />
                </div>
              </form>

              <p>Список учатсников:</p>

              {loadingMembers ? (
                <p>Загрузка...</p>
              ) : (
                <table>
                  <tr>
                    <th>№</th>
                    <th>ФИО</th>
                    <th>Телефон</th>
                    <th>Группа</th>
                  </tr>
                  {membersFull.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.fullName}</td>
                      <td>{item.phone || "-"}</td>
                      <td>{item.group || "-"}</td>
                    </tr>
                  ))}
                </table>
              )}

              <div className={style.admin_event__excel__buttons}>
                <button
                  onClick={() => setShowExcelDownloadPage(false)}
                  disabled={isLoading}
                >
                  Отмена
                </button>
                <button onClick={handleSubmit} disabled={isLoading}>
                  Создать отчет
                </button>
              </div>
            </div>
          </div>
        ) : (
          <React.Fragment>
            {showPageIndex === 0 ? (
              <div className={style.admin_event__wrapper}>
                <Link to="" onClick={() => navigate(-1)}>
                  Вернуться назад
                </Link>

                {loadingEvent ? (
                  <p>Загрузка...</p>
                ) : (
                  <div className={style.admin_event__main}>
                    <div className={style.admin_event__content}>
                      <div className={style.create_direction__people}>
                        <div className={style.create_direction__organizers}>
                          <button onClick={() => setShowPageIndex(1)}>
                            Участники мероприятия
                          </button>
                        </div>

                        <div className={style.create_direction__organizers}>
                          <button onClick={() => setShowPageIndex(2)}>
                            Пригласить на участие
                          </button>
                        </div>

                        <div className={style.create_direction__organizers}>
                          <button onClick={() => setShowPageIndex(3)}>
                            Ожидают принятия
                          </button>
                        </div>

                        <div className={style.create_direction__organizers}>
                          <button onClick={() => setShowPageIndex(4)}>
                            Приглашение отправлено
                          </button>
                        </div>

                        <div className={style.create_direction__organizers}>
                          <button onClick={() => setShowPageIndex(5)}>
                            Добавить ответственных
                          </button>
                        </div>
                      </div>

                      <form>
                        <input
                          type="text"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Название направления"
                        />
                        <textarea
                          value={description}
                          onChange={(event) =>
                            setDescription(event.target.value)
                          }
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
                          onChange={(event) =>
                            setContact_name(event.target.value)
                          }
                          value={contact_name}
                          placeholder="Контактное имя"
                        />
                        <input
                          type="text"
                          onChange={(event) =>
                            setContact_email(event.target.value)
                          }
                          value={contact_email}
                          placeholder="Контактный email"
                        />
                        <input
                          type="text"
                          onChange={(event) =>
                            setContact_work(event.target.value)
                          }
                          value={contact_work}
                          placeholder="Контактное место работы"
                        />
                        <div>
                          <p>Дата начала</p>
                          <InputMask
                            mask="99.99.9999"
                            placeholder="ДД.ММ.ГГГГ"
                            value={startDate}
                            onChange={(event) =>
                              setStartDate(event.target.value)
                            }
                          />
                        </div>
                        <div>
                          <p>Время начала</p>
                          <InputMask
                            mask="99:99"
                            placeholder="00:00"
                            value={startTime}
                            onChange={(event) =>
                              setStartTime(event.target.value)
                            }
                          />
                        </div>
                        <div>
                          <p>Дата конца</p>
                          <InputMask
                            mask="99.99.9999"
                            placeholder="ДД.ММ.ГГГГ"
                            value={finishDate}
                            onChange={(event) =>
                              setFinishDate(event.target.value)
                            }
                          />
                        </div>
                        <div>
                          <p>Время конца</p>
                          <InputMask
                            mask="99:99"
                            placeholder="00:00"
                            value={finishTime}
                            onChange={(event) =>
                              setFinishTime(event.target.value)
                            }
                          />
                        </div>
                        <div>
                          <p>Дата конца записи</p>
                          <InputMask
                            mask="99.99.9999"
                            placeholder="ДД.ММ.ГГГГ"
                            value={dateApplicationFinish}
                            onChange={(event) =>
                              setApplicationDateFinish(event.target.value)
                            }
                          />
                        </div>{" "}
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
                                <p>
                                  Перетащите файл сюда или нажмите для выбора
                                </p>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className={style.admin_event__buttons}>
                      <button
                        onClick={() => setShowExcelDownloadPage(true)}
                        // to={`${process.env.REACT_APP_SERVER_URL}/excel-event/${id}`}
                      >
                        Создать отчет
                      </button>

                      <button onClick={updateEvent}>Обновить</button>
                      <button onClick={deleteEvent}>Удалить мероприятие</button>
                    </div>
                  </div>
                )}
              </div>
            ) : showPageIndex === 1 ? (
              <div className={style.admin_direction__wrapper}>
                <div className={style.admin_direction__content}>
                  <button onClick={() => setShowPageIndex(0)}>
                    Вернуться назад
                  </button>

                  <h2>Участники мероприятия</h2>

                  <div>
                    <input
                      type="text"
                      placeholder="Поиск..."
                      value={searchMemberTerm}
                      onChange={(e) => setSearchMemberTerm(e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="Поиск по группе..."
                      value={searchGroupTerm}
                      onChange={(e) => setSearchGroupTerm(e.target.value)}
                    />
                  </div>

                  {loadingMembers ? (
                    <p>Загрузка участников...</p>
                  ) : (
                    filteredMembers && (
                      <ul>
                        {filteredMembers.map(({ fullName, role, _id }) => (
                          <li key={_id}>
                            <div>
                              <Link to={`/user/${_id}`}>
                                {/* <p>{role}</p> */}
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
              </div>
            ) : showPageIndex === 2 ? (
              <div className={style.admin_direction__wrapper}>
                <div className={style.admin_direction__content}>
                  <button onClick={() => setShowPageIndex(0)}>
                    Вернуться назад
                  </button>

                  <h2>Пригласить на участие</h2>

                  <div>
                    <input
                      type="text"
                      placeholder="Поиск..."
                      value={searchInviteTerm}
                      onChange={(e) => setSearchInviteTerm(e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="Поиск по группе..."
                      value={searchInviteGroup}
                      onChange={(e) => setSearchInviteGroup(e.target.value)}
                    />
                  </div>

                  {loadingStudents ? (
                    <p>Загрузка студентов...</p>
                  ) : (
                    filteredStudents && (
                      <ul>
                        {filteredStudents.map(({ fullName, role, _id }) => (
                          <li key={_id}>
                            <div>
                              <Link to={`/user/${_id}`}>
                                {/* <p>{role}</p> */}
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
            ) : showPageIndex === 3 ? (
              <div className={style.admin_direction__wrapper}>
                <div className={style.admin_direction__content}>
                  <button onClick={() => setShowPageIndex(0)}>
                    Вернуться назад
                  </button>

                  <h2>Ожидают принятия</h2>

                  <div>
                    <input
                      type="text"
                      placeholder="Поиск..."
                      value={searchApplicationTerm}
                      onChange={(e) => setSearchApplicationTerm(e.target.value)}
                    />

                    <input
                      type="text"
                      placeholder="Поиск по группе..."
                      value={searchApplicationGroup}
                      onChange={(e) =>
                        setSearchApplicationGroup(e.target.value)
                      }
                    />
                  </div>

                  {loadingUserApplicationsFull ? (
                    <p>Загрузка...</p>
                  ) : (
                    filteredApplications && (
                      <ul>
                        {filteredApplications.map(({ fullName, role, _id }) => (
                          <li key={_id}>
                            <div>
                              <Link to={`/user/${_id}`}>
                                {/* <p>{role}</p> */}
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
              </div>
            ) : showPageIndex === 4 ? (
              <div className={style.admin_direction__wrapper}>
                <div className={style.admin_direction__content}>
                  <button onClick={() => setShowPageIndex(0)}>
                    Вернуться назад
                  </button>

                  <h2>Приглашение отправлено</h2>

                  <div>
                    <input
                      type="text"
                      placeholder="Поиск..."
                      value={searchSentApplicationTerm}
                      onChange={(e) =>
                        setSearchSentApplicationTerm(e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Поиск по группе..."
                      value={searchSentApplicationTermGroup}
                      onChange={(e) =>
                        setSearchSentApplicationTermGroup(e.target.value)
                      }
                    />
                  </div>

                  {loadingApplications ? (
                    <p>Загрузка...</p>
                  ) : (
                    filteredApplications2 && (
                      <ul>
                        {filteredApplications2.map(
                          ({ fullName, role, _id }) => (
                            <li key={_id}>
                              <div>
                                <Link to={`/user/${_id}`}>
                                  {/* <p>{role}</p> */}
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
                          )
                        )}
                      </ul>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className={style.admin_direction__wrapper}>
                <div className={style.admin_direction__content}>
                  <button onClick={() => setShowPageIndex(0)}>
                    Вернуться назад
                  </button>

                  <h2>Добавить ответственных</h2>

                  <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  {loadingAdmins ? (
                    <p>Загрузка руководителей...</p>
                  ) : (
                    filteredOrganizers && (
                      <ul>
                        {filteredOrganizers.map(({ fullName, role, _id }) => (
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
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </section>
  );
};

export default AdminEvent;
