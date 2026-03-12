import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProjectWorkspace from './pages/ProjectWorkspace'
import InsightGraph from './pages/InsightGraph'
import AIAssistant from './pages/AIAssistant'
import SimilarityChecker from './pages/SimilarityChecker'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:id" element={<ProjectWorkspace />} />
        <Route path="/graph" element={<InsightGraph />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/similarity" element={<SimilarityChecker />} />
      </Route>
    </Routes>
  )
}
