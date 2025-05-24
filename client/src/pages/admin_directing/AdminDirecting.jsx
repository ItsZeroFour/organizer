import React, { useEffect, useState, useCallback } from "react";
import style from "./style.module.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { useDropzone } from "react-dropzone";

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

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchDirecting = useCallback(async () => {
    try {
      setLoadingDirecting(true);
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/directing/get-directing/${id}`
      );
      setDirecting(response.data);
    } catch (error) {
      alert(
        `Произошла ошибка: ${error.response?.data?.message || error.message}`
      );
      console.error(error);
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
        alert(`Произошла ошибка: ${error?.response?.data.message}`);
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
        alert(`Произошла ошибка: ${error.response.data.message}`);
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
        alert(`Произошла ошибка: ${error.response.data.message}`);
      }
    };

    getMembersUsers();
  }, []);

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
        alert("Успешно обновлено!");
      }
    } catch (error) {
      alert(
        `Произошла ошибка: ${error.response?.data?.message || error.message}`
      );
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
      alert(`Произошла ошибка: ${error.response.data.message}`);
      console.error("Ошибка загрузки файла:", error);
    }
  };

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
          alert(`Произошла ошибка: ${error.response.data.message}`);
          return null;
        }
      })
    );
    setGallery((prevGallery) => [
      ...prevGallery,
      ...uploadedPaths.filter(Boolean),
    ]);
  };

  // const downloadExcelData = async () => {
  //   try {
  //     await axios.post(`${process.env.REACT_APP_SERVER_URL}/excel-direction/${id}`);
  //   } catch (error) {
  //     alert(`Произошла ошибка: ${error?.response?.data.message}`);
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
    alert("Успешно добавлен! Не забудьте сохранить изменения");
  };

  const removeMember = (id) => {
    setMembers((prevMembers) =>
      prevMembers.filter((memberId) => memberId !== id)
    );

    alert("Успешно удален! Не забудьте сохранить изменения");
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
      <div className="container">
        <div className={style.admin_direction__wrapper}>
          {loadingDirecting ? (
            <p>Загрузка...</p>
          ) : (
            directing &&
            userData &&
            (userData?.role.toLowerCase() === "администратор" ||
              userData?.role.toLowerCase() === "зам. в.о." ||
              directing.admins.includes(userData._id)) && (
              <React.Fragment>
                <form>
                  <div>
                    <p>Название направления</p>
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
                      onChange={(event) => setDescription(event.target.value)}
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
                        <button onClick={() => removeImageFromGallery(index)}>
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

                <div className={style.admin_direction__people}>
                  {(userData.role.toLowerCase() === "зам. в.о." ||
                    userData.role.toLowerCase() === "администратор") && (
                    <div className={style.create_direction__organizers}>
                      <p>Добавить руководителя</p>

                      {loadingOrganizers ? (
                        <p>Загрузка руководителей...</p>
                      ) : (
                        organizers && (
                          <ul>
                            {organizers.map(({ fullName, role, _id }) => (
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
                  )}

                  {directing?.admins?.includes(userData._id) &&
                    (userData.role?.toLowerCase() === "администратор" ||
                      userData.role?.toLowerCase() === "сотрудник в.о." ||
                      userData.role?.toLowerCase() === "руководитель с.о.") && (
                      <div className={style.create_direction__organizers}>
                        <p>Входящие заявки студентов</p>

                        {loadingStudens ? (
                          <p>Загрузка студентов...</p>
                        ) : (
                          Array.isArray(applications) && (
                            <ul>
                              {applications.map(
                                ({ fullName, role, _id, group }) => (
                                  <li key={_id}>
                                    <div>
                                      <Link to={`/user/${_id}`}>
                                        <p>{role}</p>
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
                    )}
                </div>

                <div className={style.create_direction__organizers}>
                  <p>Участники направления</p>

                  {loadingMembers ? (
                    <p>Загрузка участников...</p>
                  ) : (
                    Array.isArray(membersFull) && (
                      <ul>
                        {membersFull.map(({ fullName, role, _id, group }) => (
                          <li key={_id}>
                            <div>
                              <Link to={`/user/${_id}`}>
                                <p>{role}</p>
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

                {directing?.admins?.includes(userData._id) &&
                  (userData.role?.toLowerCase() === "администратор" ||
                    userData.role?.toLowerCase() === "сотрудник в.о." ||
                    userData.role?.toLowerCase() === "руководитель с.о.") && (
                    <Link
                      to={`${process.env.REACT_APP_SERVER_URL}/excel-direction/${id}`}
                      target="_blank"
                    >
                      Скачать Excel
                    </Link>
                  )}

                <button onClick={updateDirecting} disabled={saving}>
                  {saving ? "Сохранение..." : "Обновить"}
                </button>
              </React.Fragment>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDirecting;
