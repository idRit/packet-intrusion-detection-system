var pcap = require('pcap'),
    pcap_session = pcap.createSession("", );

pcap_session.on('packet', function (raw_packet) {
    // do some stuff with a raw packet
    var packet = pcap.decode.packet(raw_packet);
    console.log(JSON.stringify(packet, null, 4));
});