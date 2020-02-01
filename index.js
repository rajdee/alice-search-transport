require('dotenv').config();

const directions = require('./sirena_cities_map');

const api = require('./api');
const connectDB = require('./DAO');
const SessionsDAO = require('./DAO/sessionsDAO');
const getCity = require('./helpers/getCity');

module.exports.handler = async (event, context) => {
    const { version, session, request } = event;
    const utterance = request['original_utterance'].toLowerCase();

    const cities = request.nlu.entities.length > 0
        ? getCity(request.nlu.entities[0])
        : {};

    const transport_type = {
        "bus": "автобус",
        "suburban": "электричка",
        "plane": "самолёт",
        "train": "поезд"
    };

    let text = 'Команда не распознана';
    let tts = null;
    if (utterance === "помощь") {
        text = "Могу найти ближайший транспорт в другой город; для выхода скажи отбой.";
    } else if (utterance === "что ты умеешь?") {
        text = "Могу найти ближайший транспорт в другой город";
    } else if (directions[cities.from]) {
        await connectDB().then(async session_instance => {
            const session_object = await SessionsDAO.getSession(session.session_id);
            if (session_object) {
                const data = await api({
                    from: session_object.from,
                    to: cities.from,
                    limit: 3
                });
                text = "";
                for (let [type, transports_array] of Object.entries(data)) {
                    text += `${transport_type[type] || type}\n`;
                    transports_array.forEach(function (transport) {
                        text += `${transport.departure}\n`;
                    });
                }
                text = text.length !== 0 ? text : "Ничего не найдено";
                tts = text.length !== 0 ? "Вот несколько вариантов" : "Ничего не найдено";
            } else {
                await SessionsDAO.addSession({
                    from: cities.from,
                    //to: 'Севастополь',
                    session_id: session.session_id
                });
                text = "Куда хочешь поехать?";
            }
        });
    } else {
        text = "Я не понимаю. Если нужна помощь, скажи помощь.";
    }

    if (utterance.length === 0) {
        text = 'Привет. Я помогу тебе добраться в другой город. Куда хочешь поехать?';
    }

    if (utterance == "отбой") {
        return {
            version,
            session,
            response: {
                text: 'Всего доброго',
                end_session: true,
            },
        };
    } else {
        return {
            version,
            session,
            response: {
                text: text,
                tts: tts || text,
                end_session: false,
            },
        };
    }
};
