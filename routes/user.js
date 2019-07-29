const express = require('express');
const {
    isLoggedIn,
    isNotLoggedIn
} = require('./loginCheck');
const passport = require('passport');
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
        const exUser = await User.findOne({
            id: id
        });
        if (exUser) {
            console.log('이미 가입된 아이디 입니다');
            res.send('이미 가입된 아이디 입니다.');
        }
        await User.create({
            name,
            age,
            id,
            password
        });
        console.log('회원가입 성공');
        res.send('회원가입 성공');
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
            res.send("로그인 성공");
            console.log('로그인 성공');
        });
    })(req, res, next);
});

router.get('/exit', isLoggedIn, (req, res, next) => {
    req.logout();
    req.session.destroy();
});

module.exports = router;