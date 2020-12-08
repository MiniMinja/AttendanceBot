module.exports = {
    name: 'mark',
    description: 'Records the date the student marked',
    execute(msg, args, admins, dbobj) {
        if(args.length == 0){
            return;
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