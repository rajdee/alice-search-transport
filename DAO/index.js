const MongoClient = require('mongodb').MongoClient;

const SessionsDAO = require('./sessionsDAO');

const port = process.env.PORT || 5000;


let client;

const connectDB = async () => {
    try {
        // connect to db
        client = await MongoClient.connect(
            process.env.DB_URI,
            { useNewUrlParser: true },
        );
        await SessionsDAO.connectDB(client);
    }
    catch(err) {
      console.error(err.stack);
    }

    return client;
};

module.exports = connectDB;
