const express = require('express');
const router = new express.Router();
const passport = require('passport');


/* router.get('/facebook/callback', passport.authenticate('facebookToken', { session: false }),
    function (req, res) {
        res.redirect('/');
    }) */

router.get('/facebook',
    passport.authenticate('facebook'));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {

        res.redirect('/');
    });

module.exports = router;