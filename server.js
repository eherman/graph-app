var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/loadGraph', function(req, res) {
	var rawGraphData = {
	    "nodes": [
	        { group: "nodes", data: { id: 'a', name: 'TestElementA<AAA>', type: 'AAA', property_1: false, property_2: true, textAlign: 'bottom', seed: true, active: false, color: '#24cc53', icon: '/images/icons/icon.png', results: {thing: true} } },
	        { group: "nodes", data: { id: 'b', name: 'TestElementB<BBB>', type: 'BBB', property_1: true, property_2: false, textAlign: 'bottom', active: false, color: 'gray', icon: '/images/icons/icon.png' } },
	        { group: "nodes", data: { id: 'c', name: 'TestElementC<AAA>', type: 'AAA', property_1: true, property_2: false, textAlign: 'bottom', active: false, color: 'gray', icon: '/images/icons/icon.png' } },
	        { group: "nodes", data: { id: 'd', name: 'ThisIsATestElementD<AAA>', type: 'AAA', property_1: true, property_2: true, textAlign: 'bottom', active: false, color: '#24cc53', icon: '/images/icons/icon.png' } },
	        { group: "nodes", data: { id: 'e', name: 'TestElementE<CCCCCCCCCCCCCCCCCCCCCCCCCC>', type: 'CCCCCCCCCCCCCCCCCCCCCCCCCC', property_1: false, property_2: true, textAlign: 'bottom', active: true, color: 'gray', icon: '/images/icons/icon.png' } }
	    ],
	    "edges": [
	        { group: "edges", data: { id: 'edge1', name: 'a to b', source: 'a', target: 'b', color: '#4884b8' } },
	        { group: "edges", data: { id: 'edge2', name: 'a to c', source: 'a', target: 'c', color: '#4884b8' } },
	        { group: "edges", data: { id: 'edge3', name: 'b to c', source: 'b', target: 'c', color: '#7647a2' } },
	        { group: "edges", data: { id: 'edge4', name: 'a to d', source: 'a', target: 'd', color: '#bdbdbd' } },
	        { group: "edges", data: { id: 'edge5', name: 'd to e', source: 'd', target: 'e', color: '#4884b8' } }
	    ]
	};

	for(var index = 0; index < rawGraphData.nodes.length; index++) {
		rawGraphData.nodes[index].data.displayName = rawGraphData.nodes[index].data.name.split('<')[0] + '\n<' + rawGraphData.nodes[index].data.name.split('<')[1];

		if(rawGraphData.nodes[index].data.seed) {
			rawGraphData.nodes[index].data.shape = 'roundrectangle';
		} else {
			rawGraphData.nodes[index].data.shape = 'ellipse';
		}

		if(rawGraphData.nodes[index].data.seed) {
			rawGraphData.nodes[index].data.shape = 'roundrectangle';
		} else {
			rawGraphData.nodes[index].data.shape = 'ellipse';
		}
	}

	return res.json(rawGraphData);

});

var server_port = 8080;
var server_ip_address = '127.0.0.1';

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});
