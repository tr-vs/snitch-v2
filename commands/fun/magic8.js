const { Command } = require('discord-akairo');

class BallCommand extends Command {
    constructor() {
        super('magic8ball', {
            aliases: ['Magic8Ball', '8Ball', 'Magic8'],
            category: "fun",
            description : {
                content : 'Ask the bot a random question with a yes or no answer!',
                usage : ['magic8ball', '8ball']
            },
        });
    }

    async exec(message) {
        let response = ["As I see it, yes.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don’t count on it.", "It is certain.", "It is decidedly so.", "Most likely.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Outlook good.", "Reply hazy, try again.", "Signs point to yes.", "Very Doubtful.", "Without a doubt", "Yes.", "Yes - definitely.", "You may rely on it."]
        message.util.send("🎱| Let me see...")
        .then((msg)=> {
            setTimeout(function(){
                msg.edit(response[Math.floor(Math.random() * response.length)]);
            }, 2000)
        }); 
    }
}

module.exports = BallCommand;