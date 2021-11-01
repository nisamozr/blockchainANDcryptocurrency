import {Button} from 'react-bootstrap'
import React, { Component } from 'react'
import Block from './Block'



class Blocks extends Component{
    state = { block: [], paginatedId:1, blockLength:0 }

    componentDidMount(){
        fetch(`${document.location.origin}/api/blocks/length`)
        .then(response => response.json())
        .then(json => this.setState({blockLength: json}))


        this.fetchPaginated(this.state.paginatedId)
    }

    fetchPaginated = paginatedId =>{
        fetch(`${document.location.origin}/api/blocks/${paginatedId}`)
        .then(response => response.json())
        .then(json => this.setState({block: json}))
    } 
    render(){
     
      console.log(this.state)
        return(
            <div className="vv">
               
               <h3>Blocks</h3>
               <div>
                   {
                       [...Array(Math.ceil(this.state.blockLength/5)).keys()].map(key => {
                           const paginatedId = key+1

                           return(
                               <span key={key} onClick={()=> this.fetchPaginated(paginatedId)}>
                                   <Button className='bb'>{paginatedId}</Button>
                               </span>
                           )
                       })
                   }
               </div>
                {
                    this.state.block.map(block =>{
                        return(
                          
                            <Block key={block.hash}  block={block}/>
                        )
                    })
                }
              
            </div>
        )
    }
}

export default Blocks
