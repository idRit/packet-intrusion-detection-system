const { train, mod } = require('@tensorflow/tfjs');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const csv = require("csvtojson");

let row1 = ['tcp', 'icmp', 'udp'];
let row2 = ['private', 'ftp_data', 'eco_i', 'telnet', 'http', 'smtp', 'ftp', 'ldap', 'pop_3', 'courier', 'discard', 'ecr_i', 'imap4', 'domain_u', 'mtp', 'systat', 'iso_tsap', 'other', 'csnet_ns', 'finger', 'uucp', 'whois', 'netbios_ns', 'link', 'Z39_50', 'sunrpc', 'auth', 'netbios_dgm', 'uucp_path', 'vmnet', 'domain', 'name', 'pop_2', 'http_443', 'urp_i', 'login', 'gopher', 'exec', 'time', 'remote_job', 'ssh', 'kshell', 'sql_net', 'shell', 'hostnames', 'echo', 'daytime', 'pm_dump', 'IRC', 'netstat', 'ctf', 'nntp', 'netbios_ssn', 'tim_i', 'supdup', 'bgp', 'nnsp', 'rje', 'printer', 'efs', 'X11', 'ntp_u', 'klogin', 'tftp_u'];
let row3 = ['REJ', 'SF', 'RSTO', 'S0', 'RSTR', 'SH', 'S3', 'S2', 'S1', 'RSTOS0', 'OTH'];
let lastRow = ['neptune', 'normal', 'saint', 'mscan', 'guess_passwd', 'smurf', 'apache2', 'satan', 'buffer_overflow', 'back', 'warezmaster', 'snmpgetattack', 'processtable', 'pod', 'httptunnel', 'nmap'];
let shapes = ['duration', 'protocol_type', 'service', 'flag', 'src_bytes', 'dst_bytes', 'land', 'wrong_fragment', 'urgent', 'hot', 'num_failed_logins', 'logged_in', 'num_compromised', 'root_shell', 'su_attempted', 'num_root', 'num_file_creations', 'num_shells', 'num_access_files', 'num_outbound_cmds', 'is_host_login', 'is_guest_login', 'count', 'srv_count', 'serror_rate', 'srv_serror_rate', 'rerror_rate', 'srv_rerror_rate', 'same_srv_rate', 'diff_srv_rate', 'srv_diff_host_rate', 'dst_host_count', 'dst_host_srv_count', 'dst_host_same_srv_rate', 'dst_host_diff_srv_rate', 'dst_host_same_src_port_rate', 'dst_host_srv_diff_host_rate', 'dst_host_serror_rate', 'dst_host_srv_serror_rate', 'dst_host_rerror_rate', 'dst_host_srv_rerror_rate'];


async function parseCSV() {
    const csvFilePath = "./dataset/NSL_KDD_Test.csv";
    const csvFilePath2 = "./dataset/NSL_KDD_Train.csv";
    const jsonArray = await csv().fromFile(csvFilePath);
    const jsonArray2 = await csv().fromFile(csvFilePath2);
    let trainingData = [];
    let testingData = [];
    let outputArray = [];

    for (let i = 0; i < 10; i++) {
        let ind1 = row1.indexOf(Object.values(jsonArray[i])[1]);
        let ind2 = row2.indexOf(Object.values(jsonArray[i])[2]);
        let ind3 = row3.indexOf(Object.values(jsonArray[i])[3]);

        let values = Object.values(jsonArray[i]).map(el => parseFloat(el));
        values[1] = ind1;
        values[2] = ind2;
        values[3] = ind3;

        values.pop();

        testingData.push([...values]);
    }

    for (let i = 0; i < jsonArray2.length; i++) {
        let ind1 = row1.indexOf(Object.values(jsonArray2[i])[1]);
        let ind2 = row2.indexOf(Object.values(jsonArray2[i])[2]);
        let ind3 = row3.indexOf(Object.values(jsonArray2[i])[3]);

        let values = Object.values(jsonArray2[i]).map(el => parseFloat(el));
        values[1] = ind1;
        values[2] = ind2;
        values[3] = ind3;

        values.pop();

        let outputData = [];
        let index = lastRow.indexOf(Object.values(jsonArray2[i]).slice(-1)[0]);

        if (index !== -1) {
            lastRow.forEach((el, i) => {
                if (i === index) outputData.push(1);
                else outputData.push(0);
            });

            outputArray.push(outputData);

            trainingData.push([...values]);
        }
    }

    let obj = {
        trainingData,
        testingData,
        outputArray,
    };

    // console.log(obj.outputArray[0]);

    return obj;
}

async function trainSet() {
    let data = await parseCSV();

    // Setup Data
    const trainingData = tf.tensor2d(data.trainingData);
    const outputData = tf.tensor2d(data.outputArray);
    const testingData = tf.tensor2d(data.testingData);

    // Build Neural Network
    const model = tf.sequential();

    model.add(tf.layers.dense({
        inputShape: shapes.length,
        activation: "sigmoid",
        units: shapes.length
    }));
    model.add(tf.layers.dense({
        activation: "sigmoid",
        units: lastRow.length + 5
    }));
    model.add(tf.layers.dense({
        activation: "sigmoid",
        units: lastRow.length
    }));

    model.compile({
        loss: "meanSquaredError",
        optimizer: tf.train.adam(0.06)
    });

    try {
        let history = await model.fit(trainingData, outputData, { epochs: 10 });
        // console.log(history);
        await model.save('file:///home/red/Projects/packet-intrusion-detection-system/lib/models/nsl-kdd-model');

        model.predict(testingData).print();
    } catch (error) {
        console.error(error);
    }

}

async function test() {
    const model = await tf.loadLayersModel('file://' + __dirname + '/models/nsl-kdd-model/model.json');
    try {
        let data = await parseCSV();
        const testingData = tf.tensor2d([data.testingData[0]]);

        let el = model.predict(testingData);

        console.log(el.arraySync()[0]);
        return el.arraySync()[0]

    } catch (error) {
        console.error(error);
    }
}

module.exports = async (dataPoint) => {
    const model = await tf.loadLayersModel('file://' + __dirname + '/models/nsl-kdd-model/model.json');
    try {
        const testingData = tf.tensor2d([dataPoint]);

        let el = model.predict(testingData);

        let x = el.arraySync()[0];

        x.map(e => Math.round(e));

        console.log(x);

        let obj = [];

        x.forEach((el, i) => {
            obj.push({
                score: el,
                label: lastRow[i]
            });
        });

        return obj;
    } catch (error) {
        console.error(error);
    }
}

// const getDataPoint = async (index) => {

// }

// run();

// trainSet();