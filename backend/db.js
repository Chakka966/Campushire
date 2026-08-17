const mysql = require("mysql2");

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL connected successfully!");
});

module.exports = db;