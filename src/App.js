import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ConnectToPhantom from './components/connectPhantom';

function App() {
  const [phantom, setPhantom] = useState(null);

  useEffect(() => {
    if ("solana" in window) {
      setPhantom(window["solana"]);
    }
  }, []);

  return (
    <div className="App">
      <ToastContainer autoClose={3000} theme='dark' position="bottom-right" />
      <ConnectToPhantom phantom={phantom} />
    </div>
  );
}

export default App;
