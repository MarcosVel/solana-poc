import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ConnectToPhantom from './components/connectPhantom';
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  const [phantom, setPhantom] = useState(null);

  useEffect(() => {
    if ("solana" in window) {
      setPhantom(window["solana"]);
    }
  }, []);

  const connection = new Connection(
    clusterApiUrl('devnet'),
    // clusterApiUrl('mainnet-beta'),
    'confirmed',
  );

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      // new LedgerWalletAdapter(), // Está bugando a plataforma
      new SolletWalletAdapter({ connection }),
      new SolletExtensionWalletAdapter({ connection }),
    ],
    [connection]
  );

  return (
    <div className="App">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ToastContainer autoClose={3000} theme='dark' position="bottom-right" />
          <ConnectToPhantom phantom={phantom} connection={connection} />
        </WalletModalProvider>
      </WalletProvider>
    </div>
  );
}

export default App;
