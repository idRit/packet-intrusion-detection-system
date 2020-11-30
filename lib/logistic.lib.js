const jsregression = require('js-regression');
const csv = require("csvtojson");
const fs = require('fs');

let row1 = ['tcp', 'icmp', 'udp'];
let row2 = [
    'private', 'ftp_data', 'eco_i', 'telnet','http', 'smtp', 'ftp', 'ldap','pop_3', 'courier', 'discard', 'ecr_i','imap4', 'domain_u', 'mtp', 'systat','iso_tsap', 'other', 'csnet_ns', 'finger','uucp', 'whois', 'netbios_ns', 'link','Z39_50', 'sunrpc', 'auth', 'netbios_dgm','uucp_path', 'vmnet', 'domain', 'name','pop_2', 'http_443', 'urp_i', 'login','gopher', 'exec', 'time', 'remote_job','ssh', 'kshell', 'sql_net', 'shell','hostnames', 'echo', 'daytime', 'pm_dump','IRC', 'netstat', 'ctf', 'nntp','netbios_ssn', 'tim_i', 'supdup', 'bgp','nnsp', 'rje', 'printer', 'efs', 'X11', 'ntp_u', 'klogin', 'tftp_u'
];
let row3 = [
    'REJ', 'SF','RSTO', 'S0','RSTR', 'SH','S3', 'S2','S1', 'RSTOS0','OTH'
];

async function parseCSV() {
    const csvFilePath = __dirname + "/dataset/NSL_KDD_Test.csv";
    const csvFilePath2 = __dirname + "/dataset/NSL_KDD_Train.csv";
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

        let normal = Object.values(jsonArray2[i]).slice(-1) == "normal" ? 1.0 : 0.0;

        trainingData.push([...values, normal]);
    }

    let obj = {
        trainingData: trainingData,
        testingData: testingData
    };

    // console.log(obj);

    return obj;
}

let run = async () => {
    let { trainingData, testingData } = await parseCSV();

    var classifier = new jsregression.LogisticRegression({
        alpha: 0.001,
        iterations: 500,
        lambda: 0.6
     });

    let result = classifier.fit(testingData);

    console.log(result);
    fs.writeFileSync("./models/model.logistic.json", JSON.stringify(result));

    let counter = 0;

    for (var i = 0; i < testingData.length; ++i) {

        var probabilityNormal = classifier.transform(testingData[i]);
        var predicted = classifier.transform(testingData[i]) >= classifier.threshold ? 1 : 0;

        const [lastItem] = testingData[i].slice(-1)
        console.log("actual: " + lastItem + " predicted: " + predicted + " normal prediction: " + probabilityNormal);

        if (lastItem == predicted) counter++;
    }

    console.log("Accuracy: " + counter / 100);
}

module.exports = async (dataPoint) => {
    let { testingData } = await parseCSV();

    var classifier = new jsregression.LogisticRegression({
        alpha: 0.001,
        iterations: 500,
        lambda: 0.6
     });

    let result = classifier.fit(testingData);

    // console.log(result);
    fs.writeFileSync(__dirname + "/models/model.logistic.json", JSON.stringify(result));

    var probabilityNormal = classifier.transform(dataPoint);
    var predicted = classifier.transform(dataPoint) >= classifier.threshold ? 1 : 0;


    return {
        probabilityNormal, 
        predicted: predicted === 0 ? "Abnormal" : "Normal",
    }
}

// run();

// module.exports = run;