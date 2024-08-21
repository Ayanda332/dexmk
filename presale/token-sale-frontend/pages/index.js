import { useEffect, useState } from 'react';
import Web3 from 'web3';
import contractABI from '../public/TokenSaleABI.json';
import Navbar from '../components/Navbar';
import { buyTokens } from '../utils/buyTokens';

const contractAddress = "0x3e510FF64A2576e4DA4Fd74CB3fd607261b3698c";

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [tokenSaleContract, setTokenSaleContract] = useState(null);
  const [price, setPrice] = useState(null);
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Initialize as false

  useEffect(() => {
    if (window.ethereum && account) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const contract = new web3Instance.eth.Contract(contractABI, contractAddress);
      setTokenSaleContract(contract);

      loadPrice(contract, web3Instance);
    }
  }, [account]);

  const loadPrice = async (contract, web3Instance) => {
    try {
      const price = await contract.methods.price().call();
      setPrice(web3Instance.utils.fromWei(price, 'ether'));
    } catch (error) {
      console.error("Error loading price:", error);
      setStatus("Error loading price. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setStatus('');
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setStatus("Failed to connect wallet. Please try again.");
      }
    } else {
      setStatus('Non-Ethereum browser detected. Please install MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setTokenSaleContract(null);
    setStatus('');
  };

  const switchAccount = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error switching account:", error);
      setStatus("Failed to switch account. Please try again.");
    }
  };

  const handleBuyTokens = () => {
    if (web3 && tokenSaleContract && account && price) {
      buyTokens({ web3, tokenSaleContract, amount, account, price, setStatus, setIsLoading });
    }
  };

  const styles = {
    container: {
      backgroundColor: '#f0f4f8',
      minHeight: '100vh',
      color: '#333',
      fontFamily: 'Arial',
      paddingTop: '100px', // Adjusted to leave space for the fixed navbar
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    content: {
      backgroundColor: '#fff',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      width: '100%',
      textAlign: 'center',
      marginBottom: '20px',
    },
    input: {
      marginLeft: '10px',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      width: '100%',
    },
    button: {
      padding: '10px 20px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      width: '100%',
      marginTop: '20px',
    },
    status: (isError) => ({
      color: isError ? 'red' : 'green',
      marginTop: '20px',
    }),
  };

  return (
    <div style={styles.container}>
      {/* Navbar Component */}
      <Navbar
        account={account}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        switchAccount={switchAccount}
        buyTokens={handleBuyTokens}
        isLoading={isLoading}
      />

      {/* Home Section */}
      <div id="home" style={styles.content}>
        <h3>Welcome to the InandaYodwa Presale</h3>
        <p>Connect your wallet and buy tokens for our exclusive presale event!</p>
      </div>

      {/* TokenNomis Section */}
      <div id="tokennomis" style={styles.content}>
        <h3>TokenNomis</h3>
        <p>Details about TokenNomis and its benefits.</p>
        <ul>
          <li><strong>Presale:</strong> 30% of the total supply</li>
          <li><strong>Liquidity Pool:</strong> 20% of the total supply</li>
          <li><strong>Development Fund:</strong> 15% of the total supply</li>
          <li><strong>Marketing:</strong> 10% of the total supply</li>
          <li><strong>Team:</strong> 10% of the total supply</li>
          <li><strong>Reserves:</strong> 15% of the total supply</li>
        </ul>
      </div>

      {/* Contact Section */}
      <div id="contact" style={styles.content}>
        <h3>Contact Us</h3>
        <p>If you have any questions, feel free to reach out to us.</p>
      </div>

      {/* Conditionally render the price, token input, and buy button */}
      {account && (
        <div style={styles.content}>
          <div style={{ marginBottom: '30px' }}>
            <label>Price per Token (ETH):</label>
            {isLoading ? <span>Loading...</span> : <span>{price}</span>}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="amount">Amount of Tokens:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              style={styles.input}
              disabled={!account}
            />
          </div>
          <button
            onClick={handleBuyTokens}
            style={styles.button}
            disabled={isLoading || amount <= 0 || !account}
          >
            {isLoading ? 'Loading...' : 'Buy Tokens with ETH'}
          </button>
          <div style={styles.status(status.includes('Error'))}>
            {status}
          </div>
        </div>
      )}
    </div>
  );
}
