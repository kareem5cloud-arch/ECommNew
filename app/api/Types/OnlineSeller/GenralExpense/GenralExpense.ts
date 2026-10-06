export interface ResponseExpense {
  message: string;
  error: string;
  expenseList: expenseList[];
}
export interface expenseList {
  expenseID: string;
  expenseAmount: number;
  expenseCategory: string;
  expenseDate: string;
  expenseName: string;
  remarks: string;
}

export interface ResponseExpenseCategory {
  message: string;
  error: string;
  expenseCategoryList: expenseCategoryList[];
}
export interface expenseCategoryList {
  expenseCategory: string;
}
