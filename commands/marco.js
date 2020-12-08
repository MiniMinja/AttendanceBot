module.exports = {
    name: 'marco',
    description: 'Ping!',
    execute(msg, args, admins, dbobj) {
      msg.channel.send('polo');

      msg.channel.send('Found you '+msg.member.user.username+'!');
    },
};