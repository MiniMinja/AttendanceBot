module.exports = {
    name: 'login',
    description: 'Creates a table which records the data of a new student',
    execute(msg, args, admins, dbobj) {
        //when we create a database for a student, that student can login as multiple names (hence multiple tables)
        //find a way to constrain such that unique tables for each student (or some solution of the sort)
        if(args.length == 0){
            return;
        }
        var isAdmin = false;
        for(var index in admins){
            if(msg.member.user.tag == admins[index]){
                isAdmin = true;
                break;
            }
        }
        if(!isAdmin){
            msg.channel.send('You are not admin!!!');
            return;
        }

        var name = args.join("").replace(/\s+/g, "").toLowerCase();
        var db = dbobj.database;

        let tryToAdd = 'INSERT INTO NAMES(names) '; 
        tryToAdd += 'VALUES(?)';

        db.run(tryToAdd, [name], function(err){
            if(err){
                if (err['errno'] == 19){
                    msg.channel.send('You most likely have a duplicate');
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
    },
};