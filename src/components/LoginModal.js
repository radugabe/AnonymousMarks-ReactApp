import React, { useState } from "react";
import "../styles/LoginModal.css";
import csieLogo from '../styles/csie.png';

const LoginModal = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Răspuns API:", data); // Verifică răspunsul
  
      if (data.success) {
        alert("Autentificare reușită!");
        onLogin(data.role, data.userId); // Apelează funcția de login din App
      } else {
        alert(data.message || "Nume de utilizator sau parolă greșită.");
      }
    } catch (error) {

      console.error("Eroare la conectarea cu serverul:", error);
      alert("A apărut o eroare. Te rugăm să încerci din nouuuuu.");
    }
  };
  

  return (
    <div className="login-modal">
      <div className="dots-container">
        {/* Buline animate */}
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>

        {/* Formularul de login */}
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Autentificare</h2>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>
      </div>
      <img src={csieLogo} alt="CSIE Logo" className="csie-logo" />
      <footer className="footer">
        © Project made by Radu Dinu, Vlad Anghel and Alicia Dobre. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginModal;
