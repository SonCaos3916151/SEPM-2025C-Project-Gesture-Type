// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
import "./App.css"; // Ensure you keep your styles if needed
import { useAuthenticator } from '@aws-amplify/ui-react';

const { signOut } = useAuthenticator();

function App() {
  return (
    <main>
      <h1>This page is for arcade mode</h1>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;

