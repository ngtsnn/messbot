export type AddExpense = {
  user: number;
  category: string;
  amount: number;
  product?: string;
};

export type GetExpense = {
  user: number;
  category?: string;
}
