const bcrypt = require("bcryptjs");
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  return hashedpassword;
};

const comparepassword = async (enterpassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(enterpassword, hashedPassword);
  return isMatch;
};
module.exports = { hashPassword, comparepassword };
