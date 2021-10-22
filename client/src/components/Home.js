import { json } from 'body-parser'
import React, { Component } from 'react'
import { Heder } from './Heder'
import { Button } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'



class Home extends Component {

    state = { walletInfo: {} }
    componentDidMount() {
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json }))
    }

    handleCopy = () => {
        alert('copied')

    }
    render() {
        const { address, balance } = this.state.walletInfo
            this.a = address

        return (

            <div className="home">

                <div className="img-body">
                    <Heder />

                    <div className="continer">
                        <div className="row">
                            <div className="address">
                                <div>
                                    Address: <p>{address}</p>
                                </div>

                                <CopyToClipboard text={address} onCopy={this.handleCopy}>
                                    <div className="copy">
                                        Copy

                                    </div>
                                   
                                </CopyToClipboard>
                            </div >
                            <div className="col-12">Balance: <span>{balance}</span></div>
                        </div>
                    </div>

                </div>






            </div>
        )
    }
}

export default Home
