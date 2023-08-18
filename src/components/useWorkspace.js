import { useWallet } from "solana-wallets-vue";
import { Connection, clusterApiUrl } from "@solana/web3.js";

let workspace = null;

export const useWorkspace = () => workspace;

export const initWorkspace = () => {

    const wallet = useWallet();
    const connection = new Connection(clusterApiUrl('devnet'), "confirmed");

    workspace = {
        wallet,
        connection
    }
}
