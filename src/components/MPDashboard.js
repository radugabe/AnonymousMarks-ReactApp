import React, { useState, useEffect } from "react";
import "../styles/MPDashboard.css";

const MPDashboard = ({ userId }) => {
  const [userProject, setUserProject] = useState(null); // Proiectul propriu al utilizatorului
  const [evaluationTeams, setEvaluationTeams] = useState([]); // Echipele atribuite pentru evaluare
  const [projects, setProjects] = useState([]); // Toate proiectele
  const [expandedProject, setExpandedProject] = useState(null); // Proiect expandat pentru vizualizare
  const [assigningMark, setAssigningMark] = useState(null); // Echipa pentru care se atribuie nota
  const [mark, setMark] = useState(""); // Nota pentru proiect
  const [projectFormVisible, setProjectFormVisible] = useState(false); // Control pentru formular
  const [teamName, setTeamName] = useState(""); // Nume echipă
  const [projectTitle, setProjectTitle] = useState(""); // Titlu proiect
  const [deliverables, setDeliverables] = useState([]); // Livrabile
  const [loading, setLoading] = useState(false); // Stare de încărcare

  // Fetch pentru proiectul propriu, echipele de evaluare și toate proiectele
  useEffect(() => {
    const fetchUserProject = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user-project/${userId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUserProject(data.project || null);
        if (data.project) {
          setTeamName(data.project.team_name || "");
          setProjectTitle(data.project.project_title || "");
          setDeliverables(data.project.deliverables || []);
        }
      } catch (error) {
        console.error("Eroare la preluarea proiectului propriu:", error);
      }
    };

    const fetchEvaluationTeams = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/evaluation-teams/${userId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setEvaluationTeams(data.teams || []);
      } catch (error) {
        console.error("Eroare la preluarea echipelor pentru evaluare:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/projects");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Eroare la preluarea proiectelor:", error);
      }
    };

    fetchUserProject();
    fetchEvaluationTeams();
    fetchProjects();
  }, [userId]);

  // Controlează vizualizarea detaliilor proiectului
  const toggleProjectExpand = (teamId) => {
    setExpandedProject(expandedProject === teamId ? null : teamId);
  };

  // Adaugă un câmp nou pentru livrabil
  const addDeliverableField = () => {
    if (deliverables.some((deliverable) => !deliverable.trim())) {
      alert("Completează toate câmpurile înainte de a adăuga un nou livrabil!");
      return;
    }
    setDeliverables([...deliverables, ""]); // Adaugă un câmp gol
  };

  // Actualizează valoarea unui câmp existent
  const updateDeliverableField = (index, value) => {
    const updatedDeliverables = [...deliverables];
    updatedDeliverables[index] = value;
    setDeliverables(updatedDeliverables);
  };

  // Trimite datele proiectului la API
  const handleSubmitProject = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/update-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamName, projectTitle, deliverables, userId }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Proiect salvat cu succes!");
        setUserProject(data.project || null);
        setProjectFormVisible(false);
      } else {
        alert(data.message || "A apărut o eroare. Te rugăm să încerci din nou.");
      }
    } catch (error) {
      console.error("Eroare la salvarea proiectului:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gestionare atribuire notă
  const handleAssignMark = async (teamId) => {
    const parsedMark = parseFloat(mark);

    if (isNaN(parsedMark) || parsedMark < 0 || parsedMark > 10) {
      alert("Nota trebuie să fie un număr între 0 și 10.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/assign-mark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, userId, mark: parsedMark }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message || "Nota a fost atribuită cu succes.");
        setAssigningMark(null); // Închide formularul de notare
        setMark(""); // Resetează câmpul de introducere a notei
      } else {
        alert(data.message || "A apărut o eroare. Te rugăm să încerci din nou.");
      }
    } catch (error) {
      console.error("Eroare la atribuirea notei:", error);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    }
  };

  return (
    <div className="mp-dashboard">
      <div className={`project-container ${projectFormVisible ? "active" : ""}`}>
        {/* Secțiunea „Proiectul meu” */}
        <section className="project-section">
          <h2>Proiectul meu</h2>
          {userProject ? (
            <div className="user-project">
              <p><strong>Echipa:</strong> {userProject.team_name}</p>
              <p><strong>Proiect:</strong> {userProject.project_title}</p>
              <h4>Livrabile:</h4>
              {userProject.deliverables && userProject.deliverables.length > 0 ? (
                <div className="deliverables-list">
                  {userProject.deliverables.map((deliverable, index) => (
                    <p key={index}>
                      <a href={deliverable} target="_blank" rel="noopener noreferrer" style={{ color: "#4b0054", textDecoration: "none" }}>
                        {deliverable}
                      </a>
                    </p>
                  ))}
                </div>
              ) : (
                <p>Nu există livrabile adăugate.</p>
              )}
              <button onClick={() => setProjectFormVisible(!projectFormVisible)}>
                {userProject.project_title ? "Editează Proiect" : "Adaugă Proiect"}
              </button>
            </div>
          ) : (
            <button onClick={() => setProjectFormVisible(true)}>Adaugă Proiect</button>
          )}
        </section>

        {/* Formularul de editare */}
        {projectFormVisible && (
          <section className="project-form active">
            <h2>{userProject?.project_title ? "Editează Proiect" : "Adaugă Proiect"}</h2>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Numele echipei"
            />
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="Numele proiectului"
            />
            <h4>Livrabile:</h4>
            {deliverables.map((deliverable, index) => (
              <div key={index} className="deliverable-field">
                <input
                  type="text"
                  value={deliverable}
                  onChange={(e) => updateDeliverableField(index, e.target.value)}
                  placeholder="Introduceți link-ul livrabilului"
                />
              </div>
            ))}
            <button onClick={addDeliverableField}>Adaugă Livrabil</button>
            <button onClick={handleSubmitProject} disabled={loading}>
              {loading ? "Se trimite..." : "Salvează"}
            </button>
          </section>
        )}
      </div>

      {/* Secțiunea „Proiecte atribuite pentru evaluare” */}
      {evaluationTeams.length > 0 && (
        <section className="evaluation-section">
          <h2>Proiecte atribuite pentru evaluare</h2>
          <ul>
            {evaluationTeams.map((teamId) => {
              const teamProject = projects.find((project) => project.team_id === teamId);

              if (teamProject) {
                return (
                  <li key={teamId}>
                    <span>
                      <strong>Echipa:</strong> {teamProject.team_name} -{" "}
                      <strong>Proiect:</strong> {teamProject.project_title}
                    </span>
                    <button onClick={() => toggleProjectExpand(teamId)}>
                      {expandedProject === teamId ? "Ascunde Livrabile" : "Vizualizează Livrabile"}
                    </button>
                    {expandedProject === teamId && (
                      <div className="project-details">
                        <h4>Livrabile:</h4>
                        {teamProject.deliverables && teamProject.deliverables.length > 0 ? (
                          <div className="deliverables-list">
                            {teamProject.deliverables.map((deliverable, index) => (
                              <p key={index}>
                                <a href={deliverable} target="_blank" rel="noopener noreferrer" style={{ color: "#4b0054", textDecoration: "none" }}>
                                  {deliverable}
                                </a>
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p>Nu există livrabile adăugate.</p>
                        )}
                      </div>
                    )}
                    <button onClick={() => setAssigningMark(teamId)}>
                      Atribuie Nota
                    </button>
                    {assigningMark === teamId && (
                      <div className="assign-mark-form">
                        <input
                          type="number"
                          value={mark}
                          onChange={(e) => setMark(e.target.value)}
                          placeholder="Introduceți nota"
                          min="1"
                          max="10"
                          step="0.01"
                        />
                        <button onClick={() => handleAssignMark(teamId)}>Salvează</button>
                        <button onClick={() => setAssigningMark(null)}>Anulează</button>
                      </div>
                    )}
                  </li>
                );
              } else {
                return (
                  <li key={teamId}>
                    Echipa {teamId} - <i>Detalii indisponibile</i>
                  </li>
                );
              }
            })}
          </ul>
        </section>
      )}
    </div>
  );
};

export default MPDashboard;
