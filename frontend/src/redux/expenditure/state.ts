export interface ExpenditureState {
  id: number;
  category: string;
  amount: number;
  description: string;
}

export interface IExpenditureState {
  expenditureList: ExpenditureState[];
}
