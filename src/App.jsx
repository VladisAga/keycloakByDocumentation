import './App.css';
import { useAuth } from "./hooks/useAuth.jsx";
import { useEffect, useState } from "react";
import AdminComponent from "./components/AdminComponent.jsx";
import UserComponent from "./components/UserComponent.jsx";

function App() {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const { initialized, authenticated, keycloak } = useAuth();

  useEffect(() => {
    if (!authenticated) return;

    const updateTimer = async () => {
      try {
        const refreshed = await keycloak.updateToken(5);
        console.log(refreshed ? 'Token was refreshed' : 'Token is still valid');

        const currentToken = keycloak.tokenParsed;
        if (!currentToken?.exp) return;

        const now = Date.now() / 1000;
        const left = Math.max(0, Math.floor(currentToken.exp - now));
        setSecondsLeft(left);
      } catch (error) {
        console.error('Failed to refresh the token:', error);
        await keycloak.login();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [authenticated, keycloak]);

  const testApi = async () => {
    try {
      const response = await fetch('http://localhost:3000/complain', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  return (
      <>
        <p onClick={() => keycloak.logout()}>logOut</p>
        <button onClick={testApi}>Click</button>
        <p>Seconds left: {secondsLeft}</p>
        <button onClick={() => console.log(keycloak.hasResourceRole('admin'))}>Role</button>
        {keycloak.hasResourceRole('admin') ? <AdminComponent /> : <UserComponent />}
      </>
  );
}

export default App;