import dotenv from 'dotenv';
dotenv.config();
import Mailgun from 'mailgun-js';

const mailGunClient = new Mailgun({
    apiKey : process.env.MAILGUN_API_KEY || '',
    domain : "sandboxca98b0bf5cab4331ad80b5a12a463996.mailgun.org"
})

const sendEmail = (subject : string, html : string) => {
    const emailData = {
        from : "caublind_admin@caublind.com",
        to : "sjly3k@gmail.com",
        subject,
        html
    }
    return mailGunClient.messages().send(emailData)
}

export const sendVerificationEmail = (fullName : string, key : string) => {
    const emailSubject = `Hello~ ${fullName}, please verify your email`;
    const emailBody = `Verify your email by clicking <a href="http://number.com/verification/${key}/">here</a>`;
    return sendEmail(emailSubject, emailBody);
}