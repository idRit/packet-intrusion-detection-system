const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

//static serving
// app.use(express.static(path.join(__dirname, 'dist')));

// //manual catch all
// app.get('*', function (req, res) {
//     res.sendFile(__dirname + '/dist/index.html');
// });

// app.get('/', (req, res) => {
//     res.json({
//         working: true
//     });
// });

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

const server = app.listen(8030);
console.log('server started');

const io = require('socket.io')(server);
const aggregator = require('./lib/aggregator.route');

io.on('connection', socket => {

    console.log('someone connected');

    socket.on('reqData', obj => {
        aggregator(+obj);
        console.log('request sent');
    });

    socket.on('packet', packet => {
        console.log("here");
        io.emit('pkt', packet);
    });

    socket.on('disconnect', () => {
        console.log('someone disconnected');

    });
});
