console.log("App Loaded");

let walletAddress = null;
let currentWallet = null;

// 定义你的合约地址（Program Id）和营销钱包地址
const PROGRAM_ID = new solanaWeb3.PublicKey("你的合约Program地址"); 
const MARKETING_WALLET = new solanaWeb3.PublicKey("EwdUPy5n6Z19RDUf4ViAnVDfuZqfGQme8Hj5Qs5Moeiy");

// 添加弹窗元素
const walletOptions = document.createElement("div");
walletOptions.className = "fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 hidden";
walletOptions.innerHTML = `
  <div class="bg-gray-800 p-6 rounded-xl space-y-4 text-center">
    <h2 class="text-xl font-bold">Select Wallet</h2>
    <button id="phantomBtn" class="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-lg">Phantom</button>
    <button id="okxBtn" class="w-full bg-purple-500 hover:bg-purple-600 p-3 rounded-lg">OKX Wallet</button>
    <button id="cancelBtn" class="w-full bg-gray-600 hover:bg-gray-700 p-3 rounded-lg mt-4">Cancel</button>
  </div>
`;
document.body.appendChild(walletOptions);

// 控制弹窗
function showWalletOptions() {
  walletOptions.classList.remove("hidden");
}
function hideWalletOptions() {
  walletOptions.classList.add("hidden");
}

// Connect Wallet
const connectBtn = document.getElementById("connectBtn");
connectBtn.addEventListener("click", async () => {
  if (walletAddress) {
    walletAddress = null;
    currentWallet = null;
    connectBtn.innerText = "Connect Wallet";
    document.getElementById("refLink").value = "https://yourdapp.com?ref=...";
    alert("Disconnected!");
  } else {
    showWalletOptions();
  }
});

// 选择Phantom
document.getElementById("phantomBtn").addEventListener("click", async () => {
  hideWalletOptions();
  if (!window.solana || !window.solana.isPhantom) {
    alert("Please install Phantom Wallet first!");
    return;
  }
  try {
    const resp = await window.solana.connect();
    walletAddress = resp.publicKey.toString();
    currentWallet = "phantom";
    updateUIAfterConnect();
  } catch (err) {
    console.error(err);
    alert("Failed to connect Phantom Wallet");
  }
});

// 选择OKX
document.getElementById("okxBtn").addEventListener("click", async () => {
  hideWalletOptions();
  if (!window.okxwallet || !window.okxwallet.solana) {
    alert("Please install OKX Wallet Extension!");
    return;
  }
  try {
    const resp = await window.okxwallet.solana.connect();
    walletAddress = resp.publicKey.toString();
    currentWallet = "okx";
    updateUIAfterConnect();
  } catch (err) {
    console.error(err);
    alert("Failed to connect OKX Wallet");
  }
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  hideWalletOptions();
});

// 更新UI
function updateUIAfterConnect() {
  connectBtn.innerText = walletAddress.slice(0, 4) + "..." + walletAddress.slice(-4);
  document.getElementById("refLink").value = window.location.origin + "?ref=" + walletAddress;
  console.log("Connected:", walletAddress, "Wallet:", currentWallet);
}

// 真正的Mint逻辑
const mintBtn = document.getElementById("mintBtn");
mintBtn.addEventListener("click", async () => {
  if (!walletAddress) {
    alert("Please connect your wallet first!");
    return;
  }
  const amountSOL = parseFloat(document.getElementById("mintAmount").value);
  if (isNaN(amountSOL) || amountSOL < 0.1) {
    alert("Minimum mint amount is 0.1 SOL");
    return;
  }

  try {
    const provider = currentWallet === "phantom" ? window.solana : window.okxwallet.solana;
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));

    const transaction = new solanaWeb3.Transaction();

    const lamports = solanaWeb3.LAMPORTS_PER_SOL * amountSOL;

    // 创建支付SOL的Instruction
    const transferInstruction = solanaWeb3.SystemProgram.transfer({
      fromPubkey: new solanaWeb3.PublicKey(walletAddress),
      toPubkey: PROGRAM_ID, // 直接发到你的合约
      lamports: lamports,
    });

    transaction.add(transferInstruction);

    transaction.feePayer = new solanaWeb3.PublicKey(walletAddress);
    let blockhashObj = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhashObj.blockhash;

    const signedTransaction = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    console.log("Transaction Signature", signature);
    alert(`Mint transaction sent! TxID: ${signature}`);
  } catch (error) {
    console.error("Mint Error:", error);
    alert("Transaction failed!");
  }
});
