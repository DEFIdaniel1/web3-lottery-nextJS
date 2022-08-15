import { useMoralis, useWeb3Contract } from 'react-moralis'
import { abi, contractAddresses } from '../constants/constantsIndex'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useNotification } from 'web3uikit'

export default function LotteryEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const lotteryAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null
    //need to leave in GWEI so can interact with contract
    const [entranceFee, setEntranceFee] = useState('0')
    const [numPlayers, setNumPlayers] = useState('0')
    const [recentWinner, setRecentWinner] = useState('0')
    const [playerList, setPlayerList] = useState([])
    const [balance, setBalance] = useState('0')

    const dispatch = useNotification()

    const {
        runContractFunction: enterLottery,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, //specify network id
        functionName: 'enterLottery',
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, //specify network id
        functionName: 'getEntranceFee',
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, //specify network id
        functionName: 'getNumberOfPlayers',
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, //specify network id
        functionName: 'getRecentWinner',
        params: {},
    })
    const { runContractFunction: getPlayer } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, //specify network id
        functionName: 'getPlayer',
        params: {},
    })
    const { runContractFunction: getBalance } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress, //specify network id
        functionName: 'getBalance',
        params: {},
    })

    async function updateUI() {
        setEntranceFee((await getEntranceFee()).toString())
        setNumPlayers((await getNumberOfPlayers()).toString())
        setRecentWinner((await getRecentWinner()).toString())
        setPlayerList(await getPlayer(0))
        setBalance((await getBalance()).toString())
    }

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNotification(tx)
        updateUI()
    }
    const handleNotification = function () {
        dispatch({
            type: 'info',
            message: 'You entered the lottery!',
            title: 'Lottery Success!',
            position: 'bottomR',
            icon: 'bell',
        })
    }

    //test filter function to listen for events
    const filter = {
        address: lotteryAddress,
        topics: [
            ethers.utils.id('WinnerPicked(address)'),
            ethers.utils.id('LotteryEnter(uint256'),
        ],
    }
    const winnerEvent = filter.topics[0]
    const enterLotteryEvent = filter.topics[1]

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
            console.log('winner event fired? ' + winnerEvent)
            console.log('enterLottery event fired? ' + enterLotteryEvent)
        }
        // should add event listeners for WinnerPicked, EnterLottery to update UI (upcoming in course)
    }, [isWeb3Enabled, winnerEvent, enterLotteryEvent])

    return (
        <>
            {lotteryAddress ? (
                <div>
                    <div className="border-b-2 text-center py-4">
                        <h2 className="m-2 font-semibold">
                            {`Entrance fee: 
                            ${ethers.utils.formatUnits(entranceFee, 'ether')} ETH`}
                        </h2>
                        <button
                            className="bg-blue-300 hover:bg-blue-400 text-white py-2 px-4 rounded my-2 font-bold"
                            disabled={isLoading || isFetching}
                            onClick={async function () {
                                await enterLottery({
                                    onSuccess: handleSuccess,
                                    onError: (error) => console.log(error),
                                })
                            }}
                        >
                            {isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-4 w-4 border-b-2 rounded-full"></div>
                            ) : (
                                <div>Enter Lottery</div>
                            )}
                        </button>
                    </div>
                    <div className="flex text-center my-8 border-b-2 pb-8">
                        <div className="w-1/3">
                            <h2 className="font-bold">Number of Players</h2>
                            <h4>{numPlayers}</h4>
                        </div>
                        <div className="w-1/3">
                            <h2 className="font-bold">Most Recent Winner</h2>
                            <h4>{recentWinner}</h4>
                        </div>
                        <div className="w-1/3">
                            <h2 className="font-bold">Lottery Balance</h2>
                            <h4>{ethers.utils.formatUnits(balance, 'ether')} ETH</h4>
                        </div>
                    </div>
                    {/* <h2>List of Players</h2>
                    <h4>{playerList[0].toString()}</h4> */}
                </div>
            ) : (
                <p>No lottery contract address found...</p>
            )}
        </>
    )
}
