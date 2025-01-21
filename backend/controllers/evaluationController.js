const db = require("../config/db");

// Obține echipele atribuite unui evaluator
exports.getEvaluationTeams = (req, res) => {
  const userId = req.params.userId;

  const query = "SELECT team_id FROM user_evaluators WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Eroare server" });
    }

    const teamIds = results.map((row) => row.team_id);
    res.status(200).json({ success: true, teams: teamIds });
  });
};

// Funcție pentru a atribui sau modifica nota
exports.assignMark = (req, res) => {
  const { teamId, userId, mark } = req.body;
  const allowedTimeFrame = 1 / 2000; // În ore

  // Verificăm dacă evaluatorul a atribuit deja o notă pentru acest proiect
  const checkQuery = `
    SELECT id, timestamp 
    FROM evaluations 
    WHERE team_id = ? AND user_id = ?
  `;

  db.query(checkQuery, [teamId, userId], (err, results) => {
    if (err) {
      console.error("Eroare la verificarea notei:", err);
      return res.status(500).json({ success: false, message: "Eroare server." });
    }

    if (results.length > 0) {
      const existingEvaluation = results[0];
      const timestamp = new Date(existingEvaluation.timestamp);
      const currentTime = new Date();

      // Calculăm diferența de timp în ore
      const hoursDifference = Math.abs(currentTime - timestamp) / (1000 * 60 * 60);

      if (hoursDifference > allowedTimeFrame) {
        return res.status(403).json({
          success: false,
          message: "Perioada de modificare a notei a expirat.",
        });
      }

      // Dacă perioada nu a expirat, actualizăm nota
      const updateQuery = `
        UPDATE evaluations 
        SET mark = ?, timestamp = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;

      db.query(updateQuery, [mark, existingEvaluation.id], (err) => {
        if (err) {
          console.error("Eroare la actualizarea notei:", err);
          return res.status(500).json({ success: false, message: "Eroare server." });
        }

        return res.status(200).json({
          success: true,
          message: "Nota a fost actualizată cu succes.",
        });
      });
    } else {
      // Dacă nu există o notă, adăugăm una nouă
      const insertQuery = `
        INSERT INTO evaluations (team_id, user_id, mark, timestamp) 
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `;

      db.query(insertQuery, [teamId, userId, mark], (err) => {
        if (err) {
          console.error("Eroare la adăugarea notei:", err);
          return res.status(500).json({ success: false, message: "Eroare server." });
        }

        return res.status(201).json({
          success: true,
          message: "Nota a fost atribuită cu succes.",
        });
      });
    }
  });
};


// Obține evaluările pentru un proiect specific
exports.getProjectEvaluations = (req, res) => {
  const teamId = req.params.teamId;

  const query = `
    SELECT mark
    FROM evaluations
    WHERE team_id = ?;
  `;

  db.query(query, [teamId], (err, results) => {
    if (err) {
      console.error("Eroare la preluarea evaluărilor:", err);
      return res.status(500).json({ success: false, message: "Eroare la server" });
    }

    const marks = results.map((row) => row.mark);

    // Calculează media
    let average = null;
    if (marks.length > 0) {
      if (marks.length >= 3) {
        const marksFloat = marks.map(parseFloat);
        const sortedMarks = marksFloat.sort((a, b) => a - b);
        const filteredMarks = sortedMarks.slice(1, -1); // Elimină cea mai mică și cea mai mare notă
        average = filteredMarks.reduce((sum, mark) => sum + mark, 0) / filteredMarks.length;
      } 
      else if(marks.length == 2){
          average = (parseFloat(marks[0]) + parseFloat(marks[1]))/2;
          
      }
      else {
        average = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
      }
    }
    
    res.status(200).json({ success: true, marks, average });
  });
};

