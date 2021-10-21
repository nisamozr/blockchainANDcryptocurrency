import React, { Component } from 'react'


class Blocks extends Component{
    state = { block: [] }

    componentDidMount(){
        fetch('http://localhost:5000/api/blocks')
        .then(response => response.json())
        .then(json => this.setState({block: json}))
    }
   
    render(){
     
      console.log(this.state)
        return(
            <div>
                <h3>Block</h3>
                {
                    this.state.block.map(block =>{
                        return(
                            <div key={block.hash}>{block.hash}</div>
                        )
                    })
                }
              
            </div>
        )
    }
}

export default Blocks
