import {
  Connection,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import React, { useEffect, useState } from 'react';

function ConnectToPhantom({ phantom }) {
  // https://github.com/cryptorustacean/phantom-wallet-example/blob/main/components/ConnectToPhantom.tsx
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

  const connection = new Connection(
    clusterApiUrl('devnet'),
    // clusterApiUrl('mainnet-beta'),
    'confirmed',
  );

  // https://github.com/phantom-labs/sandbox/blob/main/src/App.tsx
  const connectHandler = async () => {
    try {
      const resp = await window.solana.connect();
      console.log(resp.publicKey.toString());
      setPublicKey(resp.publicKey);
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

  const createTransferTransaction = async () => {
    // alert(publicKey)
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: publicKey,
        lamports: 100,
      })
    )
    transaction.feePayer = publicKey;
    console.log('Getting recent blockhash');
    const anyTransaction = transaction;
    anyTransaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;
    return transaction;

    // const { signature } = await window.solana.signAndSendTransaction(transaction);
    // await connection.confirmTransaction(signature);
  }

  const sendTransaction = async () => {
    try {
      const transaction = await createTransferTransaction();
      if (!transaction) return;
      let signed = await phantom.signTransaction(transaction);
      console.log('Got signature, submitting transaction');
      let signature = await connection.sendRawTransaction(signed.serialize());
      console.log("Submitted transaction " + signature + ", awaiting confirmation");
      await connection.confirmTransaction(signature);
      console.log("Transaction " + signature + " confirmed");
    } catch (err) {
      console.warn(err);
      console.log("[error] sendTransaction: " + JSON.stringify(err));
    }
  }

  // https://github.com/solana-labs/solana/tree/master/web3.js/examples
  // const sendTransaction = async () => {
  //   // Generate a new random public key
  //   var from = Keypair.generate();
  //   var airdropSignature = await connection.requestAirdrop(
  //     from.publicKey,
  //     LAMPORTS_PER_SOL,
  //   );
  //   await connection.confirmTransaction(airdropSignature);

  //   // Generate a new random public key
  //   var to = Keypair.generate();

  //   // Add transfer instruction to transaction
  //   var transaction = new Transaction().add(
  //     SystemProgram.transfer({
  //       fromPubkey: from.publicKey,
  //       toPubkey: to.publicKey,
  //       lamports: LAMPORTS_PER_SOL / 100,
  //     }),
  //   );

  //   // Sign transaction, broadcast, and confirm
  //   var signature = await sendAndConfirmTransaction(
  //     connection,
  //     transaction,
  //     [from],
  //   );
  //   console.log('SIGNATURE', signature);
  // }

  const accountInfoHandler = async () => {
    let wallet = Keypair.generate();
    let account = await connection.getAccountInfo(wallet.publicKey);
    console.log(wallet.publicKey);
    console.log(account);
  }

  const airdropHandler = async () => {
    // Generate a new wallet keypair and airdrop SOL
    var wallet = Keypair.generate();
    var airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      LAMPORTS_PER_SOL,
    );

    //wait for airdrop confirmation
    await connection.confirmTransaction(airdropSignature);

    // get account info
    // account data is bytecode that needs to be deserialized
    // serialization and deserialization is program specic
    let account = await connection.getAccountInfo(wallet.publicKey);
    console.log(account);
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
        <>
          <button onClick={disconnectHandler}>
            Disconnect from Phantom
          </button>
          <br />
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={sendTransaction}>
              Transfer
            </button>
            {/* <button onClick={() => alert(phantom.publicKey)}>
              Wallet
            </button> */}
            <button onClick={accountInfoHandler}>
              Account info
            </button>
            <button onClick={airdropHandler}>
              Airdrop
            </button>
          </div>
        </>
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
