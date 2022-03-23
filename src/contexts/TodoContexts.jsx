import React, { useReducer } from "react";
// import { act } from "react-dom/test-utils";
import axios from "axios";

export const todoContext = React.createContext();

const INIT_STATE = {
  todos: [],
  taskToEdit: null,
};

const reducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "GET_TODOS_DATA":
      return { ...state, todos: action.payload };
    case "EDIT_TODO":
      return { ...state, taskToEdit: action.payload };

    default:
      return state;
  }
};

const TodoContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  //   for get запрос пропишем новый action-необязательно писать get после axios
  const getTodosData = async () => {
    let { data } = await axios("http://localhost:8000/todos");
    console.log(data);
    dispatch({
      type: "GET_TODOS_DATA",
      payload: data,
    });
  };

  const addTask = (newTask) => {
    axios.post("http://localhost:8000/todos", newTask);

    getTodosData();

    // fetch("http://localhost:8000/todos", {
    //   method: "POST",
    //   body: JSON.stringify(newTask),
    //   headers: { "Content-Type": "application.json" },
    // });
  };

  const changeStatus = async (id) => {
    let { data } = await axios(`http://localhost:8000/todos/${id}`);

    await axios.patch(`http://localhost:8000/todos/${id}`, {
      status: !data.status,
    });
    getTodosData();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:8000/todos/${id}`);
    getTodosData();
  };

  const editTodo = async (id) => {
    let { data } = await axios(`http://localhost:8000/todos/${id}`);
    dispatch({
      type: "EDIT_TODO",
      payload: data,
    });
  };

  const saveTask = async (newTask) => {
    axios.patch(`http://localhost:8000/todos/${newTask.id}`, newTask);
  };

  return (
    <todoContext.Provider
      value={{
        todos: state.todos,
        taskToEdit: state.taskToEdit,
        addTask,
        getTodosData,
        changeStatus,
        deleteTask,
        editTodo,
        saveTask,
      }}
    >
      {children}
    </todoContext.Provider>
  );
};

export default TodoContextProvider;
