import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta
                    name="blockchain-enabled smart-contract lottery"
                    content="Smart contract lottery"
                />
                <link rel="icon" href="favicon.ico" />
            </Head>
            <div className="content">
                <h1>Smart Contract Lottery</h1>
            </div>
        </div>
    )
}
