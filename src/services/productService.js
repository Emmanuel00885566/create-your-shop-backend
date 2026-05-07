import Product from '../models/Product.js'

export function createProductSvc(payload){return Product.create(payload)}
export function listProductsSvc({search,category}){const q={};if(search)q.product_name={$regex:search,$options:'i'};if(category)q.category=category;return Product.find(q).sort({createdAt:-1})}
export function getSingleProductSvc(product_name){return Product.findOne({product_name:{$regex:new RegExp(`^${product_name}$`,'i')}})}
export function updateProductSvc(product_name,body){return Product.updateOne({product_name},{ $set:body })}
export function deleteProductSvc(product_name){return Product.deleteOne({product_name})}
