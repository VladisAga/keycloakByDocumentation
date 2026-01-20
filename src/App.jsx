import './App.css'
import {useAuth} from "./hooks/useAuth.jsx";


function App() {
  const {initialized, authenticated, keycloak} = useAuth();

  console.log({initialized, authenticated, keycloak});

  const testApi = async () => {
    const response = await fetch('http://localhost:3000/complain', {
      headers: {
        Authorization: `Bearer ${keycloak.token}`
      }
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <>
        <p onClick={() => keycloak.logout()}>logOut</p>
        <button onClick={testApi}>Click</button>
    </>
  )
}

export default App
