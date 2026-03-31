import { useState,useEffect } from 'react'
import axios from "axios"

function App() {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/users")
      .then(res => setUsers(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!username) return;

    const res = await axios.post("http://localhost:5000/users", {
      username
    });

    setUsers(res.data);
    setUsername("");
  };


  return (
    <div style={{ padding: "20px" }}>
      <h2>Enter Username</h2>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>

      <h3>All Users:</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.username}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
