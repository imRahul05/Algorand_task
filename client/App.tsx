import React, { useState, useEffect, useCallback } from 'react';
import { SendAlgoForm } from './components/SendAlgoForm';
import { TransactionList } from './components/TransactionList';
import { ToastProvider, useToast } from './hooks/useToast';
import { checkTransactionStatus, fetchAllTransactions } from './services/apiService';
// FIX: Corrected import path to avoid conflict with empty types.ts file.
import { Transaction, TransactionStatus } from './types/index';
import { ThemeToggleButton } from './components/ThemeToggleButton';

const AppContent: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const { showToast } = useToast();

    const fetchAndSetTransactions = useCallback(async () => {
        try {
            const serverTxs = await fetchAllTransactions();
            setTransactions(serverTxs);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch transactions.';
            showToast(message, 'error');
        }
    }, [showToast]);

    useEffect(() => {
        fetchAndSetTransactions();
    }, [fetchAndSetTransactions]);
    
    const pollForConfirmation = useCallback(async () => {
        const pendingTxs = transactions.filter(tx => tx.status === TransactionStatus.Pending);
        if (pendingTxs.length === 0) return;

        let needsRefresh = false;
        for (const tx of pendingTxs) {
            try {
                const updatedTx = await checkTransactionStatus(tx.txId);
                if (updatedTx.status === TransactionStatus.Confirmed) {
                    needsRefresh = true;
                    showToast(`Transaction ${tx.txId.substring(0, 8)}... confirmed!`, 'success');
                }
            } catch (error) {
                console.error(`Error checking confirmation for ${tx.txId}:`, error);
            }
        }

        if (needsRefresh) {
            fetchAndSetTransactions();
        }
    }, [transactions, fetchAndSetTransactions, showToast]);

    useEffect(() => {
        const interval = setInterval(() => {
            pollForConfirmation();
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [pollForConfirmation]);

    const handleTransactionSent = (newTx: Transaction) => {
        fetchAndSetTransactions(); // Just refresh the list from the server
        showToast(`Transaction submitted: ${newTx.txId.substring(0, 8)}...`, 'info');
    };

    return (
        <div className="container mx-auto p-4 md:p-8 font-sans">
            <header className="flex justify-between items-center mb-10">
                <div className="text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">Algo-Sender</h1>
                    <p className="text-md text-muted-foreground">Send and track transactions on the Algorand TestNet.</p>
                </div>
                <ThemeToggleButton />
            </header>
            
            <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <SendAlgoForm onTransactionSent={handleTransactionSent} />
                </div>
                <div className="lg:col-span-3">
                    <TransactionList transactions={transactions} />
                </div>
            </main>
        </div>
    );
};


const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};


export default App;