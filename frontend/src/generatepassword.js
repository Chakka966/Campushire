const bcrypt = require("bcryptjs");

const password = "admin123";

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error("Error:", err);
        return;
    }

    console.log("Password:", password);
    console.log("Hash:", hash);
});