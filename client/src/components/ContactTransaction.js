import React ,{Component} from "react";
import {FormGroup, FormControl, Button} from 'react-bootstrap';
import { Link } from "react-router-dom";


class ContactTransaction extends Component{
    state = { rescipient : '', amount: 0}
    updateRecipient = event =>{
        this.setState({rescipient: event.target.value})
    }
    updateAmount = event =>{
        this.setState({amount:Number( event.target.value)})
    }
    conductTransaction = ()=>{
        const {rescipient, amount}= this.state

        fetch('http://localhost:3000/api/transact', {
            method:'POST', 
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({rescipient, amount})
        }).then( response => response.json()).then(json => {
            alert(json.message || json.type)
        })
    }

    render(){
    
        return(
            <div className="contuctTransaction">
                <Link to='/'>Home</Link>
                <h3>Conduct a Transaction</h3>
                <FormGroup>
                    <FormControl input="text" placeholder='recipient' value={this.state.rescipient} onChange={this.updateRecipient}>
                        
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <FormControl input="number" placeholder='amount' value={this.state.amount} onChange={this.updateAmount}>
                        
                    </FormControl>
                </FormGroup>
                <div>
                    <Button onClick={this.conductTransaction}>Submit</Button>
                </div>
            </div>
        )
    }
}
export default ContactTransaction