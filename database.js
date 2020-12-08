const sqlite3 = require('sqlite3').verbose();
let attendance_db = new sqlite3.Database('./db/attendance.db', (err) =>  {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to attendance database');

    //attendance_db.run(`CREATE TABLE IF NOT EXISTS alias (username, alias)`);
    attendance_db.serialize(function () {
        attendance_db.all("SELECT name FROM sqlite_master WHERE type='table'", function (err, tables) {
            console.log('TABLES: ');
            tables.forEach((item) => {
                console.log(item['name']);
            });
            console.log();
        });
    });
});

function quicktest(msg){
    attendance_db.serialize(() => {
        attendance_db.all('SELECT * FROM NAMES', [], function(err, rows) {
            console.log('NAMES: ');
            rows.forEach((item) => {
                console.log(item['names']);
            });
            console.log();
        });
        attendance_db.all('SELECT * FROM LOG', [], function(err, rows) {
            console.log('LOG: ');
            rows.forEach((item) => {
                console.log(item);
            });
            console.log();
        });
    });
}

function addDay() {
    let addday = `INSERT INTO LOG (date) VALUES(date('now'))`;
    attendance_db.run(addday, [], (err) => {
        if(err){
            //Change this to <console.log(err)>
            if (err['errno'] != 19){
                console.log(err);
            }
            return;
        }
    });
}
setInterval(addDay, 1000);

module.exports = {
    database: attendance_db,
    test: quicktest
}


/*
attendance_db.close((err) => {
    if (err) {
        return console.error(err.message);
    }

    console.log('Logging off from database');
});
*/