module.exports = {
    name: 'blacklist',
    description: 'allows admins to block abusive users',
    execute(msg, args, permissions, dbobj) {
        if(!permissions.isAdmin(msg.member.id)) {
            console.log('You are not admin!');
            return;
        }
        if(args.length != 1){
            return;
        }
        var userToBlock = args[0].replace(/\s+/g, "");
        if(!userToBlock.startsWith("<@")){
            msg.channel.send('You must mention the user to be blacklisted');
            return;
        }
        userToBlock = userToBlock.substring(2, userToBlock.length - 1);
        if(userToBlock.startsWith("!")) userToBlock = userToBlock.substring(1);
        if(permissions.isAllowed(userToBlock)){
            console.log(userToBlock);
            permissions.blacklist(userToBlock);
            permissions.blist.push(userToBlock);
        }
        else{
            msg.channel.send('You already blacklisted this person');
        }
    },
};