const nodemailer = require('nodemailer');

const mailer = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'minhtrung2606@gmail.com',
    pass: 'admin@NMT_2606!@#'
  }
});

class MailOption {
  constructor(to = '', subject = '', content = '') {
    this.from = 'minhtrung2606@gmail.com';
    this.to = to;
    this.subject = subject;
    this.html = content;
  }
}

mailer.sendMail = async (to = '', subject = '', content = '') => {
  const option = new MailOption(to, subject, content);
  try {
    await transporter.sendMail(option);
    return true;
  } catch (e) {
    console.log(`[Mailer]: Cannot send mail(to=${to}). ${e.message}`);
    return false;
  }
};

module.exports = mailer;
