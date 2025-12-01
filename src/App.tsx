import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
import { useState } from 'react';

// Connect to the backend
const client = generateClient<Schema>();

function App() {
  const [status, setStatus] = useState("Idle");

  // A simple function to test if the database is working
  const createProfile = async () => {
    try {
      setStatus("Creating Profile...");
      // This uses the 'UserProfile' table we defined in resource.ts
      const { errors, data: newProfile } = await client.models.UserProfile.create({
        displayName: "New Player",
        email: "player@example.com",
        dataConsent: true,
        lastLogin: new Date().toISOString()
      });

      if (errors) throw errors;
      setStatus(`Success! Created profile ID: ${newProfile.id}`);
    } catch (e) {
      console.error(e);
      setStatus("Error creating profile (check console)");
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Gesture Type MVP</h1>
          <p>Welcome, {user?.signInDetails?.loginId}</p>
          
          <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc' }}>
            <h3>Database Connection Test</h3>
            <p>Status: <strong>{status}</strong></p>
            <button onClick={createProfile}>
              Initialize My User Profile
            </button>
          </div>

          <button onClick={signOut} style={{ marginTop: '20px' }}>
            Sign out
          </button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
