import {
  Assign as AssignEvent,
  Transfer as TransferEvent,
  PunkTransfer as PunkTransferEvent,
  PunkOffered as PunkOfferedEvent,
  PunkBidEntered as PunkBidEnteredEvent,
  PunkBidWithdrawn as PunkBidWithdrawnEvent,
  PunkBought as PunkBoughtEvent,
  PunkNoLongerForSale as PunkNoLongerForSaleEvent
  
} from "../generated/CryptoPunksMarket/CryptoPunksMarket"
import {
  Assign,
  Transfer,
  PunkTransfer,
  PunkOffered,
  PunkBidEntered,
  PunkBidWithdrawn,
  PunkBought,
  PunkNoLongerForSale,
  User,
  MetaData,
  Trait
 
 
} from "../generated/schema"




import { getTrait } from './traits'
export const TOKEN_URI = 'https://cryptopunks.app/cryptopunks/details/'
export const CONTRACT_URI = 'https://cryptopunks.app/cryptopunks'
import { BigInt, Bytes } from "@graphprotocol/graph-ts";
//基于原函数进行更改
export function handleTransfer(event: TransferEvent): void {
  let contract=Transfer.load(event.transaction.hash.concatI32(event.logIndex.toI32()))
  if(!contract){  //判断是否为空
  contract = new Transfer(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    contract.from = event.params.from
    contract.to = event.params.to
    contract.value = event.params.value
  
    contract.blockNumber = event.block.number
    contract.blockTimestamp = event.block.timestamp
    contract.transactionHash = event.transaction.hash
  }
  contract.to = event.params.to
  contract.save()//存储

  let owner=User.load(event.params.from)
  let buyer=User.load(event.params.to)

 //初始化
  if (!owner) {
    owner = new User(event.params.from)

    owner.count = BigInt.fromI32(0)
    owner.totalpunks = BigInt.fromI32(0)
    owner.numPunksBought = BigInt.fromI32(0)
    owner.numPunkssold = BigInt.fromI32(0)
    owner.save()

}
  if (!buyer) {
  buyer = new User(event.params.to)
  buyer.count = BigInt.fromI32(0)
  buyer.totalpunks = BigInt.fromI32(0)
  buyer.numPunksBought = BigInt.fromI32(0)
  buyer.numPunkssold = BigInt.fromI32(0)
  buyer.save()
}



  owner.totalpunks=owner.totalpunks.minus(BigInt.fromI32(1))

  buyer.totalpunks=buyer.totalpunks.plus(BigInt.fromI32(1))
 

  owner.save()
  buyer.save()
  

  
  }
  

  export function handlePunkBought(event: PunkBoughtEvent): void {
    let Bought = new PunkBought(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    Bought.punkIndex = event.params.punkIndex
    Bought.value = event.params.value
    Bought.fromAddress = event.params.fromAddress
    Bought.toAddress = event.params.toAddress
  
    Bought.blockNumber = event.block.number
    Bought.blockTimestamp = event.block.timestamp
    Bought.transactionHash = event.transaction.hash
  
    Bought.save()
   

/*type User @entity(immutable: true){
  id: Bytes! #用户ID
  punkIndex: BigInt! # uint256
  count:BigInt! #交易次数
  totalpunks: BigInt! #持有的punk总量
  numPunksBought: BigInt! #出售的punk总数
  numPunkssold: BigInt! #购买的punk总数
}
*/


  let owner=User.load(event.params.fromAddress)
  let buyer=User.load(event.params.toAddress)

 //初始化
  if (!owner) {
    owner = new User(event.params.fromAddress)
    owner.punkIndex = event.params.punkIndex

    owner.count = BigInt.fromI32(0)
    owner.totalpunks = BigInt.fromI32(0)
    owner.numPunksBought = BigInt.fromI32(0)
    owner.numPunkssold = BigInt.fromI32(0)
    owner.save()

}
  if (!buyer) {
  buyer = new User(event.params.fromAddress)
  buyer.punkIndex = event.params.punkIndex
  buyer.count = BigInt.fromI32(0)

  buyer.totalpunks = BigInt.fromI32(0)
  buyer.numPunksBought = BigInt.fromI32(0)
  buyer.numPunkssold = BigInt.fromI32(0)
  buyer.save()
}


  owner.count = owner.count.plus(BigInt.fromI32(1))
  owner.numPunkssold = owner.numPunkssold.plus(BigInt.fromI32(1))



  buyer.count = buyer.count.plus(BigInt.fromI32(1))
  buyer.numPunksBought = buyer.numPunksBought.plus(BigInt.fromI32(1))


  owner.save()
  buyer.save()
  
  
  }
  export function createMetadata(punkId: BigInt): MetaData {
    let metadata = new MetaData(punkId.toString())
    metadata.tokenURI = TOKEN_URI.concat(punkId.toString())
    metadata.contractURI = CONTRACT_URI
  
 
    metadata.contractURI = CONTRACT_URI
  
    metadata.traits = new Array<string>()
  
    metadata.save()
  
    return metadata as MetaData
  }
 
export function handleAssign(event: AssignEvent): void {

  let trait = getTrait(event.params.punkIndex.toI32())
  let tokenId = event.params.punkIndex
  let metadata = createMetadata(tokenId)
  if (trait !== null) {
		let traits = new Array<string>()
		let type = Trait.load(trait.type)
		if (!type) {
			type = new Trait(trait.type)
			type.type = 'TYPE'
			type.numberOfNfts = BigInt.fromI32(0)
		}

		type.numberOfNfts = type.numberOfNfts.plus(BigInt.fromI32(1))
		type.save()
		traits.push(type.id)

		for (let i = 0; i < trait.accessories.length; i++) {
			let accessoryName = trait.accessories[i]
			let acessoryId = accessoryName.split(' ').join('-')
			let accessory = Trait.load(acessoryId)

			if (accessory === null) {
				accessory = new Trait(acessoryId)
				accessory.type = 'ACCESSORY'
				accessory.numberOfNfts = BigInt.fromI32(0)
			}
			accessory.numberOfNfts = accessory.numberOfNfts.plus(BigInt.fromI32(1))
			accessory.save()
			traits.push(accessory.id)
		}

		metadata.traits = traits
	}

let assignment=Assign.load(event.transaction.hash.concatI32(event.logIndex.toI32()))
if(!assignment){  
  assignment = new Assign(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  assignment.to = event.params.to
  assignment.punkIndex = event.params.punkIndex

  assignment.blockNumber = event.block.number
  assignment.blockTimestamp = event.block.timestamp
  assignment.transactionHash = event.transaction.hash
}// Set initial value to 0
assignment.save()

let buyer=User.load(event.params.to)
if (!buyer) {
  buyer = new User(event.params.to)
  buyer.punkIndex = event.params.punkIndex
  buyer.count = BigInt.fromI32(0)
  buyer.totalpunks = BigInt.fromI32(0)
  buyer.numPunksBought = BigInt.fromI32(0)
  buyer.numPunkssold = BigInt.fromI32(0)
  buyer.save()
}

buyer.totalpunks = buyer.totalpunks.plus(BigInt.fromI32(1))
buyer.save()
metadata.save()


}


export function handlePunkTransfer(event: PunkTransferEvent): void {
  let handling=PunkTransfer.load( event.transaction.hash.concatI32(event.logIndex.toI32()))
  if(!handling){
    handling = new PunkTransfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  handling.from = event.params.from
  handling.to = event.params.to
  handling.punkIndex = event.params.punkIndex

  handling.blockNumber = event.block.number
  handling.blockTimestamp = event.block.timestamp
  handling.transactionHash = event.transaction.hash
  }
  handling.save()



}
// Update the value of the buyer when transfer occurs
export function handlePunkOffered(event: PunkOfferedEvent): void {
  let offered=PunkOffered.load(event.transaction.hash.concatI32(event.logIndex.toI32()))
  if(!offered){
    offered = new PunkOffered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  offered.punkIndex = event.params.punkIndex
  offered.minValue = event.params.minValue
  offered.toAddress = event.params.toAddress

  offered.blockNumber = event.block.number
  offered.blockTimestamp = event.block.timestamp
  offered.transactionHash = event.transaction.hash
  }
  offered.save()
}

export function handlePunkBidEntered(event: PunkBidEnteredEvent): void {
  let BidEntered= new PunkBidEntered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  BidEntered.punkIndex = event.params.punkIndex
  BidEntered.value = event.params.value
  BidEntered.fromAddress = event.params.fromAddress

  BidEntered.blockNumber = event.block.number
  BidEntered.blockTimestamp = event.block.timestamp
  BidEntered.transactionHash = event.transaction.hash

  BidEntered.save()
}

export function handlePunkBidWithdrawn(event: PunkBidWithdrawnEvent): void {
  let BidWithdrawn = new PunkBidWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  BidWithdrawn.punkIndex = event.params.punkIndex
  BidWithdrawn.value = event.params.value
  BidWithdrawn.fromAddress = event.params.fromAddress

  BidWithdrawn.blockNumber = event.block.number
  BidWithdrawn.blockTimestamp = event.block.timestamp
  BidWithdrawn.transactionHash = event.transaction.hash

  BidWithdrawn.save()
}



export function handlePunkNoLongerForSale(
  event: PunkNoLongerForSaleEvent
): void {
  let offered = new PunkNoLongerForSale(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  offered.punkIndex = event.params.punkIndex

  offered.blockNumber = event.block.number
  offered.blockTimestamp = event.block.timestamp
  offered.transactionHash = event.transaction.hash

  offered.save()
}
