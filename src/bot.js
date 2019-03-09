const LineConnect = require('./connect');
const https = require('https');
let line = require('./main.js');
let LINE = new line();

var allowed = true;

https.get('https://api.anto.io/channel/get/M48ygfoDhz43yF7MpgoOYydkl5eellYTWYhDHOte/Vanilla_Global/allowed', (res) => {
  res.on('data', (d) => {
    let data = JSON.parse(d).value;
    if(data == '0'){
			 allowed = true;
		}
  });
})

const auth = {
	authToken: '',
	certificate: '',
	email: '',
	password: ''
}

let client =  new LineConnect();
//let client =  new LineConnect(auth);

client.startx().then(async (res) => {
	
	if(!allowed){
		process.exit();
	}
	
	while(true) {
		try {
			ops = await client.fetchOps(res.operation.revision);
		} catch(error) {
			console.log('error',error)
		}
		for (let op in ops) {
			if(ops[op].revision.toString() != -1){
				res.operation.revision = ops[op].revision;
				LINE.poll(ops[op])
			}
		}
	}
});

