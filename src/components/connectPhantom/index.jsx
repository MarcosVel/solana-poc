import React, { useEffect, useState } from 'react';

function ConnectToPhantom() {
  const [phantom, setPhantom] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if ("solana" in window) {
      setPhantom(window["solana"]);
    }
  }, []);

  const connectHandler = async () => {
    // window.solana.connect({ onlyIfTrusted: true });
    try {
      const resp = await window.solana.connect();
      console.log(resp.publicKey.toString());
      console.log(window.solana.isConnected);
      // true
      setConnected(true)
    } catch (err) {
      // { code: 4001, message: 'User rejected the request.' }
    }

  }

  const disconnectHandler = async () => {
    await window.solana.disconnect();
    console.log(window.solana.isConnected);
    setConnected(false)
  }

  useEffect(() => {
    if (connected === false) {
      setConnected(true)
    } else {
      setConnected(false)
    }
  }, [phantom])

  if (phantom) {
    if (connected === true) {
      return (
        <button
          onClick={disconnectHandler}
        >
          Disconnect from Phantom
        </button>
      );
    }

    return (
      <button
        onClick={connectHandler}
      >
        Connect to Phantom
      </button>
    );
  }

  return (
    <a
      href="https://phantom.app/"
      target="_blank"
      style={{ color: '#fff' }}
    >Get Phantom</a>
  )
}

export default ConnectToPhantom;
