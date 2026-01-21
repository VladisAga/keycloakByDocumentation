const session = require('express-session');
const Keycloak = require('keycloak-connect');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const memoryStore = new session.MemoryStore();

app.use(
    session({
        secret: 'mySecret',
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
    })
);

const keycloak = new Keycloak({ store: memoryStore });

app.use(keycloak.middleware());

const complaintHandler = (req, res) => {
    const user = req.kauth.grant.access_token.content;
    res.json({
        message: 'Доступ разрешён!',
        user: {
            email: user.email,
            username: user.preferred_username
        }
    });
};

app.get( '/complain', keycloak.protect(), complaintHandler );

app.listen(3000, function () {
    console.log('App listening on port 3000');
});

