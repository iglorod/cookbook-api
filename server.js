const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(port);

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

const userRoutes = require('./api/routes/user');
const recipeRoutes = require('./api/routes/recipe');

mongoose.connect('mongodb+srv://igLa:' + process.env.MONGO_PSW + '@cluster0-3h3ym.mongodb.net/cookbook?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(Error, err.message);
    });

app.use(morgan('dev'));

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/user', userRoutes);
app.use('/recipe', recipeRoutes);

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})
