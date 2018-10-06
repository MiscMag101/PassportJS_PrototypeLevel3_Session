var express = require('express');
var router = express.Router();

// Define if secure cookie can be used
const SecureCookie = false;
if(process.env.SECURE_COOKIE == "yes"){
  SecureCookie = true;  
}

/* GET home page. */
router.get('/', function(req, res) {
  req.logout();
  req.session.destroy();
  res.clearCookie('connect.sid', {path: '/', httpOnly: true, secure: SecureCookie, maxAge: 60000});
  res.redirect('/');
});

module.exports = router; 
