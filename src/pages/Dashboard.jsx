import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const tagColors = {
  'Deep Learning': 'bg-purple-500/20 text-purple-300',
  'AutoML': 'bg-blue-500/20 text-blue-300',
  'NAS': 'bg-teal-500/20 text-teal-300',
  'Climate Science': 'bg-green-500/20 text-green-300',
  'GNN': 'bg-orange-500/20 text-orange-300',
  'Forecasting': 'bg-yellow-500/20 text-yellow-300',
  'Transformers': 'bg-pink-500/20 text-pink-300',
  'Efficiency': 'bg-cyan-500/20 text-cyan-300',
  'Edge AI': 'bg-red-500/20 text-red-300',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState({ projects: 0, papers: 0, insights: 0, experiments: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProjects()
      .then((data) => {
        setProjects(data)
        setStats((s) => ({ ...s, projects: data.length }))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const displayStats = [
    { label: 'Projects', value: stats.projects, icon: '📁' },
    { label: 'Papers', value: stats.papers, icon: '📄' },
    { label: 'Insights', value: stats.insights, icon: '💡' },
    { label: 'Experiments', value: stats.experiments, icon: '🔬' },
  ]

  const firstName = user?.name ? user.name.split(' ')[0] : 'Researcher'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, {firstName}</p>
        </div>
        <Link
          to="/project/new"
          className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          + New Project
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {displayStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1A2B3C] rounded-xl p-5 border border-white/5 hover:border-[#00B4D8]/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Projects Grid */}
        <div className="xl:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Projects</h2>
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-500 text-sm">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="bg-[#1A2B3C] rounded-xl p-10 border border-white/5 text-center">
              <p className="text-gray-400 text-sm mb-4">No projects yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  className="bg-[#1A2B3C] rounded-xl p-5 border border-white/5 hover:border-[#00B4D8]/30 hover:shadow-lg hover:shadow-[#00B4D8]/5 transition-all duration-300 group"
                >
                  <h3 className="font-semibold text-white group-hover:text-[#00B4D8] transition-colors text-sm mb-2">
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(project.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] px-2 py-0.5 rounded-full ${tagColors[tag] || 'bg-gray-500/20 text-gray-300'}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-[10px] text-gray-500">
                    {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Recently updated'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="bg-[#1A2B3C] rounded-xl border border-white/5 divide-y divide-white/5">
            {[
              { label: '🤖 Open AI Assistant', to: '/assistant' },
              { label: '🔍 Similarity Check', to: '/similarity' },
              { label: '🕸️ View Knowledge Graph', to: '/graph' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block px-5 py-4 hover:bg-white/2 transition-colors text-sm text-gray-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
