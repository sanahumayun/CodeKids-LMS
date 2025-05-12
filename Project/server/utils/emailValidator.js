const axios = require("axios");

const verifyEmailExists = async (email) => {
  try {
    const res = await axios.get(`http://apilayer.net/api/check`, {
      params: {
        access_key: process.env.MAILBOXLAYER_API_KEY,
        email,
        smtp: 1,
        format: 1,
      },
    });

    return res.data.smtp_check && res.data.format_valid && res.data.mx_found;
  } catch (err) {
    console.error("Email validation error:", err.message);
    return false; // fallback: assume invalid
  }
};

module.exports = verifyEmailExists;
