const axios = require('axios');

const sendMail = async (email, subject, content) => {
    console.log("NOTI_SERVICE:", process.env.NOTI_SERVICE);

    try {
        await axios.post(
            process.env.NOTI_SERVICE + '/notiservice/api/v1/notifications',
            {
                subject,
                recipientEmail: [email],
                content
            }
        );
    } catch (error) {
        console.error(
            'Error sending email:',
            error.response?.data || error.message
        );
        throw error;
    }
};

module.exports = sendMail;