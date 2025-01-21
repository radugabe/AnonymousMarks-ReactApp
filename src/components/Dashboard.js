import React from "react";
import MPDashboard from "./MPDashboard";
import ProfessorDashboard from "./ProfessorDashboard";
import "../styles/Dashboard.css";

const Dashboard = ({ userRole, userId }) => {
  return (
    <div className="dashboard">
      <h1>Bine ai venit pe platformă!</h1>
      {userRole === "MP" && <MPDashboard userId={userId} />}
      {userRole === "Profesor" && <ProfessorDashboard />}
    </div>
  );
};

export default Dashboard;
