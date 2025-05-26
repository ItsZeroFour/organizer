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
                <p>
                  Адрес: 664074, г. Иркутск, ул. Лермонтово, 83 ИРНИТУ, Коб.
                  А-305
                </p>

                <div>
                  <p>Режим работы:</p>
                  <p>Пн-Пт с 9:00 до 16:00</p>
                  <p>Перерыв с 12:30 до 15:00</p>
                </div>
              </li>

              <li>
                <p>Контакты:</p>

                <div>
                  <p>Центр Проектного обучения:</p>
                  <Link to="tel:+73952405736">+7 (3952) 40-57-36</Link>
                  <Link to="mailto:e-project@ex.lstu.edu">
                    e-project@ex.lstu.edu
                  </Link>
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
                src="https://yandex.ru/map-widget/v1/?ll=104.260923%2C52.262021&mode=search&sctx=ZAAAAAgBEAAaKAoSCZ6ZYDjXDEFAEbfte9RfeUZAEhIJPrSPFfw2xD8Rs2FNZVHYtT8iBgABAgMEBSgKOABA1c0GSABqAnJ1nQHNzMw9oAEAqAEAvQHebAcCwgEa1paV4QOeyJXogAeYuuq5BoeU16QE9c7l%2BQOCAlc2NjQwNzQsINCzLiDQmNGA0LrRg9GC0YHQuiwg0YPQuy4g0JvQtdGA0LzQvtC90YLQvtCy0LAsIDgzINCY0KDQndCY0KLQoywg0JrQvtCxLiDQkC0zMDWKAgCSAgI2M5oCDGRlc2t0b3AtbWFwcw%3D%3D&sll=104.260923%2C52.262021&sspn=0.064585%2C0.030153&text=664074%2C%20%D0%B3.%20%D0%98%D1%80%D0%BA%D1%83%D1%82%D1%81%D0%BA%2C%20%D1%83%D0%BB.%20%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%BE%2C%2083%20%D0%98%D0%A0%D0%9D%D0%98%D0%A2%D0%A3%2C%20%D0%9A%D0%BE%D0%B1.%20%D0%90-305&z=14.29"
                width="100%"
                height="500"
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
