const mongoose = require('mongoose')

module.exports= {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        };

        mongoose.connect('mongodb+srv://egg:Missiontotheloot1Uzi@cluster0.tah2q.mongodb.net/Snitch?retryWrites=true&w=majority', dbOptions);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log("Mongooses has successfully connected!")
        });

        mongoose.connection.on('err', err => {
            console.error(`Mongoose connection error: \n${err.stack}`)
        });

        mongoose.connection.on('disconnected', () => {
            console.warn("Mongoose connection lost")
        })
    }
}