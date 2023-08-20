<script setup>
import { useMetaplex } from './useMetaplex'
import { useWorkspace } from './useWorkspace'
import { ref, onMounted  } from "vue";
import { SystemProgram, Keypair, Transaction, PublicKey, ComputeBudgetProgram } from '@solana/web3.js';
import { getAssociatedTokenAddressSync, getAccount , getMint, NATIVE_MINT} from "@solana/spl-token";
import { List, Bid, Execute, Buy, Sell, Print_list_receipt } from "@/components/useAuction"
import bs58 from "bs58";

const { connection, wallet } = useWorkspace();
const metaplex = useMetaplex()

let bs = bs58.decode("Bhao6w2hvn5LtBgJ6nAno3qTy6WMyn59k7sdbFdJVsRapumSJfF86hZ1wcWJ6SxuEhuJUwC2DoNu5YTA9DyMFSy");
let ah_auth_wallet = Keypair.fromSecretKey(bs);
let feepayer_value = metaplex.identity().publicKey.value;

let nfts_info = ref([]);
let delegate = ref([]);

const sign_value = metaplex.identity()._driver.walletAdapter.signTransaction.value
metaplex.identity()._driver.walletAdapter.signTransaction = sign_value

onMounted(async () => {
    await find_nft();
});

const find_nft = async () => {

    const all_nfts = await metaplex.nfts().findAllByOwner({owner: wallet.publicKey.value})

    const nftsPromises = await all_nfts.map(

        async function(nft){

            if(nft.collection){

                if(nft.collection.address.toString() == "JBKb1iCjzS3AuUKYJyt83hZNCvYyd5cEGmpqLZRqKPbj" ){

                    const nft_ata = getAssociatedTokenAddressSync(nft.mintAddress, wallet.publicKey.value)
                    const nft_info = await metaplex.nfts().findByToken({token: nft_ata})

                    //for finding delegate
                    const nft_delegate = await getAccount(connection, nft_ata)

                    nfts_info.value.push(nft_info)
                    delegate.value.push(nft_delegate.delegate)

                }

            }
        }
    )
    
}

const doList = async (nftIndex) => {

    try {

        const ix = await List(nftIndex.address,wallet,metaplex,0.2*1000000000)
        const receipt_ix = await Print_list_receipt(nftIndex.address,wallet,metaplex,0.2*1000000000)

        let tx = new Transaction();
        tx.add(ix).add(receipt_ix)
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

        tx.feePayer = feepayer_value

        metaplex.rpc().sendAndConfirmTransaction(tx, {skipPreflight:false}, [metaplex.identity()])

        console.log(tx)

    } catch(error) {

        console.log(error)

    }
}
</script>


<template>
    <div class="image-container">
        <div v-for="(nft, index) in nfts_info" :key="index">
            <img :src="nft.json.image" width="170" height="170" />
            <p>
            {{ nft.name }}<br />
            <button @click="() => doList(nft)">
                List
            </button><br />
            <span v-if="delegate[index] =='HS2eL9WJbh7pA4i4veK3YDwhGLRjY3uKryvG1NbHRprj'">Listing !</span>
        </p>
        </div>
        </div>
        <div>
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