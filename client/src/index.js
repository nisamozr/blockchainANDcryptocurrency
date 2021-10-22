
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import history from './history';
import App from './App'
import Blocks from './components/Blocks';
import ContactTransaction from './components/ContactTransaction';


ReactDOM.render(
    <BrowserRouter history = {history}>
        <Switch>
            <Route exact path='/' component={App}></Route>
            <Route path='/blocks' component={Blocks}></Route>
            <Route path='/transact' component={ContactTransaction}></Route>
        </Switch>
    </BrowserRouter>, document.getElementById('root')
)
