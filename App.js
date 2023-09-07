import React, { useState, useEffect } from 'react';
import './App.css';

const COLLECTIONS = [
  { name: "Bored Ape Yacht Club", contract: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d" },
  { name: "Mutant Ape Yacht Club", contract: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6" },
  { name: "Bored Ape Kennel Club", contract: "0xba30E5F9Bb24caa003E9f2f0497Ad287FDF95623" },
  { name: "Moonbirds", contract: "0x23581767a106ae21c074b2276D25e5C3e136a68b" },
  { name: "Moonbirds Mythics", contract: "0xC0FFee8FF7e5497C2d6F7684859709225Fcc5Be8" },
  { name: "Doodles", contract: "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e" },
  { name: "Azuki", contract: "0xED5AF388653567Af2F388E6224dC7C4b3241C544" },
  { name: "Azuki Elementals", contract: "0xB6a37b5d14D502c3Ab0Ae6f3a0E058BC9517786e" },
  { name: "Pudgy Penguins", contract: "0xBd3531dA5CF5857e7CfAA92426877b022e612cf8" },
  { name: "Lil Pudgys", contract: "0x524cAB2ec69124574082676e6F654a18df49A048" },
  { name: "Beanz", contract: "0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949" },
  { name: "MFers", contract: "0x79FCDEF22feeD20eDDacbB2587640e45491b757f" },
  { name: "The Captainz", contract: "0x769272677faB02575E84945F03Eca517ACc544Cc" },
  { name: "The Potatoz", contract: "0x39ee2c7b3cb80254225884ca001F57118C8f21B6" },
  { name: "ON1 Force", contract: "0x3bf2922f4520a8BA0c2eFC3D2a1539678DaD5e9D" },
  { name: "Cool Cats", contract: "0x1A92f7381B9F03921564a437210bB9396471050C" },
  { name: "VeeFriends", contract: "0xa3AEe8BcE55BEeA1951EF834b99f3Ac60d1ABeeB" },
  { name: "Clone X", contract: "0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B" }
];

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [selections, setSelections] = useState({ buy: null, sell: null, burn: null });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleNFTSelection = (nft, action) => {
    if (!selections[action]) {
      setSelections(prev => ({ ...prev, [action]: nft }));
    }
  };

 const handleConfirm = () => {
  if (!selections.buy || !selections.sell || !selections.burn) {
    alert("Please make all selections before submitting.");
    return;
  }
  setShowConfirmModal(false);
  alert(`You chose to Buy: ${selections.buy.name}, Sell: ${selections.sell.name}, Burn: ${selections.burn.name}`);
};

  const handleReset = () => {
    setSelections({ buy: null, sell: null, burn: null });
  };

useEffect(() => {
  console.log(nfts);
  if (gameStarted) {
    const randomCollection = COLLECTIONS[Math.floor(Math.random() * COLLECTIONS.length)];

fetch(`/fetchNFTs?contract=${randomCollection.contract}`), {
  headers: {
    'X-API-KEY': process.env.REACT_APP_OPENSEA_API_KEY
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      if (data && data.assets) {
        setNfts(data.assets);
      } else {
        console.error("Unexpected data structure from API:", data);
      }
    })
    .catch(error => {
      console.error("Error fetching NFTs:", error);
    });
  }
}, [gameStarted]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Buy, Sell, or Burn</h1>
        {!gameStarted ? (
          <button onClick={() => setGameStarted(true)}>Play</button>
        ) : (
          <div>
            {nfts && nfts.length > 0 ? nfts.map(nft => (
              <div key={nft.token_id}>
                <img src={nft.image_url} alt={nft.name} width={150} onClick={() => handleNFTSelection(nft, 'buy')} />
                <p>{nft.name}</p>
                <p>Collection: {nft.asset_contract.name}</p>
                <p>Token ID: {nft.token_id}</p>
                <button disabled={!!selections.buy} onClick={() => handleNFTSelection(nft, 'buy')}>Buy</button>
                <button disabled={!!selections.sell} onClick={() => handleNFTSelection(nft, 'sell')}>Sell</button>
                <button disabled={!!selections.burn} onClick={() => handleNFTSelection(nft, 'burn')}>Burn</button>
              </div>
            )) : <p>Loading...</p>}
            <button onClick={() => setShowConfirmModal(true)}>Submit Choices</button>
          </div>
        )}
        {showConfirmModal && (
          <div className="modal">
            Are you sure about your choices?
            <button onClick={handleConfirm}>Confirm</button>
            <button onClick={() => setShowConfirmModal(false)}>Cancel</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;