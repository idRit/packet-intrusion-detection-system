const csv = require("csvtojson");
const io = require('socket.io-client');
const socket = io('http://localhost:8030');

const kMeans = require('./multiclass.lib');
const logisticRegression = require('./logistic.lib');
const neuralNetwork = require('./ann.lib');

let row1 = ['tcp', 'icmp', 'udp'];
let row2 = ['private', 'ftp_data', 'eco_i', 'telnet', 'http', 'smtp', 'ftp', 'ldap', 'pop_3', 'courier', 'discard', 'ecr_i', 'imap4', 'domain_u', 'mtp', 'systat', 'iso_tsap', 'other', 'csnet_ns', 'finger', 'uucp', 'whois', 'netbios_ns', 'link', 'Z39_50', 'sunrpc', 'auth', 'netbios_dgm', 'uucp_path', 'vmnet', 'domain', 'name', 'pop_2', 'http_443', 'urp_i', 'login', 'gopher', 'exec', 'time', 'remote_job', 'ssh', 'kshell', 'sql_net', 'shell', 'hostnames', 'echo', 'daytime', 'pm_dump', 'IRC', 'netstat', 'ctf', 'nntp', 'netbios_ssn', 'tim_i', 'supdup', 'bgp', 'nnsp', 'rje', 'printer', 'efs', 'X11', 'ntp_u', 'klogin', 'tftp_u'];
let row3 = ['REJ', 'SF', 'RSTO', 'S0', 'RSTR', 'SH', 'S3', 'S2', 'S1', 'RSTOS0', 'OTH'];

const csvFilePath = __dirname + "/dataset/NSL_KDD_Test.csv";

const run = async (index) => {
    const jsonArray = await csv().fromFile(csvFilePath);

    let dataPoint = jsonArray[index];

    let ind1 = row1.indexOf(Object.values(dataPoint)[1]);
    let ind2 = row2.indexOf(Object.values(dataPoint)[2]);
    let ind3 = row3.indexOf(Object.values(dataPoint)[3]);

    let values = Object.values(dataPoint).map(el => parseFloat(el));
    values[1] = ind1;
    values[2] = ind2;
    values[3] = ind3;

    values.pop();

    const point = [...values, ...Object.values(dataPoint).slice(-1)];

    // console.log(point);

    let packet = {
        kMeans: await kMeans(point),
        logisticRegression: await logisticRegression(point),
        neuralNetwork: await neuralNetwork(values),
    };

    return packet;
}

const runner = async (iterator) => {
    const jsonArray = await csv().fromFile(csvFilePath);
    // console.log(jsonArray.length);

    if (iterator == jsonArray.length) {
        clearInterval(intervalId);
    }
    let packet = await run(iterator);
    let frame = jsonArray[iterator];
    delete frame.label;

    packet.frame = frame;

    console.log(packet);

    //Todo: implement socket emitter
    socket.emit('packet', JSON.stringify(packet));

    iterator++;
}

// runner();

module.exports = runner;