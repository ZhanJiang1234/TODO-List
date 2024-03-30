import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
const initialState = {
  todos: []
};
export const removeTodoAsync = createAsyncThunk(
  'todos/removeTodoAsync',
  async (id, { getState, dispatch }) => {
    dispatch(removeTodo(id)); // 调用现有的同步action来更新state
    const updatedTodos = getState().todos.todos; // 获取更新后的todos数组
    await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos)); 
  }
);
export const updateTodoTextAsync = createAsyncThunk(
  'todos/updateTodoText',
  async ({ id, text }, { getState, dispatch }) => {
    dispatch(updateTodoText({ id, text }));

    // 获取更新后的待办事项列表，保存到 AsyncStorage
    const updatedTodos = getState().todos.todos.map(todo => 
      todo.id === id ? { ...todo, text } : todo
    );
    await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
  }
);
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const now = new Date();
      const timestamp = `${now.toISOString().split('T')[0]} ${now.getHours()}:${now.getMinutes()}`;

      const newTodo = {
        ...action.payload,
        time: timestamp,
        weather: action.payload.weather
      };

      state.todos.push(newTodo);
    },
    removeTodo: (state, action) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    replaceTodos: (state, action) => {
      state.todos = action.payload;
    },
    updateTodoText: (state, action) => {
      const { id, text } = action.payload;
      const index = state.todos.findIndex(todo => todo.id === id);
      if (index !== -1) {
        state.todos[index].text = text;
      }
    },
  }
});

export const { addTodo, removeTodo, replaceTodos , updateTodoText } = todosSlice.actions;

export default todosSlice.reducer;
