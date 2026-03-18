const axios = require('axios');

const sendMail = async (recipientEmail, subject, content) => {
    if (!recipientEmail) {
        throw new Error('recipientEmail is required to send email');
    }

    try {
        await axios.post(
            process.env.NOTI_SERVICE + '/notiservice/api/v1/notifications',
            {
                subject: subject,
                recipientEmail: [recipientEmail],
                content: content,
            },{
                headers: {
                    'Content-Type': 'application/json',
                },
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