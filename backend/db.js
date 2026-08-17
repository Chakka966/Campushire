const mysql = require("mysql2");

const db = mysql.createPool(process.env.MYSQL_URL);

db.getConnection((err, connection) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("MySQL connected successfully!");

    connection.release();
});

module.exports = db;