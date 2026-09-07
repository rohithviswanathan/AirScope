import { AppShell } from "./components/layout/AppShell";
import { Dashboard } from "./features/dashboard/Dashboard";

function App() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}

export default App;