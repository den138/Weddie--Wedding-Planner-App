export interface LogisticsState {
  id: number;
  itemName: string;
  remarks?: string;
}

export interface ILogisticsState {
  materialList: LogisticsState[];
}
