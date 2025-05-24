import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import SignIn from "./pages/signin/SignIn";
import axios from "axios";
import Account from "./pages/account/Account";
import CreateDirecting from "./pages/admin/CreateDirecting";
import Register from "./pages/register/Register";
import Main from "./pages/main/Main";
import Directing from "./pages/directing/Directing";
import AdminDirecting from "./pages/admin_directing/AdminDirecting";
import UserAccount from "./pages/user_account/UserAccount";
import CreateEvent from "./pages/admin/CreateEvent";
import Event from "./pages/event/Event";
import Events from "./pages/events/Events";
import AdminEvent from "./pages/admin_event/AdminEvent";

function App() {
  const [findUserProcess, setFindUserProcess] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function getUser() {
      try {
        setFindUserProcess(true);
        const user = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/user/get`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        setFindUserProcess(false);
        setUserData(user.data);
      } catch (err) {
        setFindUserProcess(false);
      }
    }

    getUser();
  }, [localStorage.getItem("token")]);

  return (
    <div className="App">
      <div className="page">
        <Header userData={userData} />

        <main>
          {findUserProcess ? (
            <p>Загрузка...</p>
          ) : (
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user/:id" element={<UserAccount />} />
              <Route
                path="/directing/:id"
                element={<Directing userData={userData} />}
              />
              <Route
                path="/event/:id"
                element={<Event userData={userData} />}
              />
              <Route path="/events" element={<Events />} />

              {userData && (
                <>
                  <Route
                    path="/account"
                    element={<Account userData={userData} />}
                  />
                  <Route
                    path="/admin-directing/:id"
                    element={<AdminDirecting userData={userData} />}
                  />
                  {(userData.role.toLowerCase() === "зам. в.о." ||
                    userData.role.toLowerCase() === "администратор") && (
                    <Route
                      path="create-directing"
                      element={<CreateDirecting />}
                    />
                  )}

                  {(userData.role.toLowerCase() === "сотрудник в.о." ||
                    userData.role.toLowerCase() === "зам. в.о." ||
                    userData.role.toLowerCase() === "администратор") && (
                    <React.Fragment>
                      <Route
                        path="/create-event"
                        element={<CreateEvent userData={userData} />}
                      />

                      <Route path="/admin-event/:id" element={<AdminEvent />} />
                    </React.Fragment>
                  )}
                </>
              )}
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
