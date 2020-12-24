const sqlite3 = require('sqlite3');
const express = require("express");
var app = express();

const HTTP_PORT = 3001
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});
let sql = `SELECT * FROM runs`;
const db = new sqlite3.Database('./running_dev.db', (err) => {
    if (err) {
        console.error("Erro opening database " + err.message);
    }
});

app.get("/runs", (req, res, next) => {
    db.all(sql, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.status(200).json({rows});
    });
});