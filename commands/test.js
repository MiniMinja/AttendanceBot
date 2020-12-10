module.exports = {
    name: 'test',
    description: 'creates a new table, inserts something, queries it, then deletes the table',
    execute(msg, args, admins, dbobj) {
        var isAdmin = false;
        admins.forEach((item)=>{
            if(msg.member.id == item){
                isAdmin = true;
                return;
            }
        });
        if(!isAdmin){
            msg.channel.send('You are not admin!!!');
            return;
        }
        dbobj.test(msg);
    },
};