import express from 'express';
import {
    sendTransaction,
    getAllTransactions,
    getTransactionStatus,
} from '../controllers/algorandController';

const router = express.Router();

router.post('/send', sendTransaction);
router.get('/transactions', getAllTransactions);
router.get('/status/:txId', getTransactionStatus);

export default router;
