const express = require('express');
const {
    isLoggedIn,
    isNotLoggedIn
} = require('./loginCheck');
const User = require('../schemas/user');
const router = express.Router();

router.post('/signup', isNotLoggedIn, async (req, res, next) => {
    const {
        name,
        age,
        id,
        password
    } = req.body;
    try {
        const exUser = await User.find({
            where: {
                id
            }
        });
        if (exUser) {
            console.log('이미 가입된 아이디 입니다');
        }
        await User.create({
            name,
            age,
            id,
            password
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            console.log(info.message);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
        });
    })(req, res, next);
});

router.get('/exit', isLoggedIn, (req, res, next) => {
    req.logout();
    req.session.destroy();
});

module.exports = router;