const nodemailer = require("nodemailer");
const SuspiciousLogin = require("../../models/SuspiciousLogin.modoal");
const UserContext = require("../../models/context.modal");
const EmailVerification = require("../../models/email.modal");
const { query, validationResult } = require("express-validator");

const {CLIENT_URL,EMAIL_SERVICE} = require("../../config/serverConfig")

var CLIENT_URL = CLIENT_URL;
var EMAIL_SERVICE = EMAIL_SERVICE;


const USER = "Depthprogramming@gmail.com"; 
const PASS = "cytt sxxp kcqy veeg\n"; 

const verifyLoginValidation = [
  query("email").isEmail().normalizeEmail(),
  query("id").isLength({ min: 24, max: 24 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

const sendLoginVerificationEmail = async (req, res) => {
  const currentContextData = req.currentContextData;
  const { email, name } = req.user;
  const id = currentContextData.id;
  const verificationLink = `${CLIENT_URL}/verify-login?id=${id}&email=${email}`;
  const blockLink = `${CLIENT_URL}/block-device?id=${id}&email=${email}`;

  try {
    let transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: USER,
        pass: PASS,
      },
    });

    const emailContent = verifyLoginHTML(
      name,
      verificationLink,
      blockLink,
      currentContextData
    );

    let info = await transporter.sendMail({
      from: `"SocialEcho" <${USER}>`,
      to: email,
      subject: "Action Required: Verify Recent Login",
      html: emailContent,
    });

    const newVerification = new EmailVerification({
      email,
      verificationCode: id,
      messageId: info.messageId,
      for: "login",
    });

    await newVerification.save();

    res.status(200).json({
      message: `Verification email sent to ${email}.`,
    });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyLogin = async (req, res) => {
  const { id, email } = req.query;

  try {
    const suspiciousLogin = await SuspiciousLogin.findById(id);

    if (!suspiciousLogin || suspiciousLogin.email !== email) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    const newContextData = new UserContext({
      user: suspiciousLogin.user,
      email: suspiciousLogin.email,
      ip: suspiciousLogin.ip,
      city: suspiciousLogin.city,
      country: suspiciousLogin.country,
      device: suspiciousLogin.device,
      deviceType: suspiciousLogin.deviceType,
      browser: suspiciousLogin.browser,
      os: suspiciousLogin.os,
      platform: suspiciousLogin.platform,
    });

    await newContextData.save();
    await SuspiciousLogin.findOneAndUpdate(
      { _id: { $eq: id } },
      { $set: { isTrusted: true, isBlocked: false } },
      { new: true }
    );

    res.status(200).json({ message: "Login verified" });
  } catch (err) {
    console.error("Error verifying login:", err);
    res.status(500).json({ message: "Could not verify your login" });
  }
};

const blockLogin = async (req, res) => {
  const { id, email } = req.query;

  try {
    const suspiciousLogin = await SuspiciousLogin.findById(id);

    if (!suspiciousLogin || suspiciousLogin.email !== email) {
      return res.status(400).json({ message: "Invalid verification link" });
    }

    await SuspiciousLogin.findOneAndUpdate(
      { _id: { $eq: id } },
      { $set: { isBlocked: true, isTrusted: false } },
      { new: true }
    );

    res.status(200).json({ message: "Login blocked" });
  } catch (err) {
    console.error("Error blocking login:", err);
    res.status(500).json({ message: "Could not block your login" });
  }
};

module.exports = {
  verifyLoginValidation,
  sendLoginVerificationEmail,
  verifyLogin,
  blockLogin,
};