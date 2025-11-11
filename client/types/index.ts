export enum TransactionStatus {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Failed = 'failed',
}

export interface Transaction {
    _id: string;
    txId: string;
    from: string;
    to: string;
    amount: number; // in microAlgos
    note: string;
    status: TransactionStatus;
    createdAt: string;
    confirmedRound?: number;
}
