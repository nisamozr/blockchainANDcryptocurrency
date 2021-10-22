import React, { Component } from 'react'
import Block from './Block'



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
            <div className="vv">
               
               <h3>Blocks</h3>
                {
                    this.state.block.map(block =>{
                        return(
                            // <div key={block.hash} className="block">{block.hash}</div>
                            <Block key={block.hash}  block={block}/>
                        )
                    })
                }
              
            </div>
        )
    }
}

export default Blocks
