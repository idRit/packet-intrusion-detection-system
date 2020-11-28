const clusterfck = require("tayden-clusterfck");
const csv = require("csvtojson");
var kmeans = new clusterfck.Kmeans();

let row1 = ['tcp', 'icmp', 'udp'];
let row2 = ['private', 'ftp_data', 'eco_i', 'telnet', 'http', 'smtp', 'ftp', 'ldap', 'pop_3', 'courier', 'discard', 'ecr_i', 'imap4', 'domain_u', 'mtp', 'systat', 'iso_tsap', 'other', 'csnet_ns', 'finger', 'uucp', 'whois', 'netbios_ns', 'link', 'Z39_50', 'sunrpc', 'auth', 'netbios_dgm', 'uucp_path', 'vmnet', 'domain', 'name', 'pop_2', 'http_443', 'urp_i', 'login', 'gopher', 'exec', 'time', 'remote_job', 'ssh', 'kshell', 'sql_net', 'shell', 'hostnames', 'echo', 'daytime', 'pm_dump', 'IRC', 'netstat', 'ctf', 'nntp', 'netbios_ssn', 'tim_i', 'supdup', 'bgp', 'nnsp', 'rje', 'printer', 'efs', 'X11', 'ntp_u', 'klogin', 'tftp_u'];
let row3 = ['REJ', 'SF', 'RSTO', 'S0', 'RSTR', 'SH', 'S3', 'S2', 'S1', 'RSTOS0', 'OTH'];
let lastRow = ['neptune', 'normal', 'saint', 'mscan', 'guess_passwd', 'smurf', 'apache2', 'satan', 'buffer_overflow', 'back', 'warezmaster', 'snmpgetattack', 'processtable', 'pod', 'httptunnel', 'nmap'];

// async function parseCSV() {
//     const csvFilePath = "./dataset/NSL_KDD_Test.csv";
//     const csvFilePath2 = "./dataset/NSL_KDD_Train.csv";
//     const jsonArray = await csv().fromFile(csvFilePath);
//     const jsonArray2 = await csv().fromFile(csvFilePath2);
//     let trainingData = [];
//     let testingData = [];

//     for (let i = 0; i < 100; i++) {
//         let ind1 = row1.indexOf(Object.values(jsonArray[i])[1]);
//         let ind2 = row2.indexOf(Object.values(jsonArray[i])[2]);
//         let ind3 = row3.indexOf(Object.values(jsonArray[i])[3]);

//         let indLast = lastRow.indexOf(Object.values(jsonArray[i]).slice(-1)[0]);

//         let values = Object.values(jsonArray[i]).map(el => parseFloat(el));
//         values[1] = ind1;
//         values[2] = ind2;
//         values[3] = ind3;

//         values.pop();

//         testingData.push([...values, indLast]);
//     }

//     for (let i = 0; i < 100; i++) {
//         let ind1 = row1.indexOf(Object.values(jsonArray2[i])[1]);
//         let ind2 = row2.indexOf(Object.values(jsonArray2[i])[2]);
//         let ind3 = row3.indexOf(Object.values(jsonArray2[i])[3]);

//         let indLast = lastRow.indexOf(Object.values(jsonArray[i]).slice(-1)[0]);

//         let values = Object.values(jsonArray2[i]).map(el => parseFloat(el));
//         values[1] = ind1;
//         values[2] = ind2;
//         values[3] = ind3;

//         values.pop();

//         trainingData.push([...values, indLast]);
//     }

//     let obj = {
//         trainingData: trainingData,
//         testingData: testingData
//     };

//     console.log(obj);

//     return obj;
// }

async function parseCSV() {
    const csvFilePath = "./dataset/NSL_KDD_Test.csv";
    const csvFilePath2 = "./dataset/NSL_KDD_Train.csv";
    const jsonArray = await csv().fromFile(csvFilePath);
    const jsonArray2 = await csv().fromFile(csvFilePath2);
    let trainingData = [];
    let testingData = [];

    for (let i = 0; i < 100; i++) {
        let ind1 = row1.indexOf(Object.values(jsonArray[i])[1]); 
        let ind2 = row2.indexOf(Object.values(jsonArray[i])[2]); 
        let ind3 = row3.indexOf(Object.values(jsonArray[i])[3]); 

        let values = Object.values(jsonArray[i]).map(el => parseFloat(el));
        values[1] = ind1;
        values[2] = ind2;
        values[3] = ind3;

        values.pop();

        let normal = Object.values(jsonArray[i]).slice(-1) == "normal" ? 1.0 : 0.0;

        testingData.push([...values, normal]);
    }

    for (let i = 0; i < 1000; i++) {
        let ind1 = row1.indexOf(Object.values(jsonArray2[i])[1]); 
        let ind2 = row2.indexOf(Object.values(jsonArray2[i])[2]); 
        let ind3 = row3.indexOf(Object.values(jsonArray2[i])[3]); 

        let values = Object.values(jsonArray2[i]).map(el => parseFloat(el));
        values[1] = ind1;
        values[2] = ind2;
        values[3] = ind3;

        values.pop();

        let normal = Object.values(jsonArray[i]).slice(-1) == "normal" ? 1.0 : 0.0;

        trainingData.push([...values, normal]);
    }

    let obj = {
        trainingData: trainingData,
        testingData: testingData
    };

    // console.log(obj);

    return obj;
}

const run = async () => {
    let { trainingData, testingData } = await parseCSV();

    var clusters = kmeans.cluster(trainingData, lastRow.length);

    var clusterIndex = kmeans.classify(testingData[0]);

    // console.log(clusters);
    // console.log(clusterIndex);

    return {
        clusterIndex,
        xy: lastRow.length
    };
}

const eval = async () => {
    let res = await run();

    console.log(res);
}

module.exports = run;
eval();
// parseCSV();