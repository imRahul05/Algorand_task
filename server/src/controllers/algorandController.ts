import { Request, Response } from 'express';
import algosdk from 'algosdk';
import Transaction from '../models/transactionModel';
import { TransactionStatus } from '../types';
import { env } from '../config/environment';
const algodClient = new algosdk.Algodv2(env.ALGOD_TOKEN, env.ALGOD_SERVER, env.ALGOD_PORT);

interface AlgorandApiError extends Error {
    response?: {
        status: number;
        body: any;
    };
}

function isAlgorandApiError(error: unknown): error is AlgorandApiError {
    return (
        error instanceof Error &&
        typeof error === 'object' &&
        'response' in error
    );
}


// --- Controller Functions ---

export const sendTransaction = async (req: Request, res: Response) => {
    const { mnemonic, recipient, amount, note } = req.body;

    if (!mnemonic || !recipient || amount === undefined) {
        return res.status(400).json({ message: 'Missing required fields: mnemonic, recipient, amount' });
    }

    try {
        const senderAccount = algosdk.mnemonicToSecretKey(mnemonic);
        const senderAddress = senderAccount.addr;

        const suggestedParams = await algodClient.getTransactionParams().do();
        const noteEncoded = new TextEncoder().encode(note || '');

        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: senderAddress,
            to: recipient,
            amount: Number(amount),
            closeRemainderTo: undefined,
            note: noteEncoded,
            suggestedParams: suggestedParams,
        });

        const signedTxn = txn.signTxn(senderAccount.sk);
        const { txId } = await algodClient.sendRawTransaction(signedTxn).do() as unknown as { txId: string };

        // Save transaction to DB
        const newTransaction = new Transaction({
            txId,
            from: senderAddress,
            to: recipient,
            amount: Number(amount),
            note: note || '',
            status: TransactionStatus.Pending,
        });

        const savedTx = await newTransaction.save();
        res.status(201).json(savedTx);

    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send transaction';
        console.error('Transaction failed:', message);
        res.status(500).json({ message });
    }
};

// FIX: Use correct Request and Response types from express import.
export const getAllTransactions = async (_req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch transactions';
        res.status(500).json({ message });
    }
};

// FIX: Use correct Request and Response types from express import.
export const getTransactionStatus = async (req: Request, res: Response) => {
    const { txId } = req.params;

    try {
        const txFromDb = await Transaction.findOne({ txId });
        if (!txFromDb) {
            return res.status(404).json({ message: 'Transaction not found in database' });
        }

        if (txFromDb.status === TransactionStatus.Confirmed) {
            return res.status(200).json(txFromDb);
        }

        const txInfo = await algodClient.pendingTransactionInformation(txId).do();

        if (txInfo && txInfo['confirmed-round']) {
            txFromDb.status = TransactionStatus.Confirmed;
            txFromDb.confirmedRound = txInfo['confirmed-round'];
            await txFromDb.save();
        }

        res.status(200).json(txFromDb);
        
    } catch (error) {
        if (isAlgorandApiError(error) && error.response?.status === 404) {
            const txFromDb = await Transaction.findOne({ txId });
            if (txFromDb) {
                return res.status(200).json(txFromDb);
            }
        }
        
        const message = error instanceof Error ? error.message : 'Failed to check transaction status';
        res.status(500).json({ message });
    }
};