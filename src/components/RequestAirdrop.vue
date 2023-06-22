<script setup>
import store from '../vuex';
import { useWallet } from 'solana-wallets-vue'
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Metaplex , walletAdapterIdentity } from "@metaplex-foundation/js"

const wallet = useWallet();

async function requestAirdrop () {
    const connection = new Connection(clusterApiUrl('devnet'));
    const metaplex =new Metaplex(connection)
    metaplex.use(walletAdapterIdentity(wallet))
    console.log("Your Pubickey",metaplex.identity().publicKey._value.toString())

}
</script>

<template>
    <div>
        <button
            class="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
            @click="requestAirdrop"
        >
            <span>
                Airdrop 1
            </span>
        </button>
    </div>
</template>
