import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProjectWorkspace from './pages/ProjectWorkspace'
import InsightGraph from './pages/InsightGraph'
import AIAssistant from './pages/AIAssistant'
import SimilarityChecker from './pages/SimilarityChecker'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
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
