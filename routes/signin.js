// Import Express module
const express = require('express');
const router = express.Router();

// Passport Setup
const MyPassport = require('passport');

// route to start OAuth2 authentication flow with Github
router.get('/github',MyPassport.authenticate('github'));

// route for callback from GitHub
router.get('/github/callback',
           
// Get user profile with authorization code and access token
MyPassport.authenticate('github', {session: true}),

  // Greeting
  function(req, res) {
    res.redirect('/private/greeting');
  }


);

module.exports = router;
 
