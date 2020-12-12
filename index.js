require('dotenv').config();

var attobj = require('./database.js');
attobj.database.run(`CREATE TABLE IF NOT EXISTS LOG(
    date text UNIQUE
)`);
attobj.database.run(`CREATE TABLE IF NOT EXISTS NAMES(
    id text PRIMARY KEY, 
    names text
)`);

const fs = require('fs');
var data = fs.readFileSync('adminprivs.txt');
let admins = data.toString().split(/\r?\n/);
console.log("admins: "+admins);

var bdata = fs.readFileSync('blacklist.txt');
let blacklisted = bdata.toString().split(/\r?\n/);
console.log("blacklist: ");
blacklisted.forEach((item) => {
    console.log(item);
});

let permissions = {
    admins: admins,
    blist: blacklisted,
    isAdmin: (user) => {
        var isAdmin = false;
        admins.forEach((item)=>{
            if(user == item){
                isAdmin = true;
                return;
            }
        });
        return isAdmin;
    },
    isAllowed: (user) => {
        var isBlacklisted = false;
        blacklisted.forEach((item)=>{
            if(user == item){
                isBlacklisted = true;
                return;
            }
        });
        return !isBlacklisted;
    },
    blacklist: (toBeBlacklisted) =>{
        fs.appendFileSync("blacklist.txt", toBeBlacklisted+'\n', (err) => {
            if(err){
                console.log(err);
                return;
            }
            console.log('Appended '+ toBeBlacklisted);
            return;
        });
    }
}

const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const TOKEN  = process.env.TOKEN;

const botCommands = require('./commands');
const { allowedNodeEnvironmentFlags } = require('process');

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});
//console.log(bot.commands);

bot.login(TOKEN);

bot.on('message', msg => {
    const args = msg.content.split(/ +/);
    const botCall = args.shift().toLowerCase();
    if (botCall != '!att' || args.length == 0) return;

    const command = args.shift().toLowerCase();
    //console.log(args);
    //console.info(`Got Message: ${command}`);

    try {
        bot.commands.get(command).execute(msg, args, permissions, attobj);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
});
