import { useEffect, useState } from 'react';
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
      <ConnectToPhantom phantom={phantom} />
    </div>
  );
}

export default App;
