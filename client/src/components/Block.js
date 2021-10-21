
import { json } from 'body-parser'
import { response } from 'express'
import React, { Component } from 'react'

class Block extends Component{
    state = {block: []}

    componentDidMount(){
        fetch('http://localhost/5000/api/blocks')
        .then(response => response.json)
        .then(json => this.setState({block: json}))
    }
   
    render(){
        console.log(this.state)
      
        return(
            <div>
                <h3>Block</h3>
              
            </div>
        )
    }
}

export default Block
