
const jwt = require('jsonwebtoken');
module.exports = {
  generarTokenConReq: async (req, res, next) => {
    // Generate token
    console.log ("hago el token, tengo el usuario?: " + req.user._id);
    const token = jwt.sign({ userId: req.user._id }, process.env.TokenKey);
    res.send({ token });
    //res.redirect('/');
    
  }
}