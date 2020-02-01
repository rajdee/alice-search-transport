let sessions;

module.exports = class SessionsDAO {
    static async connectDB(client) {
        try {
            sessions = await client.db(process.env.NS).collection('sessions');
            console.log('connected');

        } catch (e) {
            console.error(`Unable to establish collection handles in sessionsDAO: ${e}`)
        }
        return sessions;
    }

    static async addSession(request) {
        /*
        * @param {Object} from, to, date, transport_type, session_id
        */
        try {
            return await sessions.insertOne(request);
        } catch (e) {
            console.error(`Unable to add session data: ${e}`)
            return { error: e }
        }
    }

    static async getSession(session_id) {
        /*
        * @param {string} session_id
        */
        try {
            return await sessions.findOne({ session_id });
        } catch (e) {
            console.error(`Unable to add find user: ${e}`)
            return { error: e }
        }
    }
}
