export interface TodoState {
  id: number;
  itemName: string;
  dueDate: Date;
  remarks: string;
  isCompleted: boolean;
}

export interface ITodoState {
  todoList: TodoState[];
}
