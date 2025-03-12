import React, { useState, useEffect } from "react";
import style from "./style.module.scss";
import { useDropzone } from "react-dropzone";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const CreateDirecting = () => {
  const [mainImagePath, setMainImagePath] = useState(null);
  const [secondImagePath, setSecondImagePath] = useState(null);
  const [organizers, setOrganizers] = useState(null);
  const [loadingOrganizers, setLoadingOrganizers] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [name, setName] = useState("");
  const [firstDescription, setFirstDescription] = useState("");
  const [secondDescription, setSecondDescription] = useState("");

  const navigate = useNavigate();

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
        alert(`Произошла ошибка: ${error.response.data.message}`);
      }
    };

    getAllOrganizers();
  }, []);

  const createDirecting = async () => {
    try {
      const directing = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/directing/create`,
        {
          name: name,
          description: firstDescription,
          secondDescription: secondDescription,
          admins: admins,
          imagePath: mainImagePath,
          secondImagePath: secondImagePath,
        }
      );

      if (directing.status === 200) {
        alert("Направление успешно создано!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      alert(`Произошла ошибка: ${error.response.data.message}`);
    }
  };

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
      alert(`Произошла ошибка: ${error.response.data.message}`);
      console.error("Ошибка загрузки файла:", error);
    }
  };

  const onDropMain = (acceptedFiles) =>
    uploadImage(acceptedFiles, setMainImagePath);
  const onDropSecond = (acceptedFiles) =>
    uploadImage(acceptedFiles, setSecondImagePath);

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

  return (
    <section className={style.create_direction}>
      <div className="container">
        <div className={style.create_direction__wrapper}>
          <h1>Создание направления</h1>

          <form>
            <input
              type="text"
              onChange={(event) => setName(event.target.value)}
              placeholder="Название направления"
            />
            <textarea
              onChange={(event) => setFirstDescription(event.target.value)}
              placeholder="Основное описание"
            />
            <textarea
              onChange={(event) => setSecondDescription(event.target.value)}
              placeholder="Последующее описание"
            />
          </form>

          <div className={style.create_direction__images}>
            <div className={style.create_direction__image}>
              <p>Главное изображение</p>

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

          <button onClick={createDirecting}>Создать направление</button>
        </div>
      </div>
    </section>
  );
};

export default CreateDirecting;
