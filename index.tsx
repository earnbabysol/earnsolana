import { useWallet } from '@solana/wallet-adapter-react';
import { getProvider, getProgram } from '../utils/anchorProvider';
import { Button } from '@/components/ui/button';
import { SystemProgram } from '@solana/web3.js';
import { useState } from 'react';

export default function Home() {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);

  const handleZeroClaim = async () => {
    if (!wallet || !wallet.publicKey) {
      alert("Please connect your wallet first");
      return;
    }
    setLoading(true);
    try {
      const provider = getProvider();
      const program = await getProgram(provider);
      const tx = await program.methods
        .claimZero()
        .accounts({
          user: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      console.log("Claim success:", tx);
      alert("🎉 You received 10,000 $EARN!");
    } catch (err) {
      console.error("Claim failed", err);
      alert("⚠️ Already claimed or failed.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <Button onClick={handleZeroClaim} disabled={loading}>
        🎁 Claim Free Airdrop (10,000 $EARN)
      </Button>
    </div>
  );
}
