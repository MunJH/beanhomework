const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../schemas/user');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password'
    }, async (id, password, done) => {
        try {
            const exUser = await User.findOne({
                id: id
            }, (err, user) => {
                if (err) {
                    done(null, false, {
                        message: '오류 발생!'
                    });
                }
                if (!user) {
                    done(null, false, {
                        message: '가입되지 않은 회원입니다.'
                    });
                }
            });

            if (exUser) {
                // const result = await bcrypt.compare(password, exUser.password);
                if (exUser.password == password) {
                    done(null, exUser);
                } else {
                    done(null, false, {
                        message: '비밀번호가 일치하지 않습니다.'
                    });
                }
            } else {
                done(null, false, {
                    message: '가입되지 않은 회원입니다.'
                });
            }
        } catch (error) {
            console.log(error);
            done(error);
        }
    }));
};