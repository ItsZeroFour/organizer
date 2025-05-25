import React, { useEffect, useState, useCallback } from "react";
import style from "./style.module.scss";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";

const Main = ({ userData }) => {
  const [directings, setDirectings] = useState([]);
  const [loadingDirecting, setLoadingDirecting] = useState(true);
  const [uniqueSkills, setUniqueSkills] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [filteredDirectings, setFilteredDirectings] = useState([]);

  const fetchDirectings = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/directing/get-all-directing`
      );
      setDirectings(response.data);

      const allSkills = response.data.flatMap((d) => d.skills || []);
      const uniqueSet = Array.from(new Set(allSkills));
      setUniqueSkills(uniqueSet);
    } catch (error) {
      alert(
        `Произошла ошибка: ${error.response?.data?.message || error.message}`
      );
      console.error(error);
    } finally {
      setLoadingDirecting(false);
    }
  }, []);

  useEffect(() => {
    fetchDirectings();
  }, [fetchDirectings]);

  useEffect(() => {
    const filtered = directings.filter((d) => {
      const matchesSearch = d.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSkill = selectedSkill
        ? d.skills?.includes(selectedSkill)
        : true;
      return matchesSearch && matchesSkill;
    });
    setFilteredDirectings(filtered);
  }, [searchQuery, selectedSkill, directings]);

  return (
    <section className={style.main}>
      <div className="container">
        <div className={style.main__wrapper}>
          {loadingDirecting ? (
            <p>Загрузка направлений...</p>
          ) : (
            <React.Fragment>
              <div className={style.main__link}>
                {(userData?.role.toLowerCase() === "руководитель в.о." ||
                  userData?.role.toLowerCase() === "зам. в.о." ||
                  userData?.role.toLowerCase() === "администратор") && (
                  <Link to="/create-directing">Создание направления</Link>
                )}
              </div>

              <div className={style.main__content}>
                <div className={style.main__filter}>
                  <input
                    type="text"
                    placeholder="Поиск"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                  >
                    <option value="">Навык</option>
                    {uniqueSkills.map((skill, idx) => (
                      <option key={idx} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>
                <ul className={style.main__list}>
                  {filteredDirectings.map(({ name, imagePath, _id }) => (
                    <li key={_id}>
                      <Link to={`/directing/${_id}`}>
                        <img
                          src={`${process.env.REACT_APP_SERVER_URL}${imagePath}`}
                          alt={name}
                        />
                        <div className={style.main__name}>
                          <h3>{name}</h3>
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

export default Main;
