const nodemailer = require("nodemailer");

const sendEmail = ({ recipient_email, OTP }) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const email_config = {
      from: process.env.EMAIL_USERNAME,
      to: recipient_email,
      subject: "OTP lấy lại mật khẩu",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OTP Email Template</title>
</head>
<body>
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Facebook</a>
    </div>
    <p style="font-size:1.1em">Xin chào</p>
    <p>Tuyệt đối không chia sẻ mã cho bất kỳ ai. OTP có hiệu lực trong 5 phút</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />Facebook</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Facebook</p>
      <p>Hà Nội</p>
    </div>
  </div>
</div>
</body>
</html>`,
    };
    transporter.sendMail(email_config, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `Có lỗi khi gửi email` });
      }
      return resolve({ message: "Email gửi thành công" });
    });
  });
};

module.exports = sendEmail;
