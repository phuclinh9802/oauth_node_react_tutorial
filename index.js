/*  
    Write express server code to accept web requests
*/

// web server setup
// define express 
const express = require('express')

const app = express();
const session = require('express-session');

// set up passport
const passport = require('passport');
var userProfile;
var title;

const dotenv = require('dotenv').config();

app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET',
    cookie: {
        secure: true
    }
}));

app.get('/', function (req, res) {
    res.render('pages/auth');
});

app.set('view engine', 'ejs');
// app.get('/success', (req, res) => res.send(userProfile));
app.get('/success', (req, res) => res.render('pages/success', { user: userProfile }));
app.get('/error', (req, res) => res.send('error logging in'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));

passport.serializeUser(function (user, cb) {
    return cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    return cb(null, obj)
})

// Google Authentication
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// Google ID
const GOOGLE_CLIENT_ID = '597837144580-s70kcs34078lia98907thsuhuj2g16c4.apps.googleusercontent.com';
// Google Secret
const GOOGLE_CLIENT_SECRET = 'eSJeMyM5eeCGjBmyHWcIl9KR';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        userProfile = profile;
        title = 'Google';
        return done(null, userProfile);
    }
));

// authenticate with email
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {
        // Successfull authentication, redirect success
        res.redirect('/success')
    }
)


// Facebook Authentication
const FaceBookStrategy = require('passport-facebook').Strategy;
// Facebook ID
const FACEBOOK_APP_ID = '529163718211919';
// Facebook Secret
const FACEBOOK_APP_SECRET = 'b9b53735a5ba5ef65dfc836d28787c6c';
// Configuration
passport.use(new FaceBookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        userProfile = profile;
        title = "Facebook";
        return cb(null, userProfile)
    }
));

//authenticate Facebook request 
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/error' }),
    function (req, res) {
        // Successful authentication
        res.redirect('/success');
    }
)
