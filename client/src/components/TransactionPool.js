import React, {Component} from "react";
import { Button } from 'react-bootstrap'
import Transaction from './Transaction'
import { Link } from "react-router-dom";
import history from "../history";

const Pool_interval_ms = 10000


class TransactionPool extends Component{
    state = { transactionPoolMap: {}}

    fetchTransactionPoolMap = ()=>{
        fetch(`${document.location.origin}/api/transaction-pool-map`)
        .then(response => response.json())
        .then(json => this.setState({transactionPoolMap: json}))
    }
    fetchMineTransaction = ()=>{
        fetch(`${document.location.origin}/api/minr-tansactions`)
        .then(response => {
            if(response.status === 200){
                alert('success')
                history.push('/blocks')
            }else{
                alert('The mine-transactions block request did not complete.')
            }
        })

    }

    componentDidMount(){
        this.fetchTransactionPoolMap()
        this.fechPoolmapIntervel = setInterval(
            ()=> this.fetchTransactionPoolMap(),
            Pool_interval_ms
        )
    }
    // componentWillUnmount(){
    //     clearInterval(this.fechPoolmapIntervel)
    // }

    render(){
        
       
        return(
            <div className="transactionPool">
                <div>
                    <Link to='/'>Home</Link>
                    
                </div>
                <h3>Transaction Pool</h3>
                {
                    Object.values(this.state.transactionPoolMap).map(transaction=> {
                        return(
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction}/>
                            { console.log( "gggggggggggggggggggggggg",transaction)}
                            </div>
                        )
                    })
                }
                <hr />
                <Button onClick={this.fetchMineTransaction}>Mine the Transaction</Button>
            </div>
        )
    }
}
export default TransactionPool