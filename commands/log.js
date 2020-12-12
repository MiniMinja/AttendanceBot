module.exports = {
    name: 'log',
    description: 'print out the contents of ones records',
    execute(msg, args, permissions, dbobj) {
        if(!permissions.isAllowed(msg.member.id)){
            msg.channel.send('You are prohibited from using this command');
            return;
        }
        if(args.length == 0){
            return;
        }
        var db = dbobj.database;
        var numbered = args.indexOf('numbered') != -1;
        if(numbered){
            args.pop(args.indexOf('numbered'));
        }
        var name = args.join("").replace(/\s+/g, "").toLowerCase();
        db.all(`SELECT names FROM NAMES`, (err, rows) =>{
            var tableExists = false;
            rows.forEach((item) => {
                if (item['names'] === name){
                    tableExists = true;
                }
            });
            if(tableExists){
                db.all(`SELECT date FROM LOG WHERE `+name+` = ? ORDER BY date ASC`, [1], (err, rows) => {
                    if (err) {
                        return console.log(err.message);
                    }
                    if(rows.length == 0) {
                        msg.channel.send('No Data!!!');
                    }
                    else{
                        msg.channel.send(name+"'s Log: ");
                        let res = '';
                        let rowNum = 0;
                        rows.forEach((item) =>{
                            if(numbered) res += (rowNum++) + ': ';
                            res += item['date'] + '\n';
                            if(res.length >= 2000) {
                                msg.channel.send(res);
                                res = "";
                            }
                        });
                        if(res.length > 0) msg.channel.send(res);
                    }
                });
            }   
            else{
                msg.channel.send('This data doesnt exist for ' + name + ' (run <!att login name> to create new data)');
            }
        });
    },
};