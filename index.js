

web3 = new Web3(new Web3.providers.HttpProvider("http://REPLACE_WITH_IP_ADDRESS:8545"));
asciiToHex = Web3.utils.asciiToHex;
contractInstance = new web3.eth.Contract(ABI_DEFINITION, CONTRACT_ADDRESS);

candidates = REPLACE_WITH_CANDIDATES;

var url = new URL(location.href);
var cp2 = url.searchParams.get("uid").toString();
//console.log(cp2);

function voteForCandidate(candidateName2) {
  //candidateName = $("#candidate").val();

  candidateName=candidateName2;
  web3.eth.getAccounts()
  .then((accounts) => {
    try{
      return contractInstance.methods.voteForCandidate((asciiToHex(candidateName)),asciiToHex(cp2)).send({from: accounts[REPLACE_WITH_ACCOUNT_ID]});

      //Android.finishV("Not allowed to vote here");
      Android.finishVoting("test");
    }
    catch(err)
    {
      try{
          Android.finishV("Not allowed");
          Android.finishVoting("You are not eligible to vote in this consituency");
      }
      catch(err2)
      {
        console.log("Android vote");
      }
    }
  })
  .then(() => {
    try{
      Android.finishVoting("test");
    }
    catch(err){
      console.log("Web vote cast");
    }
  });
}


/*$(document).ready(function() {
  Object.keys(candidates).forEach((name) => {
    contractInstance.methods.totalVotesFor(asciiToHex(name)).call()
    .then((val) => {
      $("#" + candidates[name]).html(val);
    });
  });
});*/
