const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("dotenv").config();


const app = express();
passportUserConfig();
passportAdminConfig();
//passport 내부의 코드를 실행하기 위해
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
        secret: "beansecret",
        cookie: {
            httpOnly: true,
            secure: false
        }
    })
);

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});