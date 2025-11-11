import React, { useState } from 'react';
import { sendTransaction } from '../services/apiService';
// FIX: Corrected import path to avoid conflict with empty types.ts file.
import { Transaction } from '../types/index';
import { useToast } from '../hooks/useToast';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/Card';
import { Alert, AlertDescription, AlertTitle } from './ui/Alert';

// Access algosdk from the window object, as it's loaded via a script tag.
declare const window: any;

interface SendAlgoFormProps {
    onTransactionSent: (newTx: Transaction) => void;
}

export const SendAlgoForm: React.FC<SendAlgoFormProps> = ({ onTransactionSent }) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [mnemonic, setMnemonic] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ recipient: '', amount: '', mnemonic: '' });
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = { recipient: '', amount: '', mnemonic: '' };
        let formIsValid = true;

        if (!recipient) {
            newErrors.recipient = 'Recipient address is required.';
            formIsValid = false;
        } else if (!window.algosdk.isValidAddress(recipient)) {
            newErrors.recipient = 'Invalid recipient address.';
            formIsValid = false;
        }

        if (!amount) {
            newErrors.amount = 'Amount is required.';
            formIsValid = false;
        } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            newErrors.amount = 'Amount must be a positive number.';
            formIsValid = false;
        }

        if (!mnemonic) {
            newErrors.mnemonic = 'Sender mnemonic is required.';
            formIsValid = false;
        } else {
            try {
                window.algosdk.mnemonicToSecretKey(mnemonic);
            } catch (error) {
                newErrors.mnemonic = 'Invalid sender mnemonic.';
                formIsValid = false;
            }
        }
        
        setErrors(newErrors);
        if (!formIsValid) {
            return;
        }
        
        setIsLoading(true);
        try {
            // Amount in ALGOs, convert to microAlgos
            const amountInMicroAlgos = parseFloat(amount) * 1_000_000;
            const newTx = await sendTransaction(mnemonic, recipient, amountInMicroAlgos, note);
            
            onTransactionSent(newTx);

            // Reset form
            setRecipient('');
            setAmount('');
            setMnemonic('');
            setNote('');
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'Failed to send transaction.';
            showToast(message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (
        setter: React.Dispatch<React.SetStateAction<string>>,
        field: keyof typeof errors
    ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setter(e.target.value);
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Send ALGO</CardTitle>
                <CardDescription>Create a new transaction on the TestNet.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} noValidate>
                <CardContent className="space-y-6">
                 {/* <Alert variant="warning">
                  <AlertTitle>Security Warning</AlertTitle>
                        <AlertDescription>
                            Never use mainnet mnemonics. Only use mnemonics for test accounts funded by the TestNet dispenser.
                        </AlertDescription>
                    </Alert>  */}
                    
                    <div className="space-y-2">
                        <label htmlFor="recipient" className="block text-sm font-medium text-foreground">Recipient Address</label>
                        <Input id="recipient" value={recipient} onChange={handleInputChange(setRecipient, 'recipient')} placeholder="Recipient address" required className={errors.recipient ? 'border-destructive focus-visible:ring-destructive' : ''} />
                        {errors.recipient && <p className="text-sm text-destructive mt-1">{errors.recipient}</p>}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="amount" className="block text-sm font-medium text-foreground">Amount (ALGO)</label>
                        <Input id="amount" type="number" value={amount} onChange={handleInputChange(setAmount, 'amount')} placeholder="e.g., 0.1" required min="0.000001" step="0.000001" className={errors.amount ? 'border-destructive focus-visible:ring-destructive' : ''} />
                        {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount}</p>}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="note" className="block text-sm font-medium text-foreground">Note (Optional)</label>
                        <Input id="note" value={note} onChange={e => setNote(e.target.value)} placeholder="Transaction note" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="mnemonic" className="block text-sm font-medium text-foreground">Sender Mnemonic</label>
                        <Textarea id="mnemonic" value={mnemonic} onChange={handleInputChange(setMnemonic, 'mnemonic')} placeholder="25-word secret key for a TestNet account" required rows={3} className={errors.mnemonic ? 'border-destructive focus-visible:ring-destructive' : ''} />
                        {errors.mnemonic && <p className="text-sm text-destructive mt-1">{errors.mnemonic}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? 'Sending...' : 'Send Transaction'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};