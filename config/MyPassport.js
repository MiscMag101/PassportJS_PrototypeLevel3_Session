// Import User model
const MyUser = require('../models/user.js');

// Import Passport middleware
const MyPassport = require('passport');

// Import GitHub Strategy for Passport
const MyGitHubStrategy = require('passport-github').Strategy;

// Configure the new GitHub Strategy for Passport
MyPassport.use(new MyGitHubStrategy(
  
  // Settings for GitHub Strategy
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://" + process.env.HOST + ":" + process.env.PORT + "/signin/github/callback",
    scope: "read:user"
  },
  
  // Verification function
  function(accessToken, refreshToken, profile, done) {
    
    MyUser.findOrCreate(profile, function (err, user) {
      
      // If technical error occurs (such as loss connection with database)
      if (err) {
        return done(err);
      }
      
      // If user doesn't exist (this case should never happen with this Strategy because a new user will be automatically created)
      if (!user) {
        return done(null, false);
      }
      
      // If everything all right, the user will be authenticated
      return done(null, user);
        
    });
               
  }

));


// Save user object into the session
MyPassport.serializeUser(function (user, done) {
  
  // If user doesn't exist
  if (!user) {
    return done(null, false);
  }
  
  // If everything all right, store object into the session
  return done(null, user.id);
  
});


// Restore user object from the session
MyPassport.deserializeUser(function (id, done) {
    
  MyUser.findById(id, function (err, user) {
      
    // If technical error occurs (such as loss connection with database)
    if (err) {
      return done(err);
    }
      
    // If user doesn't exist
    if (!user) {
      return done(null, false);
    }
      
    // If everything all right, the user will be authenticated
    return done(null, user);
      
  });
    
});


// Export passport object
module.exports = MyPassport
 
