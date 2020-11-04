const jwt = require('jsonwebtoken');
module.exports = {
  generarTokenConReq: async (req, res, next) => {

    // Generate token
    const token = jwt.sign({ userId: req.user._id }, process.env.TokenKey);
    res.send({ token });
    
  }
}