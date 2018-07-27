import {Table, Grid, Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import './App.css';

import SimpleStorageContract from '../build/contracts/EvidenceProtection.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      storageValue: 0,
      web3: null,
	  buffer:null,
	  caseNumber: 42
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance
        this.setState({ account: accounts[0] })
        return
      }).then(() => {
        return
      })
    })


  }

   captureFile(event){
	console.log("capture")
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
          reader.readAsArrayBuffer(file)
          reader.onloadend = () =>{
            this.setState({buffer:Buffer(reader.result)})
           console.log('buffer', this.state.buffer)
      }
   }
   onSubmit(event){
       event.preventDefault();
		ipfs.files.add(this.state.buffer,(error,result) =>{
        if(error){
          console.error(error)
           return
		}
		this.storageValue = this.storageValue + 1
		var docName =  'TestDoc' + this.storageValue
		this.simpleStorageInstance.createEvidence(docName, this.state.caseNumber, result[0].hash, { from: this.state.account })
		.then((r) => {
			return this.setState({ ipfsHash: result[0].hash })
			console.log('ifpsHash', this.state.ipfsHash)
		})
      })
   }


   onClick(event){
        event.preventDefault();
		this.simpleStorageInstance.evidenceCount.call(this.state.account).then((r) => {
			  var docCount = r[0]
			  var docs = []
			  for (var i=0; i<docCount;i++ ){
		        docs.push(this.simpleStorageInstance.getEvidence.call(i));
			  }

			  Promise.all(docs).then(function(values) {
			  	 console.log(values);
			  })
	})
  }
  render() {
	return (
        <div className="App">
          <header className="App-header">
            <h1> Legit Chain</h1>
          </header>

          <hr />

        <Grid>
          <h3> Upload Record </h3>
          <Form onSubmit={this.onSubmit}>
            <input
              type = "file"
              onChange = {this.captureFile}
            />
             <Button
             bsStyle="primary"
             type="submit">
             Submit
             </Button>
          </Form>

          <hr/>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>Case Number</th>
					<th>Document Name</th>
					<th>Document Hash</th>
                  </tr>
                </thead>

                <tbody>
					<tr>
					<td>{this.state.caseNumber}</td>
					<td>TestDoc{this.state.storageValue}</td>
					<td>{this.state.ipfsHash}</td>
				   </tr>
                </tbody>
			</Table>

			<Button onClick = {this.onClick}> Get Evidence Trail </Button>
        </Grid>
     </div>
      );
  }
}

export default App
