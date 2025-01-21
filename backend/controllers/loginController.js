const db = require("../config/db");

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username și parola sunt necesare",
    });
  }

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ success: false, message: "Eroare server" });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credentiale incorecte",
      });
    }

    const user = results[0];

    return res.status(200).json({
      success: true,
      role: user.role, // Trimite rolul
      userId: user.user_id, // Trimite userId-ul
    });
  });
};

module.exports = { login };
