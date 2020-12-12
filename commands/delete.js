module.exports = {
    name: 'delete',
    description: 'allows admins to delete data that may have been inserted falsely',
    execute(msg, args, permissions, dbobj) {
        if(!permissions.isAdmin(msg.member.id)) {
            console.log('You are not admin!');
            return;
        }
        if(args.length == 0){
            return;
        }
        else{
            var rowNum = -1;
            var indexOfNum = 0;
            var containsNum = false;
            args.forEach((item) => {
                if(/^\d+$/.test(item)){
                    containsNum = true;
                    return;
                }
                indexOfNum++;
            });
            if(!containsNum){
                msg.channel.send('Invalid Arg Val: Must have a number');
                return;
            }
            else{
                rowNum = parseInt(args.pop(indexOfNum));
            }
        }
        var name = args.join("").replace(/\s+/g, "").toLowerCase();
        var db = dbobj.database;
        db.all(`SELECT names FROM NAMES`, [], function(err, rows){
            var nameExists = false;
            rows.forEach((item) => {
                if (item['names'] === name){
                    nameExists = true;
                }
            });
            if(nameExists){
                db.all(`SELECT date FROM LOG WHERE `+name+` = ? ORDER BY date ASC`, [1], (err, rows) => {
                    if (err) {
                        return console.log(err.message);
                    }
                    if(rows.length == 0) {
                        msg.channel.send('No Data!!!');
                    }
                    else{
                        var index = 0;
                        rows.forEach((item) =>{
                            console.log(item);
                            if(index++ === rowNum){
                                db.run(`UPDATE LOG SET `+name+` = 0 WHERE date = ?`, [item['date']], function(err) {
                                    if (err) {
                                    return console.log(err.message);
                                    }
                                    msg.channel.send('Deleted ' + item['date']);
                                });
                                return;
                            }
                        });
                    }
                });
            }
            else{
                msg.channel.send('This data doesnt exist for ' + name + ' (run <!att login name> to create new data)');
            }
        });
    },
};