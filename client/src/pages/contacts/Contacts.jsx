import React from "react";
import style from "./style.module.scss";
import { Link } from "react-router-dom";

const Contacts = () => {
  return (
    <section className={style.contacts}>
      <div className="container">
        <div className={style.contacts__wrapper}>
          <div className={style.contacts__content}>
            <h1>Контакты</h1>

            <ul>
              <li>
                <p>Адрес: 664074, г. Иркутск, ул. Ленина, 5А</p>

                <div>
                  <p>Режим работы:</p>
                  <p>Пн-Пт с 8:00 до 20:00</p>
                </div>
              </li>

              <li>
                <p>Контакты:</p>

                <div>
                  <p>Центр Проектного обучения:</p>
                  <Link to="tel:+73952242699">+7 (3952) 24-26-99</Link>
                  <Link to="mailto:irkat.ru">irkat.ru</Link>
                </div>
              </li>

              <li>
                <p>Персоналии:</p>

                <div>
                  <p>
                    Руководитель центра проектного обучения: Чимитов Павел
                    Евгеньевич
                  </p>
                </div>
              </li>
            </ul>

            <div
              style={{
                position: "relative",
                overflow: "hidden",
                marginTop: 40,
                borderRadius: 20,
              }}
            >
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=104.281159%2C52.283348&mode=search&oid=1042737546&ol=biz&z=15.21"
                width="560"
                height="400"
                frameborder="1"
                allowfullscreen="true"
                style={{ position: "relative" }}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
