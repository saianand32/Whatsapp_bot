const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios')
const HELP = "use only these commands - \n1. pls meme\n 2. pls joke"

const client = new Client({
  puppeteer: {
    executablePath: '/usr/bin/brave-browser-stable',
  },
  authStrategy: new LocalAuth({
    clientId: "client-one"
  }),
  puppeteer: {
    headless: false,
  }
});

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
  console.log('WHATSAPP WEB => Authenticated');
});

client.on("ready", async() => {
  console.log("WHATSAPP WEB => Ready");
});

client.on('message', async message => {
  const content = message.body

  if (content === "pls meme") {
    const meme = await axios('https://meme-api.herokuapp.com/gimme')
      .then(res => res.data)

    client.sendMessage(message.from, await MessageMedia.fromUrl(meme.url))
  }
  else if (content == "pls joke") {
    const joke = await axios("https://v2.jokeapi.dev/joke/Any?safe-mode")
      .then(res => res.data)

    const jokeMsg = await client.sendMessage(message.from, joke.setup || joke.joke)
    if (joke.delivery) setTimeout(() => {
      jokeMsg.reply(joke.delivery)
    }, 4000)
  }
  else{
    const jokeMsg = await client.sendMessage(message.from, HELP)
  }
});

