import mongoose, { Document, ObjectId, Schema } from 'mongoose'

export enum State {
	IN_CART = 'IN_CART',
	TO_PAY = 'TO_PAY',
	TO_SHIP = 'TO_SHIP',
	TO_RECEIVE = 'TO_RECEIVE',
	COMPLETED = 'COMPLETED',
	CANCELED = 'CANCELED',
	REFUND = 'REFUND',
}

export interface ITransaction {
	order: [ObjectId]
	state: string
	priceTotal: Number
	user: ObjectId
}

export interface ITransactionDocument extends ITransaction, Document {}

const TransactionSchema: Schema = new Schema<ITransactionDocument>(
	{
		order: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Order' }],
		state: { type: String, enum: Object.values(State), default: State.IN_CART },
		priceTotal: { type: Number, required: true },
		user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	},
	{
		versionKey: false,
		timestamps: true,
	}
)

export default mongoose.model<ITransactionDocument>('Transaction', TransactionSchema)
