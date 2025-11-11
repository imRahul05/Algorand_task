import mongoose, { Schema, Document } from 'mongoose';
import { TransactionStatus } from '../types';

export interface ITransaction extends Document {
    txId: string;
    from: string;
    to: string;
    amount: number;
    note: string;
    status: TransactionStatus;
    createdAt: Date;
    confirmedRound?: number;
}

const TransactionSchema: Schema = new Schema({
    txId: { type: String, required: true, unique: true, index: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: Number, required: true }, // in microAlgos
    note: { type: String },
    status: { type: String, enum: Object.values(TransactionStatus), default: TransactionStatus.Pending },
    createdAt: { type: Date, default: Date.now },
    confirmedRound: { type: Number },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
