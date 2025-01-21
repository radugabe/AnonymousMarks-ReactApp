import React, { useState, useEffect } from "react";
import "../styles/ProfessorDashboard.css";

const ProfessorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null); // Pentru livrabile
  const [notesVisible, setNotesVisible] = useState(null); // Pentru vizualizarea notelor

  useEffect(() => {
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

    fetchProjects();
  }, []);

  const toggleProjectExpand = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const toggleNotesVisibility = async (projectId) => {
    if (notesVisible === projectId) {
      // Dacă secțiunea este deja extinsă, o închidem
      setNotesVisible(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/project-evaluations/${projectId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.team_id === projectId
            ? { ...project, evaluations: data.marks, average: data.average }
            : project
        )
      );

      setNotesVisible(projectId); // Extinde secțiunea
    } catch (error) {
      console.error("Eroare la preluarea evaluărilor:", error);
    }
  };

  return (
    <div className="professor-dashboard">
      <h2>Toate Proiectele</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.team_id} className="project-item">
            <span className="project-info">
              <strong>Echipa:</strong> {project.team_name} - <strong>Proiect:</strong> {project.project_title}
            </span>
            <div className="project-buttons">
              <button onClick={() => toggleProjectExpand(project.team_id)}>
                {expandedProject === project.team_id ? "Ascunde Livrabile" : "Vizualizează Livrabile"}
              </button>
              <button onClick={() => toggleNotesVisibility(project.team_id)}>
                {notesVisible === project.team_id ? "Ascunde Note" : "Vizualizează Note"}
              </button>
            </div>
            {expandedProject === project.team_id && (
              <div className="project-details">
                <h4>Livrabile:</h4>
                {project.deliverables.length > 0 ? (
                  <ul>
                    {project.deliverables.map((deliverable, index) => (
                      <li key={index}>
                        <a href={deliverable} target="_blank" rel="noopener noreferrer">
                          {deliverable}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nu există livrabile adăugate.</p>
                )}
              </div>
            )}
            {notesVisible === project.team_id && (
              <div className="project-evaluations">
                <h4>Note:</h4>
                {project.evaluations && project.evaluations.length > 0 ? (
                  <p>
                    <strong>Note:</strong> {project.evaluations.join(", ")}
                    <br />
                    <strong>Media:</strong> {project.average ? project.average.toFixed(2) : "N/A"}
                  </p>
                ) : (
                  <p>Nu există note pentru acest proiect.</p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfessorDashboard;
