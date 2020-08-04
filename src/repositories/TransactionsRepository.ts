import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const initialValue = 0;

    const totalIncome = this.transactions.reduce((accumulator, current) => {
      return accumulator + (current.type === 'income' ? current.value : 0);
    }, initialValue);

    const totalOutcome = this.transactions.reduce((accumulator, current) => {
      return accumulator + (current.type === 'outcome' ? current.value : 0);
    }, initialValue);

    const totalBalance = totalIncome - totalOutcome;

    const balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalBalance,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    if (type !== 'income' && type !== 'outcome') {
      throw Error('Transaction type is invalid.');
    }

    if (value <= 0) {
      throw Error('Transaction value is invalid.');
    }

    const balance = this.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw Error('Transaction amount exceeds available balance.');
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
