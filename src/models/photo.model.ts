import mongoose, { Document, Schema } from 'mongoose'

export interface IPhoto {
	name?: string
	imagePath: string
	mimetype: string
	description?: string
}

export interface IPhotoDocment extends IPhoto, Document {}

const PhotoSchema: Schema = new Schema<IPhotoDocment>(
	{
		name: { type: String, required: true },
		imagePath: { type: String, required: true },
		mimetype: { type: String, required: true },
		description: { type: String, required: true },
	},
	{
		versionKey: false,
		timestamps: true,
	}
)

export default mongoose.model<IPhotoDocment>('Photo', PhotoSchema)
