module.exports = {
    name: 'test',
    description: 'creates a new table, inserts something, queries it, then deletes the table',
    execute(msg, args, admins, dbobj) {
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
        dbobj.test(msg);
    },
};