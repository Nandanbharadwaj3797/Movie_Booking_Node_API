const axios = require('axios');

const sendMail = async (recipientEmail, subject, content) => {
    if (!recipientEmail) {
        throw new Error('recipientEmail is required to send email');
    }

    if (!process.env.NOTI_SERVICE) {
        throw new Error('NOTI_SERVICE is not configured');
    }

    try {
        await axios.post(
            `${process.env.NOTI_SERVICE}/notiservice/api/v1/notifications`,
            {
                subject,
                recipientEmail: [recipientEmail],
                content
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 5000 // avoid hanging requests
            }
        );
    } catch (error) {
        console.error(
            'Error sending email:',
            error.response?.data || error.message
        );

        throw new Error(
            error.response?.data?.message || 'Failed to send email'
        );
    }
};

module.exports = sendMail;