import { ConnectButton } from 'web3uikit'

const Header = () => {
    return (
        <div className="border-b-2 flex">
            <h1 className="font-bold text-3xl p-4">Decentralized Lottery</h1>
            <div className="ml-auto p-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}

export default Header
