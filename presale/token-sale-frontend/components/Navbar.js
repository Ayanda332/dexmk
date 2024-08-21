import React from 'react';
import { Link } from 'react-scroll';

const Navbar = ({ account, connectWallet, disconnectWallet, switchAccount }) => {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 1px',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'Arial',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
      }}
    >
      <h2 style={{ margin: 0 }}>InandaYodwa Presale</h2>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        <div style={{ marginRight: '20px' }}>
          <Link to="home" smooth={true} duration={500} style={{ color: 'black', cursor: 'pointer', textDecoration: 'none' }}>Home</Link>
          <Link to="contact" smooth={true} duration={500} style={{ color: 'black', cursor: 'pointer', textDecoration: 'none', marginLeft: '15px' }}>Contact</Link>
        </div>
        {account ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button
              onClick={switchAccount}
              style={{
                padding: '5px 10px',
                cursor: 'pointer',
                backgroundColor: 'darkorange',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
              }}
            >
              Switch Account
            </button>
            <button
              onClick={disconnectWallet}
              style={{
                padding: '5px 10px',
                cursor: 'pointer',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
              }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            style={{
              padding: '5px 10px',
              cursor: 'pointer',
              backgroundColor: 'lightgreen',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              fontSize: '18px', // Increase font size here
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

