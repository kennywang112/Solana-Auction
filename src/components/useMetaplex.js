import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { useWallet } from 'solana-wallets-vue';
import { Connection, clusterApiUrl } from "@solana/web3.js";

let metaplex = null;

export const useMetaplex = () => metaplex;

export const initMetaplex = () => {

    const connection = new Connection(clusterApiUrl('devnet'), "confirmed");
    const wallet = useWallet();
    if (wallet) {
        metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
    } else {
        metaplex = Metaplex.make(connection)
    }

}
