module.exports = {
    name: 'marco',
    description: 'Ping!',
    execute(msg, args, permissions, dbobj) {
      if(!permissions.isAllowed(msg.member.id)){
        msg.channel.send('You are prohibited from using this command');
        return;
    }
      msg.channel.send('polo');

      msg.channel.send('Found you '+msg.member.user.username+'!');
    },
};