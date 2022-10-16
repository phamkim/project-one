import mongoose, { Document, ObjectId, Schema } from 'mongoose'

export interface ICategory {
	name: string
	photo: ObjectId
	description: string
}

export interface ICategoryDocument extends ICategory, Document {}

const CategorySchema: Schema = new Schema<ICategoryDocument>(
	{
		name: { type: String, required: true },
		photo: { type: Schema.Types.ObjectId, required: true, ref: 'Photo' },
		description: { type: String, required: true },
	},
	{
		versionKey: false,
		timestamps: true,
	}
)

export default mongoose.model<ICategoryDocument>('Category', CategorySchema)
