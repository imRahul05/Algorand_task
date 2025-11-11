import { Transaction } from '../types/index';
const API_BASE_URL =import.meta.env.VITE_BACKEND_URL


const handleResponse = async (response: Response) => {
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
           
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
        }
        throw new Error(errorMessage);
    }
    return response.json();
};

export const fetchAllTransactions = async (): Promise<Transaction[]> => {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    return handleResponse(response);
};

export const sendTransaction = async (mnemonic: string, recipient: string, amount: number, note: string): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mnemonic, recipient, amount, note }),
    });
    return handleResponse(response);
};

export const checkTransactionStatus = async (txId: string): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/status/${txId}`);
    return handleResponse(response);
};