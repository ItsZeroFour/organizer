import React, { useEffect, useState, useCallback } from "react";
import style from "./style.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { useDropzone } from "react-dropzone";
import Notification from "../../components/notification/Notification";
import NotificationNoReload from "../../components/notification/NotificationNoReload";

const AdminDirecting = ({ userData }) => {
  const [directing, setDirecting] = useState(null);
  const [loadingDirecting, setLoadingDirecting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [secondDescription, setSecondDescription] = useState("");
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [membersFull, setMembersFull] = useState([]);

  const [imagePath, setImagePath] = useState("");
  const [secondImagePath, setSecondImagePath] = useState("");
  const [gallery, setGallery] = useState([]);

  const [applications, setApplications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const [organizers, setOrganizers] = useState(null);
  const [loadingOrganizers, setLoadingOrganizers] = useState(false);
  const [loadingStudens, setLoadingStudens] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [showPageIndex, setShowPageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMemberTerm, setSearchMemberTerm] = useState("");
  const [searchOrganizerTerm, setSearchOrganizerTerm] = useState("");

  const [showNotificationUpdate, setShowNotificationUpdate] = useState(false);
  const [showNotificationDelete, setShowNotificationDelete] = useState(false);
  const [showNotificationAddUser, setShowNotificationAddUser] = useState(false);
  const [showNotificationRemoveUser, setShowNotificationRemoveUser] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchDirecting = useCallback(async () => {
    try {
      setLoadingDirecting(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/directing/get-directing/${id}`
      );
      setDirecting(response.data);

      if (!response.data) navigate("/");
    } catch (error) {
      console.error("Ошибка", error);
      navigate("/");
    } finally {
      setLoadingDirecting(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDirecting();
  }, [fetchDirecting]);

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
    // Проверяем, загружены ли данные
    if (!userData || !directing) {
      return; // Ждем загрузки данных, ничего не делаем
    }

    // Проверяем условия доступа
    const isAdmin =
      userData.role?.toLowerCase() === "администратор" ||
      userData.role?.toLowerCase() === "зам. в.о.";
    const isDirectionAdmin = directing.admins?.includes(userData._id);

    // Если пользователь не имеет прав доступа - перенаправляем
    if (!isAdmin && !isDirectionAdmin) {
      navigate("/");
      return;
    }

    // Если есть права доступа - заполняем данные
    setName(directing.name);
    setDescription(directing.description);
    setSecondDescription(directing.secondDescription);
    setAdmins(directing.admins);
    setImagePath(directing.imagePath);
    setSecondImagePath(directing.secondImagePath);
    setGallery(directing.gallery);
    setSkills(directing.skills);
  }, [directing, userData, navigate]);

  useEffect(() => {
    const getApplicationUsers = async () => {
      try {
        setLoadingStudens(true);
        const data = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/directing/get-applications/${id}`
        );
        setLoadingStudens(false);

        if (data.status === 200) {
          setApplications(data.data);
        }
      } catch (error) {
        setLoadingStudens(false);

        console.log(error);
      }
    };

    getApplicationUsers();
  }, []);

  useEffect(() => {
    const getMembersUsers = async () => {
      try {
        setLoadingMembers(true);
        const data = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/directing/get-members/${id}`
        );
        setLoadingMembers(false);

        if (data.status === 200) {
          setMembersFull(data.data);
        }
      } catch (error) {
        setLoadingMembers(false);

        console.log(error);
      }
    };

    getMembersUsers();
  }, []);

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/excel-direction-members/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "участники-направления.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Ошибка при скачивании файла:", err);
      setError("Ошибка при скачивании файла");
    } finally {
      setIsLoading(false);
    }
  };

  const updateDirecting = async () => {
    try {
      setSaving(true);
      const data = await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/directing/update/${directing._id}`,
        {
          name,
          description,
          secondDescription,
          admins,
          imagePath,
          secondImagePath,
          gallery,
          applications,
          members,
          skills,
        }
      );
      setSaving(false);

      if (data.status === 200) {
        setShowNotificationUpdate(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async (acceptedFiles, setNewImagePath) => {
    const formData = new FormData();
    formData.append("image", acceptedFiles[0]);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/upload`,
        formData
      );

      setNewImagePath(response.data.path);
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
    }
  };

  const filteredApplications = Array.isArray(applications)
    ? applications.filter(({ fullName }) =>
        fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const filteredMembers = Array.isArray(membersFull)
    ? membersFull.filter(({ fullName }) =>
        fullName.toLowerCase().includes(searchMemberTerm.toLowerCase())
      )
    : [];

  const filteredOrganizers = Array.isArray(organizers)
    ? organizers.filter(({ fullName }) =>
        fullName.toLowerCase().includes(searchOrganizerTerm.toLowerCase())
      )
    : [];

  const uploadGalleryImages = async (acceptedFiles) => {
    const uploadedPaths = await Promise.all(
      acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/upload`,
            formData
          );
          return response.data.path;
        } catch (error) {
          console.error("Ошибка загрузки файла:", error);
          return null;
        }
      })
    );
    setGallery((prevGallery) => [
      ...prevGallery,
      ...uploadedPaths.filter(Boolean),
    ]);
  };

  const deleteDirection = async () => {
    try {
      // const isDelete = window.confirm("Вы точно хотите удалить направление?");

      // if (!isDelete) return;

      const response = await axios.delete(`/directing/delete/${id}`);

      if (response.status === 200) {
        setShowNotificationDelete(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const downloadExcelData = async () => {
  //   try {
  //     await axios.post(`${process.env.REACT_APP_SERVER_URL}/excel-direction/${id}`);
  //   } catch (error) {
  //     console.error("Ошибка загрузки файла:", error);
  //   }
  // };

  const removeImageFromGallery = (index) => {
    setGallery((prevGallery) => prevGallery.filter((_, i) => i !== index));
  };

  const onDropMain = (acceptedFiles) =>
    uploadImage(acceptedFiles, setImagePath);
  const onDropSecond = (acceptedFiles) =>
    uploadImage(acceptedFiles, setSecondImagePath);

  const {
    getRootProps: getRootPropsGallery,
    getInputProps: getInputPropsGallery,
  } = useDropzone({ onDrop: uploadGalleryImages });

  const { getRootProps: getRootPropsMain, getInputProps: getInputPropsMain } =
    useDropzone({ onDrop: onDropMain });
  const {
    getRootProps: getRootPropsSecond,
    getInputProps: getInputPropsSecond,
  } = useDropzone({ onDrop: onDropSecond });

  const addAdmin = (id) => {
    setAdmins((prevAdmins) => [...prevAdmins, id]);
  };

  const removeAdmin = (id) => {
    setAdmins((prevAdmins) => prevAdmins.filter((adminId) => adminId !== id));
  };

  const addMember = (id) => {
    setMembers((prevMembers) => [...prevMembers, id]);
    setApplications((prevApplications) =>
      prevApplications.filter((application) => application._id !== id)
    );
    setShowNotificationAddUser(true);
  };

  const removeMember = (id) => {
    setMembers((prevMembers) =>
      prevMembers.filter((memberId) => memberId !== id)
    );

    setShowNotificationRemoveUser(true);
  };

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills((prevSkills) => [...prevSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setSkills((prevSkills) => prevSkills.filter((_, i) => i !== index));
  };

  return (
    <section className={style.admin_direction}>
      {showNotificationDelete && (
        <Notification
          title={"Успешно!"}
          text={"Студенческое объединение удалено успешно!"}
        />
      )}

      {showNotificationUpdate && (
        <Notification
          title={"Успешно!"}
          text={"Студенческое объединение обновлено успешно!"}
        />
      )}

      {showNotificationAddUser && (
        <NotificationNoReload
          title={"Успешно!"}
          text={"Успешно добавлен! Не забудьте сохранить изменения"}
          open={setShowNotificationAddUser}
        />
      )}

      {showNotificationRemoveUser && (
        <NotificationNoReload
          title={"Успешно!"}
          text={"Успешно удален! Не забудьте сохранить изменения"}
          open={setShowNotificationRemoveUser}
        />
      )}

      <div className="container">
        {showPageIndex === 0 ? (
          <div className={style.admin_direction__wrapper}>
            <Link to="" onClick={() => navigate(-1)}>
              Вернуться назад
            </Link>

            {loadingDirecting ? (
              <p>Загрузка...</p>
            ) : (
              directing &&
              userData &&
              (userData?.role.toLowerCase() === "администратор" ||
                userData?.role.toLowerCase() === "зам. в.о." ||
                directing.admins.includes(userData._id)) && (
                <div className={style.admin_direction__main}>
                  <div>
                    <div className={style.admin_direction__people}>
                      {(userData.role.toLowerCase() === "зам. в.о." ||
                        userData.role.toLowerCase() === "администратор") && (
                        <div className={style.create_direction__organizers}>
                          <button onClick={() => setShowPageIndex(1)}>
                            Добавить руководителей
                          </button>
                        </div>
                      )}

                      {directing?.admins?.includes(userData._id) ||
                        ((userData.role?.toLowerCase() === "администратор" ||
                          userData.role?.toLowerCase() === "зам. в.о." ||
                          userData.role?.toLowerCase() === "сотрудник в.о." ||
                          userData.role?.toLowerCase() ===
                            "руководитель с.о.") && (
                          <div className={style.create_direction__organizers}>
                            <button onClick={() => setShowPageIndex(2)}>
                              Входящие заявки студентов
                            </button>
                          </div>
                        ))}

                      {directing?.admins?.includes(userData._id) ||
                        ((userData.role?.toLowerCase() === "администратор" ||
                          userData.role?.toLowerCase() === "зам. в.о." ||
                          userData.role?.toLowerCase() === "сотрудник в.о." ||
                          userData.role?.toLowerCase() ===
                            "руководитель с.о.") && (
                          <div className={style.create_direction__organizers}>
                            <button onClick={() => setShowPageIndex(3)}>
                              Участники направления
                            </button>
                          </div>
                        ))}
                    </div>

                    <form>
                      <div>
                        <p>Название студенческого объединения</p>
                        <input
                          type="text"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                        />
                      </div>

                      <div>
                        <p>Основное описание</p>
                        <textarea
                          value={description}
                          onChange={(event) =>
                            setDescription(event.target.value)
                          }
                        />
                      </div>

                      <div>
                        <p>Следующее описание</p>
                        <textarea
                          value={secondDescription}
                          onChange={(event) =>
                            setSecondDescription(event.target.value)
                          }
                        />
                      </div>
                    </form>

                    <div className={style.create_direction__images}>
                      <div className={style.create_direction__image}>
                        <p>Главное изображение</p>

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

                      <div className={style.create_direction__image}>
                        <p>Второе изображение</p>

                        <input id="second-image" {...getInputPropsSecond()} />

                        <label htmlFor="second-image">
                          <div>
                            {secondImagePath ? (
                              <img
                                src={`${process.env.REACT_APP_SERVER_URL}${secondImagePath}`}
                                alt="second image"
                              />
                            ) : (
                              <p>Перетащите файл сюда или нажмите для выбора</p>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className={style.create_direction__gallery}>
                      <p>Галерея</p>
                      <div className={style.create_direction__image}>
                        <input id="gallery" {...getInputPropsGallery()} />
                        <label htmlFor="gallery">
                          <div>
                            <p>Перетащите файлы сюда или нажмите для выбора</p>
                          </div>
                        </label>
                      </div>
                      <div className={style.gallery_preview}>
                        {gallery.map((image, index) => (
                          <div key={index} className={style.gallery_item}>
                            <img
                              src={`${process.env.REACT_APP_SERVER_URL}${image}`}
                              alt={`Gallery ${index}`}
                            />
                            <button
                              onClick={() => removeImageFromGallery(index)}
                            >
                              Удалить
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={style.skills}>
                      <h3>Навыки</h3>
                      <ul>
                        {skills.map((item, index) => (
                          <li key={index}>
                            <p>{item}</p>
                            <button onClick={() => removeSkill(index)}>
                              Удалить
                            </button>
                          </li>
                        ))}
                      </ul>
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(event) => setNewSkill(event.target.value)}
                        placeholder="Добавить новый навык"
                      />
                      <button onClick={addSkill}>Добавить навык</button>
                    </div>
                  </div>

                  <div className={style.admin_direction__buttons}>
                    <button onClick={updateDirecting} disabled={saving}>
                      {saving ? "Сохранение..." : "Обновить"}
                    </button>

                    <button onClick={handleDownload}>
                      Скачать список участников
                    </button>

                    <button onClick={deleteDirection}>
                      Удалить студенческое объединение
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        ) : showPageIndex === 1 ? (
          <div className={style.admin_direction__wrapper}>
            <div className={style.admin_direction__content}>
              <button onClick={() => setShowPageIndex(0)}>
                Вернуться назад
              </button>

              <h2>Добавить руководителей</h2>

              <input
                type="text"
                placeholder="Поиск..."
                value={searchOrganizerTerm}
                onChange={(e) => setSearchOrganizerTerm(e.target.value)}
              />

              {loadingOrganizers ? (
                <p>Загрузка руководителей...</p>
              ) : (
                filteredOrganizers && (
                  <ul>
                    {filteredOrganizers.map(({ fullName, role, _id }) => (
                      <li key={_id}>
                        <div>
                          <Link to={`/user/${_id}`}>
                            <p>{role}</p>
                            <p>{fullName}</p>
                          </Link>
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
        ) : showPageIndex === 2 ? (
          <div className={style.admin_direction__wrapper}>
            <div className={style.admin_direction__content}>
              <button onClick={() => setShowPageIndex(0)}>
                Вернуться назад
              </button>

              <h2>Входящие заявки студентов</h2>

              <input
                type="text"
                placeholder="Поиск..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {loadingStudens ? (
                <p>Загрузка студентов...</p>
              ) : (
                Array.isArray(filteredApplications) && (
                  <ul>
                    {filteredApplications.map(
                      ({ fullName, role, _id, group }) => (
                        <li key={_id}>
                          <div>
                            <Link to={`/user/${_id}`}>
                              {/* <p>{role}</p> */}
                              <p>
                                {fullName}. Группа: {group}
                              </p>
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

              <h2>Участники студенческого объединения</h2>

              <input
                type="text"
                placeholder="Поиск..."
                value={searchMemberTerm}
                onChange={(e) => setSearchMemberTerm(e.target.value)}
              />

              {loadingMembers ? (
                <p>Загрузка участников...</p>
              ) : (
                Array.isArray(filteredMembers) && (
                  <ul>
                    {filteredMembers.map(({ fullName, role, _id, group }) => (
                      <li key={_id}>
                        <div>
                          <Link to={`/user/${_id}`}>
                            {/* <p>{role}</p> */}
                            <p>
                              {fullName}. Группа: {group}
                            </p>
                          </Link>
                        </div>

                        <button
                          onClick={() => removeMember(_id)}
                          style={{ backgroundColor: "red" }}
                        >
                          Удалить
                        </button>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDirecting;
