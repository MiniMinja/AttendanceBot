module.exports = {
    name: 'deleteuser',
    description: 'allows admins to delete created data',
    execute(msg, args, permissions, dbobj) {
        if(!permissions.isAdmin(msg.member.id)) {
            console.log('You are not admin!');
            return;
        }
        if(args.length == 0){
            return;
        }
        var name = args.join("").replace(/\s+/g, "").toLowerCase();
        var db = dbobj.database;
        db.all(`SELECT id, names FROM NAMES ORDER BY id ASC`, [], function(err, rows){
            var nameExists = false;
            var names = [];
            var nameToDelete;
            rows.forEach((item) => {
                if (item['names'] === name){
                    nameExists = true;
                    nameToDelete = item['names'];
                }
                names.push(item['names']);
            });
            if(nameExists){
                var createTable = `CREATE TABLE LOG( 
                    date TEXT UNIQUE`;
                names.forEach((item) => {
                    if(item !== nameToDelete)
                        createTable += ', \n ' + item + ' INTEGER DEFAULT 0';
                });
                createTable += '\n)';
                var insertintolog = `INSERT INTO LOG(date`;
                names.forEach((item) => {
                    if(item !== nameToDelete)
                        insertintolog += ', ' + item;
                });
                insertintolog += ')\n SELECT date ';
                names.forEach((item) => {
                    if(item !== nameToDelete)
                        insertintolog += ', ' + item;
                });
                insertintolog += `\nFROM LOG_b`;
                db.serialize(()=>{
                    db.run(`PRAGMA foreign_keys=off`, (err) => {
                        if(err){
                            console.log(1);
                            console.log(err);
                            return;
                        }
                    }).run(`BEGIN TRANSACTION`, [], (err) => {
                        if(err){
                            console.log(2);
                            console.log(err);
                            return;
                        }
                    }).run(`ALTER TABLE LOG RENAME TO LOG_b`, (err) => {
                        if(err){
                            console.log(3);
                            console.log(err);
                            return;
                        }
                    }).run(createTable, [], (err) => {
                        if(err){
                            console.log(4);
                            console.log(err);
                            return;
                        }
                    }).run(insertintolog, [], (err) => {
                        if(err){
                            console.log(5);
                            console.log(err);
                            return;
                        }
                    }).run(`DROP TABLE LOG_b`, [], (err) => {
                        if(err){
                            console.log(6);
                            console.log(err);
                            return;
                        }
                    }).run(`COMMIT`, [], (err) => {
                        if(err){
                            console.log(7);
                            console.log(err);
                            return;
                        }
                    }).run(`PRAGMA foreign_keys=on`, [], (err) => {
                        if(err){
                            console.log(8);
                            console.log(err);
                            return;
                        }
                    }).run(`DELETE FROM NAMES WHERE names = ?`, [nameToDelete], (err) =>{
                        if(err){
                            console.log(9);
                            console.log(err);
                            return;
                        }
                    });
                });
                msg.channel.send('Deleted '+nameToDelete + ' !');
            }
            else{
                msg.channel.send('This data doesnt exist for ' + name + ' (run <!att login name> to create new data)');
            }
        });
    },
};