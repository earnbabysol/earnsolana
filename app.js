console.log("App Loaded");

// Example of connecting Phantom Wallet
const connectBtn = document.getElementById("connectBtn");
connectBtn.addEventListener("click", async () => {
  try {
    const resp = await window.solana.connect();
    console.log("Connected:", resp.publicKey.toString());
    // Update referral link
    document.getElementById("refLink").value = window.location.origin + "?ref=" + resp.publicKey.toString();
  } catch (err) {
    console.error("Wallet Connection Error:", err);
  }
});

// Mint button placeholder
const mintBtn = document.getElementById("mintBtn");
mintBtn.addEventListener("click", () => {
  alert("Minting will be implemented here with real smart contract calls!");
});
