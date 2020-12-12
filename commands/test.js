module.exports = {
    name: 'test',
    description: 'creates a new table, inserts something, queries it, then deletes the table',
    execute(msg, args, permissions, dbobj) {
        
        if(!permissions.isAdmin(msg.member.id)) {
            console.log('You are not admin!');
            return;
        }
        dbobj.test(msg);
    },
};