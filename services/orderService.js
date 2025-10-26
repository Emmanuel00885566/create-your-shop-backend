import Order from '../models/Order.js'

export function createOrderSvc(data){return Order.create(data)}
export function getOrderByIdSvc(id){return Order.findById(id)}
export function listOrdersSvc(filter){return Order.find(filter).sort({createdAt:-1})}
export function updateOrderStatusSvc(id,status){return Order.findByIdAndUpdate(id,{status},{new:true})}
export function updateDeliveryStatusSvc(id,deliveryStatus){return Order.findByIdAndUpdate(id,{deliveryStatus},{new:true})}