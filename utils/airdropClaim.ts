import { getProvider, getProgram } from './anchorProvider';
import { SystemProgram } from '@solana/web3.js';

export async function claimZero(wallet: any) {
  const provider = getProvider();
  const program = await getProgram(provider);

  const tx = await program.methods
    .claimZero()
    .accounts({
      user: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}
