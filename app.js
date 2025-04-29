console.log("App Loaded");

let walletAddress = null;
let currentWallet = null; // "phantom" or "okx"

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

// Connect Wallet按钮逻辑
const connectBtn = document.getElementById("connectBtn");
connectBtn.addEventListener("click", async () => {
  if (walletAddress) {
    // 已连接，点一下断开
    walletAddress = null;
    currentWallet = null;
    connectBtn.innerText = "Connect Wallet";
    document.getElementById("refLink").value = "https://yourdapp.com?ref=...";
    alert("Disconnected!");
  } else {
    // 未连接，弹出选择钱包
    showWalletOptions();
  }
});

// 钱包选择按钮
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

// 更新界面
function updateUIAfterConnect() {
  connectBtn.innerText = walletAddress.slice(0, 4) + "..." + walletAddress.slice(-4);
  document.getElementById("refLink").value = window.location.origin + "?ref=" + walletAddress;
  console.log("Connected:", walletAddress, "Wallet:", currentWallet);
}

// Mint按钮（暂时占位）
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
  alert(`Mint request: ${amount} SOL (smart contract interaction coming soon)`);
});
