import { json } from 'body-parser'
import React, { Component } from 'react'
import history from './history';
import { BrowserRouter, Switch, Route, Fragment } from 'react-router-dom'

import Blocks from './components/Blocks';
import ContactTransaction from './components/ContactTransaction';

import TransactionPool from './components/TransactionPool';
import Home from './components/Home.js';
import { About } from './components/About';

class App extends Component {


    render() {
        return (

            <div className="App">



                <BrowserRouter history={history}>
                    <Switch>
                        <Route exact path='/'>
                            <Home/>
                            <About/>
                           
                        </Route>
                        <Route path='/blocks' >
                        <Home/>
                        <Blocks/>

                        </Route>
                        <Route path='/transact' >
                        <Home/>
                        <ContactTransaction/>
                        </Route>
                        <Route path='/tansaction-pool'>
                        <Home/>
                        <TransactionPool/>
                        </Route>
                    </Switch>
                </BrowserRouter>

            </div>
        )
    }
}

export default App
