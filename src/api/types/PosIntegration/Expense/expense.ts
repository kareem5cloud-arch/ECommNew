export interface RequestExpenseAddData {
  expenseName: string;
  expenseDate: string;
  expenseType: string;
  description: string;
  amount: number;
}
export interface RequestExpenseModifyData {
  expenseID: string;
  expenseName: string;
  expenseDate: string;
  expenseType: string;
  description: string;
  amount: number;
}
export interface ResponseExpenseAddData {
  status: string;
  message?: string;
}

export interface ResponseExpenseGetData {
  message?: string;
  expenseList: ExpenseData[];
}
export interface ExpenseData {
  expenseID: string;
  expenseName: string;
  amount: number;
  postingDate: Date;
  description: string;
  expenseType: string;
}
