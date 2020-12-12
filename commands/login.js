module.exports = {
    name: 'login',
    description: 'Creates a table which records the data of a new student',
    execute(msg, args, permissions, dbobj) {
        if(!permissions.isAllowed(msg.member.id)){
            msg.channel.send('You are prohibited from using this command');
            return;
        }
        if(args.length == 0){
            return;
        }

        var name = args.join("").replace(/\s+/g, "").toLowerCase();
        var db = dbobj.database;

        let tryToAdd = 'INSERT INTO NAMES(id, names) '; 
        tryToAdd += 'VALUES(?, ?)';
        db.all(`SELECT id, names FROM NAMES ORDER BY id ASC`, [], function(err, rows){
            var nameExists = false;
                rows.forEach((item) => {
                    if (item['names'] === name){
                        nameExists = true;
                    }
                });
            if(!nameExists){
                db.run(tryToAdd, [msg.member.id, name], function(err){
                        if(err){
                            if (err['errno'] == 19){
                                msg.channel.send('That Data Already Exists: probably ur trying to login twice');
                            }
                            msg.channel.send('Unable to login ' + name);
                            return;
                        }
                        console.log('Added ' + name + ' successfully to NAMES!');

                        let addcolumn = 'ALTER TABLE LOG \n'
                        addcolumn += 'ADD COLUMN ' + name + ' INTEGER  DEFAULT 0'
                        db.run(addcolumn, [], function(err){
                            if(err){
                                console.log(err.message);

                                let deletename = 'DELETE FROM NAMES ';
                                deletename += 'WHERE names = ?'
                                db.run(deletename, [name], function(err){
                                    if(err){
                                        console.log(err.message);
                                        return;
                                    }
                                    console.log('Deleted ' + name + ' due to error from names');
                                });
                                return;
                            }
                            console.log('Added ' + name + ' successfully to LOG');
                            msg.channel.send('You have added ' + name + ' into the database');
                        });
                });
            }
            else{
                msg.channel.send('That Data Already Exists: use a new username');
            }
        });
    },
};