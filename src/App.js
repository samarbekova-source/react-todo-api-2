import TodoContextProvider from "./contexts/TodoContexts";
import MyRoutes from "./Routes";

function App() {
  return (
    <div className="App">
      <TodoContextProvider>
        <MyRoutes />
      </TodoContextProvider>
    </div>
  );
}

export default App;

