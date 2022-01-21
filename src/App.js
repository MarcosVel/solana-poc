import './App.css';
import * as solanaWeb3 from '@solana/web3.js';
import * as web3 from '@solana/web3.js';
import ConnectToPhantom from './components/connectPhantom';

function App() {
  // console.log(solanaWeb3);

  (async () => {
    // Connect to cluster
    var connection = new web3.Connection(
      web3.clusterApiUrl('devnet'),
      'confirmed',
    );

    // Generate a new wallet keypair and airdrop SOL
    var wallet = web3.Keypair.generate();

    // var airdropSignature = await connection.requestAirdrop(
    //   wallet.publicKey,
    //   web3.LAMPORTS_PER_SOL,
    // );

    //wait for airdrop confirmation
    // await connection.confirmTransaction(airdropSignature);

    // get account info
    // account data is bytecode that needs to be deserialized
    // serialization and deserialization is program specic
    let account = await connection.getAccountInfo(wallet.publicKey);
    console.log(account);
  })();

  return (
    <div className="App">
      <ConnectToPhantom />
    </div>
  );
}

export default App;
