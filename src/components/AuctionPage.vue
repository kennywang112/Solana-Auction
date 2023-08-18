<script setup>
import { useMetaplex } from './useMetaplex'
import { useWorkspace } from './useWorkspace'
import { Keypair, Transaction,PublicKey, ComputeBudgetProgram } from '@solana/web3.js';
import bs58 from "bs58";
import { List, Bid, Execute, Buy, Sell } from "@/components/useAuction"

const { connection, wallet } = useWorkspace();
const metaplex = useMetaplex()

let mindId = new PublicKey('5wQ5FEfWHc3aayoKv8SbaF9dr5T3eHGDk7cJum2F3MQR')

let bs = bs58.decode("Bhao6w2hvn5LtBgJ6nAno3qTy6WMyn59k7sdbFdJVsRapumSJfF86hZ1wcWJ6SxuEhuJUwC2DoNu5YTA9DyMFSy");
let ah_auth_wallet = Keypair.fromSecretKey(bs);
let feepayer_value = metaplex.identity().publicKey.value

const doList = async () => {

    const ix = await List(mindId,wallet,metaplex,0.2*1000000000)
    console.log(ix)

    let tx = new Transaction();
    tx.add(ix)
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

    metaplex.rpc().sendAndConfirmTransaction(tx,{skipPreflight:false},[metaplex.identity()])
}

const doBid = async () => {

    const seller = new PublicKey('F4rMWNogrJ7bsknYCKEkDiRbTS9voM7gKU2rcTDwzuwf')

    const ix = await Bid(mindId, wallet, metaplex, seller, 0.2*1000000000)

    console.log(ix)
    const tx = new Transaction();
    tx.feePayer = feepayer_value
    tx.add(ix)
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    metaplex.rpc().sendAndConfirmTransaction(tx,{skipPreflight:false},[ah_auth_wallet])

}

const doExecute = async () => {

    const buyer = new PublicKey('Se9gzT3Ep3E452LPyYaWKYqcCvsAwtHhRQwQvmoXFxG')
    const seller = new PublicKey('F4rMWNogrJ7bsknYCKEkDiRbTS9voM7gKU2rcTDwzuwf')
    const list_receipt = new PublicKey('2v6uoLTJXDZmhiKCbqGU5zczU4MoRvf61cBtuNL7ANL7')
    const ix = await Execute(mindId, wallet, metaplex, seller, 0.2*1000000000, buyer)

    let tx = new Transaction();
    tx.feePayer = feepayer_value
    tx.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 300000 }))
    tx.add(ix)
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    console.log(ix)
    metaplex.rpc().sendAndConfirmTransaction(tx,{skipPreflight:false},[ah_auth_wallet])

}

const doBuy = async () => {

    const buyer = new PublicKey('Se9gzT3Ep3E452LPyYaWKYqcCvsAwtHhRQwQvmoXFxG')
    const seller = new PublicKey('F4rMWNogrJ7bsknYCKEkDiRbTS9voM7gKU2rcTDwzuwf')

    const ixs = await Buy(mindId, wallet, metaplex, seller, 0.2*1000000000, buyer)

    const tx = new Transaction();
    tx.feePayer = feepayer_value
    for(const ix of ixs){
        tx.add(ix)
    }
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

    metaplex.rpc().sendAndConfirmTransaction(tx,{skipPreflight:false},[ah_auth_wallet])

    console.log(tx)

}

const doSell = async () => {

    const buyer = new PublicKey('Se9gzT3Ep3E452LPyYaWKYqcCvsAwtHhRQwQvmoXFxG')

    const ixs = await Sell(mindId, wallet, metaplex, 0.2*1000000000, buyer)

    const tx = new Transaction();
    tx.feePayer = feepayer_value
    for(const ix of ixs){
        tx.add(ix)
    }
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

    metaplex.rpc().sendAndConfirmTransaction(tx,{skipPreflight:false},[ah_auth_wallet])

    console.log(ixs)
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
    </div>
</template>
