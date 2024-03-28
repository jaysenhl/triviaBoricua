const questions = require('./questions.json');

exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            questions: questions
        })
    };
};
