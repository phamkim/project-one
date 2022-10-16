import mongoose, { Document, ObjectId, Schema  } from 'mongoose'

export interface IProduct {
	name: string
	photo: [ObjectId]
	description: string
	quantity: Number
	price: Number
	discount: Number
	category: ObjectId
}

export interface IProductDocument extends IProduct, Document {}

const ProductSchema: Schema = new Schema<IProductDocument>(
	{
		name: { type: String, required: true },
		photo: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Photo' }],
		description: { type: String, required: true },
		quantity: { type: Number, required: true },
		price: { type: Number, required: true },
		discount: { type: Number, required: true },
		category: { type: mongoose.Types.ObjectId, required: true, ref: 'Category' },
	},
	{
		versionKey: false,
		timestamps: true,
	}
)

export default mongoose.model<IProductDocument>('Product', ProductSchema)
