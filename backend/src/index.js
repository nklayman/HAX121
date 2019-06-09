import 'dotenv/config';

const express = require('express');

const app = express();

const middleware = require('./middleware');
const APIRouters = require('./api/routers');

// SETUP MIDDLEWARE AND ROUTERS
// Add Middleware
app.use(middleware.bodyParserJSON);
app.use(middleware.bodyParserURLEncoded);
app.use(middleware.cors);
app.use(middleware.returnType);

app.get('/', (req, res) => res.send('This is the backend for HAX121. Please use /api endpoints'));

// Add Routers
app.use('/api/auth', APIRouters.AuthRouter);

app.listen(9121, () => {});
