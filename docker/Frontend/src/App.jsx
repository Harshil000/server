import axios from 'axios'
import { useEffect , useState } from 'react'

const App = () => {

  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const {data} = await axios.get('/api/user')
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div>
      {users.map((user) => {
        return <div style={{border: "1px solid black", margin: "10px" , padding: "10px"}} key={user.id}>
          <h1 className="text-3xl font-bold underline">{user.name}</h1>
          <p>{user.email}</p>
        </div>
      })}
    </div>
  )
}

export default App