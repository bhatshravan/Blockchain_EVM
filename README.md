# EVM

EVM based on aadhaar card

### Installation and Usage

* First initialize all aadhaar data in server.js. 
* Run the shell and add all candidates
* Run the evm on your mobile phone, scan aadhaar card and vote for your candidate

Clone repository and run
```
npm install
```
Then launch the testpc server with
```
npm run ganache
```
and from a separate shell
```
npm run http_server
```

Then point your browser to `http://localhost:8000` for the web version of the voting app.

The `server.js` file includes the VotingContract setup and deployment




