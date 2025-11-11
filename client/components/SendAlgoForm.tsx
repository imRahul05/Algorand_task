import React, { useReducer } from 'react';
import { sendTransaction } from '../services/apiService';
import { Transaction } from '../types/index';
import { useToast } from '../hooks/useToast';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/Card';

declare const window: any;

interface SendAlgoFormProps {
  onTransactionSent: (newTx: Transaction) => void;
}

interface FormState {
  recipient: string;
  amount: string;
  mnemonic: string;
  note: string;
  errors: { recipient: string; amount: string; mnemonic: string };
  loading: boolean;
}

const initialState: FormState = {
  recipient: 'TW3A3ZK4HPAQ3FGBGGQJW6CA67U65M4TDKH3DH645EYL46P37NA2T6Z2MI',
  amount: '',
  mnemonic: 'over pond secret marriage column rely art oil lottery midnight surge brief decline soft gate mixed elder mechanic burger sail vocal like uniform abandon avoid',
  note: '',
  errors: { recipient: '', amount: '', mnemonic: '' },
  loading: false,
};

type Action =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SET_ERROR'; field: string; value: string }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'RESET' };

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value, errors: { ...state.errors, [action.field]: '' } };
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.value } };
    case 'SET_LOADING':
      return { ...state, loading: action.value };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const SendAlgoForm: React.FC<SendAlgoFormProps> = ({ onTransactionSent }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { recipient, amount, mnemonic, note, errors, loading } = state;
  const { showToast } = useToast();

  const validate = () => {
    let valid = true;

    if (!recipient) {
      dispatch({ type: 'SET_ERROR', field: 'recipient', value: 'Recipient address is required.' });
      valid = false;
    } else if (!window.algosdk.isValidAddress(recipient)) {
      dispatch({ type: 'SET_ERROR', field: 'recipient', value: 'Invalid recipient address.' });
      valid = false;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      dispatch({ type: 'SET_ERROR', field: 'amount', value: 'Enter valid ALGO amount.' });
      valid = false;
    }

    if (!mnemonic) {
      dispatch({ type: 'SET_ERROR', field: 'mnemonic', value: 'Sender mnemonic required.' });
      valid = false;
    } else {
      try {
        window.algosdk.mnemonicToSecretKey(mnemonic);
      } catch {
        dispatch({ type: 'SET_ERROR', field: 'mnemonic', value: 'Invalid mnemonic.' });
        valid = false;
      }
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    dispatch({ type: 'SET_LOADING', value: true });

    try {
      const micro = parseFloat(amount) * 1_000_000;
      const tx = await sendTransaction(mnemonic, recipient, micro, note);

      onTransactionSent(tx);
      dispatch({ type: 'RESET' });
    } catch (error: any) {
      showToast(error?.message || 'Failed to send transaction.', 'error');
    } finally {
      dispatch({ type: 'SET_LOADING', value: false });
    }
  };

  const handleChange = (field: string) => (e: any) =>
    dispatch({ type: 'SET_FIELD', field, value: e.target.value });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Send ALGO</CardTitle>
        <CardDescription>Create a new transaction on the TestNet.</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">

          <div>
            <label>Recipient Address</label>
            <Input 
              value={recipient} 
              onChange={handleChange('recipient')}
              className={errors.recipient && "border-red-500"}
            />
            {errors.recipient && <p className="text-sm text-red-500">{errors.recipient}</p>}
          </div>

          <div>
            <label>Amount (ALGO)</label>
            <Input 
              type="number" 
              value={amount} 
              onChange={handleChange('amount')} 
              className={errors.amount && "border-red-500"}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          <div>
            <label>Note (Optional)</label>
            <Input value={note} onChange={handleChange('note')} />
          </div>

          <div>
            <label>Sender Mnemonic</label>
            <Textarea 
              value={mnemonic} 
              onChange={handleChange('mnemonic')}
              className={errors.mnemonic && "border-red-500"}
            />
            {errors.mnemonic && <p className="text-sm text-red-500">{errors.mnemonic}</p>}
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Transaction'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
