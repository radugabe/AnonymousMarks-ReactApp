const db = require("../config/db");

exports.updateProject = (req, res) => {
  const { teamName, projectTitle, deliverables, userId } = req.body;
  console.log("Request body primit în backend:", req.body);

  if (!teamName || !projectTitle || !deliverables || deliverables.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Toate câmpurile sunt necesare (teamName, projectTitle, deliverables).",
    });
  }

  // Obține team_id pe baza user_id
  const getTeamIdQuery = `
    SELECT team_id FROM team_content WHERE user_id = ?
  `;

  db.query(getTeamIdQuery, [userId], (err, results) => {
    if (err) {
      console.error("Eroare la obținerea team_id:", err);
      return res.status(500).json({
        success: false,
        message: "Eroare la obținerea team_id.",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nu s-a găsit o echipă pentru acest utilizator.",
      });
    }

    const teamId = results[0].team_id;

    // Actualizează tabela teams
    const updateTeamQuery = `
      UPDATE teams 
      SET team_name = ?, project_title = ?
      WHERE team_id = ?;
    `;

    db.query(updateTeamQuery, [teamName, projectTitle, teamId], (err, result) => {
      if (err) {
        console.error("Eroare la actualizarea echipei:", err);
        return res.status(500).json({
          success: false,
          message: "Eroare la actualizarea echipei.",
        });
      }

      // Șterge livrabilele vechi
      // const deleteDeliverablesQuery = `
      //   DELETE FROM deliverables
      //   WHERE sent_user_id = ?;
      // `;
      const deleteDeliverablesQuery = `
        DELETE d
        FROM deliverables d
        JOIN team_content tc ON d.sent_user_id = tc.user_id
        WHERE tc.team_id = ?;
      `;

      db.query(deleteDeliverablesQuery, [teamId], (err, deleteResult) => {
        if (err) {
          console.error("Eroare la ștergerea livrabilelor:", err);
          return res.status(500).json({
            success: false,
            message: "Eroare la ștergerea livrabilelor vechi.",
          });
        }

        // Adaugă noile livrabile
        const insertDeliverablesQuery = `
          INSERT INTO deliverables (deliverable, sent_user_id)
          VALUES ?
        `;

        const deliverablesData = deliverables.map((link) => [link, userId]);

        db.query(insertDeliverablesQuery, [deliverablesData], (err, insertResult) => {
          if (err) {
            console.error("Eroare la inserarea livrabilelor:", err);
            return res.status(500).json({
              success: false,
              message: "Eroare la inserarea livrabilelor.",
            });
          }

          return res.status(200).json({
            success: true,
            message: "Proiectul și livrabilele au fost actualizate cu succes.",
          });
        });
      });
    });
  });
};

exports.getAllProjects = (req, res) => {
  const query = `
    SELECT 
      teams.team_id,
      teams.team_name,
      teams.project_title,
      GROUP_CONCAT(deliverables.deliverable) AS deliverables
    FROM teams
    LEFT JOIN team_content ON teams.team_id = team_content.team_id
    LEFT JOIN deliverables ON team_content.user_id = deliverables.sent_user_id
    GROUP BY teams.team_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Eroare la preluarea proiectelor:", err);
      return res.status(500).json({ success: false, message: "Eroare server." });
    }

    const projects = results.map((row) => ({
      team_id: row.team_id,
      team_name: row.team_name,
      project_title: row.project_title,
      deliverables: row.deliverables ? row.deliverables.split(",") : []
    }));

    return res.status(200).json({ success: true, projects });
  });
};


exports.getUserProject = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      t.team_id,
      t.team_name,
      t.project_title,
      d.deliverable
    FROM 
      teams t
    JOIN 
      team_content tc ON t.team_id = tc.team_id
    LEFT JOIN 
      deliverables d ON d.sent_user_id = tc.user_id
    WHERE 
      tc.team_id = (SELECT team_id FROM team_content WHERE user_id = ?);
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Eroare la preluarea proiectului propriu:", err);
      return res.status(500).json({ success: false, message: "Eroare la server." });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Nu există proiect asociat utilizatorului." });
    }

    // Creăm proiectul cu livrabilele grupate
    const project = {
      team_id: results[0].team_id,
      team_name: results[0].team_name,
      project_title: results[0].project_title,
      deliverables: results.map((row) => row.deliverable).filter((link) => link !== null),
    };

    res.status(200).json({ success: true, project });
  });
};

