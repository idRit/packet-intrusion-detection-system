var jsregression = require('js-regression');
const csv = require("csvtojson");
const fs = require('fs');

// var trainingDataSize = Math.round(iris.rowCount * 0.9);
// var trainingData = [];
// var testingData = [];
// for (var i = 0; i < iris.rowCount; ++i) {
//     var row = [];
//     row.push(iris.data[i][0]); // sepalLength;
//     row.push(iris.data[i][1]); // sepalWidth;
//     row.push(iris.data[i][2]); // petalLength;
//     row.push(iris.data[i][3]); // petalWidth;
//     row.push(iris.data[i][4]); // output is species
//     if (i < trainingDataSize) {
//         trainingData.push(row);
//     } else {
//         testingData.push(row);
//     }
// }

// console.log(testingData);

let row1 = [ 'tcp', 'icmp', 'udp' ]
let row2 = [
  'private',     'ftp_data', 'eco_i',      'telnet',
  'http',        'smtp',     'ftp',        'ldap',
  'pop_3',       'courier',  'discard',    'ecr_i',
  'imap4',       'domain_u', 'mtp',        'systat',
  'iso_tsap',    'other',    'csnet_ns',   'finger',
  'uucp',        'whois',    'netbios_ns', 'link',
  'Z39_50',      'sunrpc',   'auth',       'netbios_dgm',
  'uucp_path',   'vmnet',    'domain',     'name',
  'pop_2',       'http_443', 'urp_i',      'login',
  'gopher',      'exec',     'time',       'remote_job',
  'ssh',         'kshell',   'sql_net',    'shell',
  'hostnames',   'echo',     'daytime',    'pm_dump',
  'IRC',         'netstat',  'ctf',        'nntp',
  'netbios_ssn', 'tim_i',    'supdup',     'bgp',
  'nnsp',        'rje',      'printer',    'efs',
  'X11',         'ntp_u',    'klogin',     'tftp_u'
]
let row3 = [
  'REJ',  'SF',
  'RSTO', 'S0',
  'RSTR', 'SH',
  'S3',   'S2',
  'S1',   'RSTOS0',
  'OTH'
]


async function parseCSV() {
    const csvFilePath = "./NSL_KDD_Test.csv";
    const csvFilePath2 = "./NSL_KDD_Train.csv";
    const jsonArray = await csv().fromFile(csvFilePath);
    const jsonArray2 = await csv().fromFile(csvFilePath2);
    let trainingData = [];
    let testingData = [];

    // let arr = [], arr2 = [], arr3 = [];
    // for (let i = 0; i < jsonArray.length; i++) {
    //     arr.push(Object.values(jsonArray[i])[1]);
    //     arr2.push(Object.values(jsonArray[i])[2]);
    //     arr3.push(Object.values(jsonArray[i])[3]);
    // }

    // var filteredArray = arr.filter(function (item, pos) {
    //     return arr.indexOf(item) == pos;
    // });

    // var filteredArray2 = arr2.filter(function (item, pos) {
    //     return arr2.indexOf(item) == pos;
    // });

    // var filteredArray3 = arr3.filter(function (item, pos) {
    //     return arr3.indexOf(item) == pos;
    // });

    // console.log(filteredArray);
    // console.log(filteredArray2);
    // console.log(filteredArray3);

    for (let i = 0; i < 10; i++) {
        let ind1 = row1.indexOf(Object.values(jsonArray[i])[1]); 
        let ind2 = row2.indexOf(Object.values(jsonArray[i])[2]); 
        let ind3 = row3.indexOf(Object.values(jsonArray[i])[3]); 

        let values = Object.values(jsonArray[i]).map(el => parseFloat(el));
        values[1] = ind1;
        values[2] = ind2;
        values[3] = ind3;

        values.pop();
        testingData.push([...values, ...Object.values(jsonArray[i]).slice(-1)]);
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
        trainingData.push([...values, ...Object.values(jsonArray2[i]).slice(-1)]);
    }

    let obj = {
        trainingData: trainingData,
        testingData: testingData
    };

    // console.log(obj);

    return obj;
}

async function run() {
    let { trainingData, testingData } = await parseCSV();

    var classifier = new jsregression.MultiClassLogistic({
        alpha: 0.001,
        iterations: 1000,
        lambda: 0.0
    });

    let result = classifier.fit(trainingData);

    console.log(result);
    fs.writeFileSync("model.json", JSON.stringify(result));

    for (var i = 0; i < testingData.length; ++i) {
        var predicted = classifier.transform(testingData[i]);
        const [lastItem] = testingData[i].slice(-1)
        console.log("actual: " + lastItem + " predicted: " + predicted);
    }
}

run();

// parseCSV();