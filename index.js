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

app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.get('/', function (req, res) {
    res.render('pages/auth');
});
app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send('error logging in'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj)
})

// Google Authentication
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// Google ID
const GOOGLE_CLIENT_ID = 'our-google-client-id';
// Google Secret
const GOOGLE_CLIENT_SECRET = 'our-google-client-secret';
passport.use(new GoogleStrategy({
    cliendID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhosat:3000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        userProfile = profile;
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


