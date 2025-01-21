import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import LoginModal from "./components/LoginModal";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const handleLogin = (role, id) => {
    setIsLoggedIn(true);
    setUserRole(role); // Salvează rolul utilizatorului (MP sau Profesor)
    setUserId(id);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <LoginModal onLogin={handleLogin} />
      ) : (
        <>
          <Navbar />
          <Dashboard userRole={userRole} userId={userId}/>
        </>
      )}
    </div>
  );
}

export default App;
