console.log("App Loaded");

let walletAddress = null;

// Connect Wallet
const connectBtn = document.getElementById("connectBtn");
connectBtn.addEventListener("click", async () => {
  try {
    if (!window.solana) {
      alert("Please install Phantom Wallet first!");
      return;
    }
    const resp = await window.solana.connect();
    walletAddress = resp.publicKey.toString();
    console.log("Connected Wallet:", walletAddress);
    connectBtn.innerText = walletAddress.slice(0, 4) + "..." + walletAddress.slice(-4);
    document.getElementById("refLink").value = window.location.origin + "?ref=" + walletAddress;
  } catch (err) {
    console.error("Wallet Connection Error:", err);
    alert("Wallet connection failed!");
  }
});

// Mint button placeholder
const mintBtn = document.getElementById("mintBtn");
mintBtn.addEventListener("click", async () => {
  if (!walletAddress) {
    alert("Please connect your wallet first!");
    return;
  }
  const amount = parseFloat(document.getElementById("mintAmount").value);
  if (isNaN(amount) || amount < 0.1) {
    alert("Minimum mint amount is 0.1 SOL");
    return;
  }
  alert(`Mint request: ${amount} SOL (to be connected to smart contract later)`);
});
