import React from 'react'
import {Link} from 'react-router-dom'

export const Heder = () => {
    return (
        <div className="header">
            <div> <Link activeClassName='is-active' to='/'>Home</Link></div>
            <div> <Link activeClassName='is-active' to='/blocks'>Blocks</Link></div>
            <div><Link to='/transact'>conduct transaction</Link></div>
            <div><Link to='/tansaction-pool'>Transaction Pool</Link></div>
           
                        
                        
            
        </div>
    )
}
