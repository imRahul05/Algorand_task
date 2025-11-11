import React, { useState, useEffect, useCallback } from "react";
import { SendAlgoForm } from "../SendAlgoForm";
import { TransactionList } from "../TransactionList";
import { useToast } from "../../hooks/useToast";
import { checkTransactionStatus, fetchAllTransactions } from "../../services/apiService";
import { Transaction, TransactionStatus } from "../../types/index";
import { ThemeToggleButton } from "../ThemeToggleButton";
import { Separator } from "../ui/separator";

const Layout: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activeTab, setActiveTab] = useState<"send" | "txns">("send");
    const { showToast } = useToast();

    const fetchAndSetTransactions = useCallback(async () => {
        try {
            const serverTxs = await fetchAllTransactions();
            setTransactions(serverTxs);
        } catch (error) {
            showToast(
                error instanceof Error ? error.message : "Failed to fetch transactions.",
                "error"
            );
        }
    }, [showToast]);

    useEffect(() => {
        fetchAndSetTransactions();
    }, [fetchAndSetTransactions]);

    const pollForConfirmation = useCallback(async () => {
        const pendingTxs = transactions.filter(tx => tx.status === TransactionStatus.Pending);
        if (!pendingTxs.length) return;

        let refreshed = false;

        for (const tx of pendingTxs) {
            try {
                const updatedTx = await checkTransactionStatus(tx.txId);
                if (updatedTx.status === TransactionStatus.Confirmed) {
                    refreshed = true;
                    showToast(`Tx ${tx.txId.slice(0, 6)}... confirmed ✅`, "success");
                }
            } catch { }
        }

        if (refreshed) fetchAndSetTransactions();
    }, [transactions, showToast, fetchAndSetTransactions]);

    useEffect(() => {
        const interval = setInterval(pollForConfirmation, 5000);
        return () => clearInterval(interval);
    }, [pollForConfirmation]);

    return (
        <div className="container mx-auto p-4 md:p-8 font-sans">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Algo-Sender</h1>
                    <p className="text-sm text-muted-foreground">
                        Send & track Algorand TestNet transactions
                    </p>
                </div>
                <ThemeToggleButton />
            </header>

            {/* Tabs */}
            <div className="flex items-center space-x-4 mb-4">
                <button
                    onClick={() => setActiveTab("send")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "send"
                            ? "bg-primary text-white"
                            : "bg-secondary text-foreground dark:bg-gray-700 dark:text-gray-200"
                        }`}
                >
                    Send ALGO
                </button>

                <button
                    onClick={() => setActiveTab("txns")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "txns"
                            ? "bg-primary text-white"
                            : "bg-secondary text-foreground dark:bg-gray-700 dark:text-gray-200"
                        }`}
                >
                    Transactions
                </button>

            </div>

            <Separator className="my-4" />

            {/* Page content */}
            {activeTab === "send" ? (
                <SendAlgoForm onTransactionSent={fetchAndSetTransactions} />
            ) : (
                <TransactionList transactions={transactions} />
            )}
        </div>
    );
};

export default Layout;
