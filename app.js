const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require('passport');
const passportConfig = require('./passport');

const userRouter = require('./routes/user');
const connect = require('./schemas');

const app = express();
connect();
passportConfig(passport);

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        name: "sessionID",
        resave: false,
        saveUninitialized: true,
        secret: "beansecret", //테스트이기 때문에 공개로 함.
        cookie: {
            httpOnly: true,
            secure: false
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouter);

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});