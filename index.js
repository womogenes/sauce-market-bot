const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();

const [writePrices] = require('./spreadsheet.js');

// From https://stackoverflow.com/questions/19847412/how-to-call-a-function-every-hour
var nextDate = new Date();
const doSM = () => {
  client.channels.get('860011138062483460').send('.sm');

  nextDate.setHours(nextDate.getHours() + 1);
  nextDate.setMinutes(5);
  nextDate.setSeconds(0);

  var difference = nextDate - new Date();
  console.log(`Next update scheduled for ${nextDate.toLocaleString()}`);
  setTimeout(doSM, difference);
};

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

  doSM();
});

client.on('message', message => {
  // Only accept messages from TacoShack
  if (message.author.id !== '490707751832649738') return;

  try {
    let rawtext = message.embeds[0].description;
    let prices;
    prices = rawtext.match(/\$[0-9]{1,3} \|/g);
    prices = prices.map(s => parseInt(s.substring(1, s.length - 2)));
  
    // Get row from time
    let row = Math.floor(message.createdTimestamp / 3600000) - 451408;
    writePrices(row, prices);

  } catch {
    console.log('Something went wrong :(');
    setTimeout(doSM, 30 * 1000);
    return;
  }
});

client.login(process.env.TOKEN);