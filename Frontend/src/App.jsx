import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Team from './pages/Team'
import Layout from './components/Layout'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(state => state.auth)
  return isAuthenticated ? children : <Navigate to="/auth" replace />
}

function App() {
  const { isAuthenticated } = useSelector(state => state.auth)

  return (
    <Routes>
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="team" element={<Team />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
