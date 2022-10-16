import mongoose, { Document,  ObjectId, Schema } from 'mongoose'

export interface IOrder {
	product: ObjectId
	quantity: Number
	priceUnit: Number
}

export interface IOrderDocument extends IOrder, Document {}

const OrderSchema: Schema = new Schema<IOrderDocument>(
	{
		product: { type: mongoose.Types.ObjectId, required: true, ref: 'Product' },
		quantity: { type: Number, required: true },
		priceUnit: { type: Number, required: true },
	},
	{
		versionKey: false,
		timestamps: true,
	}
)

export default mongoose.model<IOrderDocument>('Order', OrderSchema)
