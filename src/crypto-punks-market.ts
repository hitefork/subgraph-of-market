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
  BuyerInfo,
  SaleStats
 
} from "../generated/schema"


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
     // 获取购买者信息
     let buyerInfo = new BuyerInfo(event.params.toAddress) // 使用购买者地址作为ID
     buyerInfo.punkIndex = event.params.punkIndex
     buyerInfo.value = event.params.value
   
     buyerInfo.save()
  //获取购买者状态
     let buyerStats = BuyerInfo.load(event.params.toAddress);
     
     if (!buyerStats) {
       buyerStats = new BuyerInfo(event.params.toAddress);
       buyerStats.address = event.params.toAddress;
       buyerStats.totalValueBought =  event.params.value;
       buyerStats.numPunksBought = 1;
     } else {
       buyerStats.totalValueBought = buyerStats.totalValueBought.plus(event.params.value);
       buyerStats.numPunksBought += 1;
     }
   
     buyerStats.save();
    
  }
export function handleAssign(event: AssignEvent): void {
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
