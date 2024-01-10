import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [todo, setTodo] = useState("");
  const [id, setId] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  // fetching list
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/todo/list");
      setTodoList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // editing single todo
  const handleEditTodo = async (_id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/todo/edit/${_id}`
      );
      setId(response.data._id);
      setTodo(response.data.todos);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // adding single todo
  const handleAddTodo = async () => {
    try {
      await axios.post("http://localhost:5000/todo/add", { todos: todo });
      fetchData();
      setTodo("");
      alert("todo added");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };
  // updating single todo
  const handleUpdateTodo = async () => {
    try {
      await axios.post(`http://localhost:5000/todo/update/${id}`, {
        todos: todo,
      });
      fetchData();
      setTodo("");
      setId(0);
      alert("todo updated");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };
  const handleSaveTodo = async () => {
    if (todo === "") {
      alert("Todo is require!");
    } else {
      if (id === 0) {
        handleAddTodo();
      } else {
        handleUpdateTodo();
      }
    }
  };
  const handleDeleteTodo = async (_id) => {
    if (confirm("Delete this todo?") === true) {
      try {
        await axios.post(`http://localhost:5000/todo/delete/${_id}`);
        fetchData();
        setTodo("");
        alert("todo deleted");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  return (
    <>
      <div className="prose">
        <h1 className="font-custom">Creative Todo</h1>
      </div>
      <div className="flex mt-8 mb-4">
        <div className="flex-auto w-80 pr-3">
          <input
            type="text"
            placeholder="Type Here..."
            className="input input-bordered w-full font-custom"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
        </div>
        <div className="flex-auto w-20">
          <button
            onClick={handleSaveTodo}
            className="btn btn-accent font-custom"
          >
            Save
          </button>
        </div>
      </div>

      {/* table todo list */}
      <div className="card w-100 bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <h2 className="card-title font-custom">Todo List</h2>
          <div className="overflow-x-auto">
            <table className="table font-custom">
              {/* head */}
              <thead>
                <tr>
                  <th>#</th>
                  <th>Todo</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {todoList.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.todos}</td>
                    <td>
                      <details className="dropdown">
                        <summary className="m-1 btn">action</summary>
                        <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                          <li>
                            <a >Edit</a>
                          </li>
                          <li>
                            <a onClick={() => handleDeleteTodo(item._id)}>Delete</a>
                          </li>
                        </ul>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
