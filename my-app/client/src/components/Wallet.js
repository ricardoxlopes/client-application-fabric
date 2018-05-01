import React from 'react'
import logo from '../logo.svg';
import { BeatLoader } from 'react-spinners';

const Wallet = ({ wallet, onWalletClick }) => {

    if (wallet.wallet)
        return (
            <div onClick={() => onWalletClick(wallet.channel)}>
                <img src={logo} className="img-responsive" alt="Generic placeholder thumbnail" />
                <h4 className="text-center">{wallet.wallet["name"]}</h4>
            </div>
        );
    else return (
        <BeatLoader
            color={'#123abc'}
            loading={wallet.isFetching}
        />
    );
}

export default Wallet