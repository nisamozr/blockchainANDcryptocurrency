import React from "react";

const Transaction = ({transaction})=>{
    const {input, outputMap} = transaction
    const recipient = Object.keys(outputMap)

    return(
        <div className="transaction">
            <div>
                From : {`${input.address.substring(0,20)}...`} | Balance: {input.amout}
            </div>
            {
                recipient.map(recipient =>{
                    return(
                        <div key={recipient}>
                            To: {`${recipient.substring(0,20)}...`} | sent: {outputMap[recipient]}
                        </div>
                    )
                })
            }
        </div>
    )

}

export default Transaction