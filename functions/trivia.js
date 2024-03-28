const questions = require('./questions.json');

const allowedOrigins = [
    'https://boricuatriviatest.netlify.app',
    'http://localhost:8888', // Añade tus orígenes de desarrollo aquí
];

exports.handler = async function(event, context) {
    const origin = event.headers.origin;
    const isAllowed = allowedOrigins.includes(origin);

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        // Tu lógica de la función aquí
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ questions })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ error: "Error interno del servidor" })
        };
    }
};
