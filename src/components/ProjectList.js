import React, { useState } from "react";
import "../styles/ProjectList.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      teamName: "Echipa Alfa",
      projectName: "Platforma Educativă",
      deliverables: [
        { id: 1, name: "Demo Video", link: "https://example.com/video" },
        { id: 2, name: "GitHub Repo", link: "https://github.com/example" },
      ],
    },
    {
      id: 2,
      teamName: "Echipa Beta",
      projectName: "Aplicație Mobile",
      deliverables: [
        { id: 1, name: "Documentație", link: "https://example.com/docs" },
      ],
    },
  ]);

  const [expandedProject, setExpandedProject] = useState(null); // Starea pentru proiectul extins

  // Toggle pentru afișarea livrabilelor
  const toggleDeliverables = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  return (
    <div className="project-list">
      <h2>Proiectele mele</h2>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="project-item">
              <div className="project-header">
                <div>
                  <h3>{project.teamName}</h3>
                  <p>{project.projectName}</p>
                </div>
                <button
                  onClick={() => toggleDeliverables(project.id)}
                  className="toggle-btn"
                >
                  {expandedProject === project.id
                    ? "Ascunde livrabile"
                    : "Vizualizează livrabile"}
                </button>
              </div>
              {/* Afișăm livrabilele doar dacă proiectul este extins */}
              {expandedProject === project.id && (
                <div className="deliverables">
                  <h4>Livrabile:</h4>
                  <ul>
                    {project.deliverables.map((deliverable) => (
                      <li key={deliverable.id}>
                        <a
                          href={deliverable.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {deliverable.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nu există proiecte adăugate.</p>
      )}
    </div>
  );
};

export default ProjectList;
