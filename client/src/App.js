import { json } from 'body-parser'
import React, { Component } from 'react'
import Blocks from './components/Blocks'


class App extends Component {
    state = { walletInfo: {} }
    componentDidMount() {
        fetch('http://localhost:5000/api/wallet-info')
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json }))
    }

    render() {
        const { address, balance } = this.state.walletInfo
        return (
            <div>
                <div className="img-body">
                    <div className="continer">
                        <div className="row">
                            <div className="col-12">
                                Address: {address}
                            </div >
                            <div className="col-12">Balance: {balance}</div>
                        </div>
                    </div>

                </div>



                <br />
                <Blocks />

            </div>
        )
    }
}

export default App
