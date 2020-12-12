module.exports = {
    name: 'mark',
    description: 'Records the date the student marked',
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
        db.all(`SELECT id, names FROM NAMES ORDER BY id ASC`, [], function(err, rows){
            var nameVerified = false;
            rows.forEach((item) => {
                if (item['names'] === name && item['id'] === msg.member.id){
                    nameVerified = true;
                }
            });
            if(nameVerified){
                db.run(`UPDATE LOG SET `+name+` = 1 WHERE date = (date('now'))`, [], function(err) {
                    if (err) {
                      return console.log(err.message);
                    }
                    // get the last insert id
                    msg.channel.send('Marked!!!');
                });
            }
            else{
                msg.channel.send('This data doesnt exist for ' + name + ' (run <!att login name> to create new data)');
            }
        });
    },
};