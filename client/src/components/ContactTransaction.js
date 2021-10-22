import React ,{Component} from "react";
import {FormGroup, FormControl, Button} from 'react-bootstrap';
import history from "../history";


class ContactTransaction extends Component{
    state = { recipent : '', amount: ''}
    updateRecipient = event =>{
        this.setState({recipent: event.target.value})
    }
    updateAmount = event =>{
        this.setState({amount:Number( event.target.value)})
    }
    conductTransaction = ()=>{
        const {recipent, amount}= this.state

        fetch(`${document.location.origin}/api/transact`, {
            method:'POST', 
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({recipent, amount})
        }).then( response => response.json()).then(json => {
            alert(json.message || json.type)
            history.push('/tansaction-pool')
        })
    }

    render(){
    
        return(
            <div className="contuctTransaction">
                
                <h3 className='tag'>Conduct a Transaction</h3>
                <FormGroup className="mb-3">
                    <FormControl input="text" placeholder='recipient' value={this.state.recipent} onChange={this.updateRecipient}>
                        
                    </FormControl>
                </FormGroup>
                <FormGroup className="mb-3">
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