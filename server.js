#!/usr/bin/env node

//ganache-cli -m "HELLO MY NAME IS XYZ FROM LMN COLLEGE WITH A BITCOIN WALLET"

var ip=require('ip');

// Candidate names
const candidates = ['Prabhu', 'Sai Niranjan', 'Navya', 'Roopini','Pallavi'];
// Registered voters in consttituency
const voterss = ['123', '134', '111', '12345','12333'];


const canidatesState=[0,0,0,0,0,0,0,0]
const voterssState=[0,0,0,0,0,0];

var my_ip=ip.address();//"192.168.12.1";//
var account_id=0;


var canList1="{";
var canList2="";
var canList3="";
var canList4="";
var canList5="";
var chartNum="";
var canNum=1;
var arrayCount=0;
var server_port=8000+account_id;


var listeningIP="http://"+my_ip+":8545"

const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');
const http = require('http');

const provider = new Web3.providers.HttpProvider(listeningIP)
const web3 = new Web3(provider);
const asciiToHex = Web3.utils.asciiToHex;


//GET THE CANDIDATES LIST

/*
<img src="https://image.ibb.co/bAzDW7/1.jpg" alt="1" border="0">
<img src="https://image.ibb.co/eEP2PS/2.jpg" alt="2" border="0">
<img src="https://image.ibb.co/h6hp4S/3.jpg" alt="3" border="0">
<img src="https://image.ibb.co/i0UrJn/4.jpg" alt="4" border="0">
<img src="https://image.ibb.co/iSiwjS/5.jpg" alt="5" border="0">
<img src="https://image.ibb.co/mejDW7/6.jpg" alt="6" border="0">
<img src="https://image.ibb.co/hZKQdn/7.jpg" alt="7" border="0">
<img src="https://image.ibb.co/ez3kdn/8.jpg" alt="8" border="0">
<img src="https://image.ibb.co/jPtU4S/9.jpg" alt="9" border="0">

*/

var images = ["https://image.ibb.co/bAzDW7/1.jpg","https://image.ibb.co/eEP2PS/2.jpg","https://image.ibb.co/h6hp4S/3.jpg","https://image.ibb.co/i0UrJn/4.jpg","https://image.ibb.co/iSiwjS/5.jpg","https://image.ibb.co/mejDW7/6.jpg","https://image.ibb.co/hZKQdn/7.jpg","https://image.ibb.co/ez3kdn/8.jpg","https://image.ibb.co/jPtU4S/9.jpg"];

candidates.forEach(function Candidates_LIST(cand){
  if(canidatesState[arrayCount]==account_id)
  {
    canList1+="\"" + cand + "\": \"candidate-"+  canNum  +"\",";
    canList2+="<tr>\n<td>\n"+ cand + "\n</td>\n<td id=\"candidate-"+canNum+"\">\n</td>\n</tr>\n\n";
    canList3+="\""+cand+"\",";
    canList5+="<tr scope=\"row\"><td><span>"+cand+"</span></td><td><img src=' " + images[canNum-1] + " ' width=\"80px\"></td><td><button type=\"button\" class=\"btn btn-primary btn-lg btn-block\" onclick=\"voteForCandidate('"+cand+"');\">Vote</button></td></tr>\n";
    //canList5+="<tr scope=\"row\"><td><span>"+cand+"</span></td><td><img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google.png/800px-Google.png\" alt=\"\" width=\"80px\"></td><td><button type=\"button\" class=\"btn btn-primary btn-lg btn-block\" onclick=\"voteForCandidate('"+cand+"');\">Vote</button></td></tr>\n";
    var chartTemp=canNum-1;
    chartNum+="arr["+chartTemp+"],";
    canList4+="0,";
    canNum+=1;
}

  arrayCount+=1;
});
canList1+="jjk";
canList1 = canList1.replace(',jjk','');
canList1+="}";
canList3+="jjk";
canList3 = canList3.replace(',jjk','');
chartNum+="jjk";
chartNum = chartNum.replace(',jjk','');
canList4+="jjk";
canList4 = canList4.replace(',jjk','');


web3.eth.getAccounts()
.then((accounts) => {
  // console.log('accounts', accounts);
  const code = fs.readFileSync('./voting.sol').toString();
  const compiledCode = solc.compile(code);
  // console.log('compiledCode', compiledCode);
  const errors = [];
  const warnings = [];
  (compiledCode.errors || []).forEach((err) => {
    if (/\:\s*Warning\:/.test(err)) {
      warnings.push(err);
    } else {
      errors.push(err);
    }
  });

  if (errors.length) {
    throw new Error('solc.compile: ' + errors.join('\n'));
  }
  if (warnings.length) {
    // console.warn('solc.compile: ' + warnings.join('\n'));
  }
  const byteCode = compiledCode.contracts[':Voting'].bytecode;
  // console.log('byteCode', byteCode);
  const abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface);
  // console.log('abiDefinition', abiDefinition);

  const VotingContract = new web3.eth.Contract(abiDefinition,
    {data: byteCode, from: accounts[account_id], gas: 4700000}

  );
  let deployedContract = null;

  console.log("Candidates list in byte32[]: ");
  console.log(candidates.map(asciiToHex));
  VotingContract.deploy({arguments: [candidates.map(asciiToHex) , voterss.map(asciiToHex)]})
  .send(function (error, transactionHash) {
    // console.log('transactionHash', transactionHash);
  })
  .then((result) => {
    deployedContract = result;
    // console.log('deployedContract', deployedContract);
//{"Darshan": "candidate-1", "Prabhu": "candidate-2", "Shravan": "candidate-3", "Nikhil": "candidate-4", "Adithya": "candidate-5"}
//REPLACE_WITH_CANDIDATES
   })
  .then(() => {
    const server = http.createServer((req, res) => {
      res.writeHead(200);
      let fileContents = '';
      try {
        fileContents = fs.readFileSync(__dirname + req.url, 'utf8');
      } catch (e) {
        fileContents = fs.readFileSync(__dirname + '/index.html', 'utf8');
      }
      res.end(
        fileContents.replace(
          /REPLACE_WITH_CONTRACT_ADDRESS/g,
          deployedContract.options.address
        ).replace(
          /REPLACE_WITH_ABI_DEFINITION/g,
          compiledCode.contracts[':Voting'].interface
        ).replace(
          /REPLACE_WITH_CANDIDATES/g,
          canList1
        ).replace(
          /REPLACE_WITH_IP_ADDRESS/,
          my_ip
        ).replace(
          /REPLACE_WITH_HTML_CANDIDATES/,
          canList5
        ).replace(
          /REPLACE_WITH_CHART/,
          canList3
        ).replace(
          /REPLACE_WITH_NUM_CHART/,
          chartNum
        ).replace(
          /REPLACE_WITH_1_VOTE/,
          canList4
        ).replace(
          /REPLACE_WITH_ACCOUNT_ID/,
          account_id
        )
      );
    });
    server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });
    server.listen(server_port, () => {
      console.log('Deployed contract address:');
      console.log(deployedContract.options.address);
      console.log('Listening on localhost:'+server_port);
      console.log(ip.address());
    });
  });
});
  //"{\"Darshan\": \"candidate-1\", \"Prabhu\": \"candidate-2\", \"Shravan\": \"candidate-3\", \"Nikhil\": \"candidate-4\", \"Adithya\": \"candidate-5\"}"
