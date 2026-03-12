import { Link } from 'react-router-dom'
import { projects, activities } from '../data/mockData'

const stats = [
  { label: 'Projects', value: '4', icon: '📁' },
  { label: 'Papers', value: '127', icon: '📄' },
  { label: 'Insights', value: '34', icon: '💡' },
  { label: 'Experiments', value: '3', icon: '🔬' },
]

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
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, Dr. Chen</p>
        </div>
        <button className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
          + New Project
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
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

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-[#00B4D8]">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-[#0D1B2A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00B4D8] to-[#1A6FBF] rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[10px] px-2 py-0.5 rounded-full ${tagColors[tag] || 'bg-gray-500/20 text-gray-300'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-[10px] text-gray-500">Updated {project.lastUpdated}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="bg-[#1A2B3C] rounded-xl border border-white/5 divide-y divide-white/5">
            {activities.map((activity, i) => (
              <div key={i} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <p className="text-sm text-gray-300">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
