<script setup>
import { useMetaplex } from './useMetaplex'
import { useWorkspace } from './useWorkspace'
import { ref, onMounted } from "vue";
import { Keypair, Transaction,PublicKey, ComputeBudgetProgram } from '@solana/web3.js';
import bs58 from "bs58";
import { List, Bid, Execute, Buy, Sell, Print_list_receipt } from "@/components/useAuction"
import functions from 'daisyui/src/colors/functions';

const { connection, wallet } = useWorkspace();
const metaplex = useMetaplex()

let mindId = new PublicKey('8iKE3PGJbJMYvCGKXuZaTJS7Y82yFoAibb8CX1Bk7xob')
let seller = new PublicKey('2JeNLSrJkSaWoFoSQkb1YsxC1dXSaA1LTLjpakzb9SBf')
let buyer = metaplex.identity().publicKey.value

let Auction_House = new PublicKey("DYJGVipuxyXpJoPqzFLq44e5xJWRzao6qu12TTioAMWq")
let bs = bs58.decode("Bhao6w2hvn5LtBgJ6nAno3qTy6WMyn59k7sdbFdJVsRapumSJfF86hZ1wcWJ6SxuEhuJUwC2DoNu5YTA9DyMFSy");
let ah_auth_wallet = Keypair.fromSecretKey(bs);
let feepayer_value = metaplex.identity().publicKey.value
let nfts_info = ref([]);

// const sign_value = metaplex.identity()._driver.walletAdapter.signTransaction.value
// metaplex.identity()._driver.walletAdapter.signTransaction = sign_value

onMounted(async () => { 
    await find_listings();
});


const doList = async () => {

    const ix = await List(mindId,wallet,metaplex,0.2*1000000000)
    const receipt_ix = await Print_list_receipt(mindId,wallet,metaplex,0.2*1000000000)
    console.log(ix)

    let tx = new Transaction();
    tx.add(ix).add(receipt_ix)
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    const feepayer_value = metaplex.identity().publicKey.value
    tx.feePayer = feepayer_value
    console.log(tx)

    metaplex.rpc().sendAndConfirmTransaction(tx,{skipPreflight:false},[metaplex.identity()])
}

const doBid = async () => {

    console.log(wallet)
    const ix = await Bid(mindId, wallet, metaplex, seller, 0.2*1000000000)

    const tx = new Transaction();
    tx.feePayer = feepayer_value
    tx.add(ix)
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

    metaplex.rpc().sendAndConfirmTransaction(tx, {skipPreflight:false}, [metaplex.identity()])

}

const doExecute = async () => {

    const list_receipt = new PublicKey('2v6uoLTJXDZmhiKCbqGU5zczU4MoRvf61cBtuNL7ANL7')
    const ix = await Execute(mindId, wallet, metaplex, seller, 0.2*1000000000, buyer)

    let tx = new Transaction();
    const feepayer_value = metaplex.identity().publicKey.value
    tx.feePayer = feepayer_value
    tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 300000 }))
    tx.add(ix)
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    console.log(ix)
    metaplex.rpc().sendAndConfirmTransaction(tx,{skipPreflight:false},[ah_auth_wallet])

}

const doBuy = async () => {

    const ixs = await Buy(mindId, wallet, metaplex, seller, 0.2*1000000000, buyer)

    const tx = new Transaction();
    const feepayer_value = metaplex.identity().publicKey.value
    tx.feePayer = feepayer_value
    for(const ix of ixs){
        tx.add(ix)
    }
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    console.log(metaplex.identity())
    metaplex.rpc().sendAndConfirmTransaction(tx,{skipPreflight:true},[ah_auth_wallet])

    console.log(tx)

}

const doSell = async () => {

    const ixs = await Sell(mindId, wallet, metaplex, 0.2*1000000000, buyer)

    const tx = new Transaction();
    const feepayer_value = metaplex.identity().publicKey.value
    tx.feePayer = feepayer_value
    for(const ix of ixs){
        tx.add(ix)
    }
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

    metaplex.rpc().sendAndConfirmTransaction(tx,{skipPreflight:false},[ah_auth_wallet])

    console.log(ixs)
}

const find_listings = async () => {

    let nfts_asset = null;

    const auctionHouse = await metaplex
        .auctionHouse()
        .findByAddress({ address: Auction_House });

    const listings = await metaplex.auctionHouse().findListings({ auctionHouse })

    const nftsPromises = await listings.map(

        async function(listing){

            const nft = await metaplex
                .auctionHouse()
                .findListingByReceipt({ receiptAddress: listing.receiptAddress, auctionHouse })
            const nft_asset = nft.asset

            if(nft_asset.collection){

                if(nft_asset.collection.address.toString() == "JBKb1iCjzS3AuUKYJyt83hZNCvYyd5cEGmpqLZRqKPbj"){

                    nfts_info.value.push(nft_asset)

                }
            }
        }
    )

    nfts_asset = await Promise.all(nftsPromises)
}

</script>


<template>
    <div>
        <button
            class="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
            @click="doList">
            list
        </button>
        <button
            class="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
            @click="doBid">
            bid
        </button>
        <button
            class="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
            @click="doExecute">
            execute
        </button>
        <button
            class="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
            @click="doBuy">
            buy
        </button>
        <button
            class="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
            @click="doSell">
            sell
        </button>
        <button
            class="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
            @click="find_listings">
            find listings
        </button>
    </div>
    <div class="image-container">
        <div v-for="(nft, index) in nfts_info" :key="index">
            <img :src="nft.json.image" width="170" height="170" />
            <p>
            {{ nft.name }}<br />
            </p>
        </div>
    </div>
</template>

<style scoped>
.image-container {/*放置所有nft的區塊*/
  gap: 0px;/* 照片中間的空格 */
  /* flex-direction: row;  改成下面的wrap讓他可以換行*/
  flex-wrap: wrap;
  display: flex;
  overflow-x: auto; /*滾動*/
  height: 700px;
  width: 1000px;
}
</style>