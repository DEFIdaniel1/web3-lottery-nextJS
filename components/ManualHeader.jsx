import { useMoralis } from 'react-moralis'
import { useEffect } from 'react'

const ManualHeader = () => {
    const {
        enableWeb3,
        account,
        isWeb3Enabled,
        Moralis,
        deactivateWeb3,
        isWeb3EnableLoading,
    } = useMoralis()
    // const accountShort = return ({account.slice(0, 6)}...
    //                 {account.slice(account.length - 4)})

    useEffect(() => {
        // keeps connection by saving 'conencted' to local storage
        if (
            !isWeb3Enabled &&
            typeof window !== 'undefined' &&
            // searching for local storage prevents it from Default asking to connect on load (so annoying)
            window.localStorage.getItem('connected')
        ) {
            enableWeb3()
            // enableWeb3({provider: window.localStorage.getItem("connected")}) // add walletconnect
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        // to logout on disconnect, and remove 'connected' from local storage
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                // will show null when disconnected
                window.localStorage.removeItem('connected')
                deactivateWeb3()
                console.log('Null Account found')
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...
                    {account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        // await walletModal.connect()
                        await enableWeb3()
                        if (typeof window !== 'undefined') {
                            window.localStorage.setItem('connected', 'walletconnect')
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}

export default ManualHeader

// "harder" way to create the header
