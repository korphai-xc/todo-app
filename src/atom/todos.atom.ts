import { EditTodo, Todo } from "@/components/Lists/interface";
import { RecoilState, atom } from "recoil";

export const atomTodoLists: RecoilState<Todo[]> = atom({
  key: "TodoLists",
  default: [],
});
