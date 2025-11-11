import React, { useMemo } from 'react';
// FIX: Corrected import path to avoid conflict with empty types.ts file.
import { Transaction, TransactionStatus } from '../types/index';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';

interface TransactionListProps {
    transactions: Transaction[];
}

const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
    const baseClasses = "px-2.5 py-1 rounded-full text-xs font-semibold capitalize tracking-wide";
    switch (status) {
        case TransactionStatus.Confirmed:
            return <span className={`${baseClasses} bg-green-500/10 text-green-400`}>Confirmed</span>;
        case TransactionStatus.Pending:
            return <span className={`${baseClasses} bg-yellow-500/10 text-yellow-400 animate-pulse`}>Pending</span>;
        case TransactionStatus.Failed:
            return <span className={`${baseClasses} bg-red-500/10 text-red-400`}>Failed</span>;
        default:
            return <span className={`${baseClasses} bg-gray-500/10 text-gray-400`}>{status}</span>;
    }
};

const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 6)}`;
const formatAmount = (amount: number) => `${(amount / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ALGO`;
const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
    const sortedTransactions = useMemo(() => 
        [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), 
        [transactions]
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Transaction History</CardTitle>
                <CardDescription>A log of all transactions sent from this browser.</CardDescription>
            </CardHeader>
            <CardContent>
                {sortedTransactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tx ID</TableHead>
                                    <TableHead>From / To</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedTransactions.map(tx => (
                                    <TableRow key={tx._id}>
                                        <TableCell>
                                            <a href={`https://testnet.allo.info/tx/${tx.txId}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-mono text-xs">
                                                {formatAddress(tx.txId)}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col font-mono text-xs">
                                                <span><span className="text-muted-foreground">F:</span> {formatAddress(tx.from)}</span>
                                                <span><span className="text-muted-foreground">T:</span> {formatAddress(tx.to)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{formatAmount(tx.amount)}</TableCell>
                                        <TableCell className="text-center"><StatusBadge status={tx.status} /></TableCell>
                                        <TableCell className="text-right text-muted-foreground text-xs">{formatDate(tx.createdAt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-16 text-muted-foreground">
                        <p className="text-lg font-medium">No transactions yet.</p>
                        <p className="text-sm">Send your first transaction to see it appear here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};