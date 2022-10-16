import mongoose, { Document, Model, ObjectId, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import Logging from '../library/logging'

export enum Role {
	ADMIN = 'ADMIN',
	USER = 'USER',
	EMPLOYEE = 'EMPLOYEE',
}

export interface IUser {
	displayName: string
	photo: ObjectId
	userName?: string
	passWord: string
	role: [string]
	refreshToken?: string
}

export interface IUserMethods {
	ischeckPassWord: (passWord: string) => Promise<boolean>
}

export interface IUserDocment extends IUser, Document {}

export interface IUserModel extends Model<IUser, {}, IUserMethods> {}

const UserSchema: Schema = new Schema<IUserDocment, IUserModel, IUserMethods>(
	{
		displayName: { type: String, required: true },
		photo: { type: Schema.Types.ObjectId, required: true, ref: 'Photo' },
		userName: { type: String, required: true, unique: true },
		passWord: { type: String, required: true },
		role: { type: [String], enum: Object.values(Role), default: [Role.USER] },
		refreshToken: { type: String, }
	},
	{
		versionKey: false,
		timestamps: true,
	}
)

UserSchema.pre<IUser>('save', async function (next) {
	try {
		const salt = await bcrypt.genSalt(10)
		const hashPassWord = await bcrypt.hash(this.passWord, salt)
		this.passWord = hashPassWord
		next()
	} catch (error) {
		Logging.error(error)
	}
})

UserSchema.method('ischeckPassWord', async function ischeckPassWord(passWord: string) {
	try {
		return await bcrypt.compare(passWord, this.passWord)
	} catch (error) {
		Logging.error(error)
	}
})

export default mongoose.model<IUserDocment, IUserModel>('User', UserSchema)
