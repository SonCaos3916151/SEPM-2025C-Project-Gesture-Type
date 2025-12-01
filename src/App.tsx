import { useAuthenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import "./App.css"; 

function App() {
  // 1. Hook must be called INSIDE the function component
  const { signOut, user } = useAuthenticator();

  return (
    <main>
      <h1>This page is for arcade mode</h1>
      
      {/* Optional: It's good to show the user they are logged in */}
      <p>Logged in as: {user?.signInDetails?.loginId}</p>

      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

// 2. Wrap the component with the Authenticator HOC
// This ensures the user must log in before seeing the "Arcade Mode" page
export default withAuthenticator(App);
