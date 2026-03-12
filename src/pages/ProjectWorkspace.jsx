import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'

const tagColors = {
  CNN: 'bg-purple-500/20 text-purple-300',
  Scaling: 'bg-blue-500/20 text-blue-300',
  Efficiency: 'bg-cyan-500/20 text-cyan-300',
  Attention: 'bg-pink-500/20 text-pink-300',
  Transformers: 'bg-pink-500/20 text-pink-300',
  NLP: 'bg-green-500/20 text-green-300',
  GNN: 'bg-orange-500/20 text-orange-300',
  Climate: 'bg-green-500/20 text-green-300',
  Prediction: 'bg-yellow-500/20 text-yellow-300',
  NAS: 'bg-teal-500/20 text-teal-300',
  AutoML: 'bg-blue-500/20 text-blue-300',
  Optimization: 'bg-red-500/20 text-red-300',
  'Foundation Model': 'bg-indigo-500/20 text-indigo-300',
  'Transfer Learning': 'bg-violet-500/20 text-violet-300',
  'Sparse Attention': 'bg-amber-500/20 text-amber-300',
}

const statusColors = {
  Active: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  Completed: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  Pending: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
}

const tabs = ['Papers', 'Experiments', 'Insights', 'Workflow']

function PapersTab({ projectId }) {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState({})
  const [summarizing, setSummarizing] = useState({})

  useEffect(() => {
    if (!projectId) return
    api.getPapers(projectId)
      .then(setPapers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [projectId])

  const handleSummarize = async (paperId, abstract) => {
    setSummarizing((s) => ({ ...s, [paperId]: true }))
    try {
      let result
      if (abstract) {
        result = await api.aiSummarize(abstract)
      } else {
        result = await api.summarizePaper(paperId)
      }
      setSummaries((s) => ({ ...s, [paperId]: result.summary || result }))
    } catch (err) {
      setSummaries((s) => ({ ...s, [paperId]: 'Summary unavailable.' }))
    } finally {
      setSummarizing((s) => ({ ...s, [paperId]: false }))
    }
  }

  if (loading) return <div className="text-gray-500 text-sm py-10 text-center">Loading papers...</div>
  if (papers.length === 0) return <div className="text-gray-500 text-sm py-10 text-center">No papers yet.</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {papers.map((paper) => (
        <div
          key={paper.id}
          className="bg-[#1A2B3C] rounded-xl p-5 border border-white/5 hover:border-[#00B4D8]/30 transition-all duration-300"
        >
          <h3 className="font-semibold text-white text-sm mb-1">{paper.title}</h3>
          <p className="text-xs text-[#00B4D8] mb-2">
            {paper.authors} {paper.year ? `· ${paper.year}` : ''}
          </p>
          <p className="text-xs text-gray-400 mb-4 line-clamp-3">{paper.abstract}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(paper.tags || []).map((tag) => (
              <span
                key={tag}
                className={`text-[10px] px-2 py-0.5 rounded-full ${tagColors[tag] || 'bg-gray-500/20 text-gray-300'}`}
              >
                {tag}
              </span>
            ))}
          </div>
          {summaries[paper.id] && (
            <div className="bg-[#0D1B2A] rounded-lg p-3 mb-3 text-xs text-gray-300 leading-relaxed">
              {summaries[paper.id]}
            </div>
          )}
          <button
            onClick={() => handleSummarize(paper.id, paper.abstract)}
            disabled={summarizing[paper.id]}
            className="text-xs bg-[#00B4D8]/10 text-[#00B4D8] hover:bg-[#00B4D8]/20 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            {summarizing[paper.id] ? '⏳ Summarizing...' : '✨ AI Summary'}
          </button>
        </div>
      ))}
    </div>
  )
}

function ExperimentsTab({ projectId }) {
  const [experiments, setExperiments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    api.getExperiments(projectId)
      .then(setExperiments)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [projectId])

  if (loading) return <div className="text-gray-500 text-sm py-10 text-center">Loading experiments...</div>
  if (experiments.length === 0) return <div className="text-gray-500 text-sm py-10 text-center">No experiments yet.</div>

  return (
    <div className="bg-[#1A2B3C] rounded-xl border border-white/5 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left px-5 py-3 text-gray-400 font-medium text-xs">Name</th>
            <th className="text-left px-5 py-3 text-gray-400 font-medium text-xs">Status</th>
            <th className="text-left px-5 py-3 text-gray-400 font-medium text-xs hidden md:table-cell">Hypothesis</th>
            <th className="text-left px-5 py-3 text-gray-400 font-medium text-xs">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {experiments.map((exp) => (
            <tr key={exp.id} className="hover:bg-white/2 transition-colors">
              <td className="px-5 py-4 text-white font-medium">{exp.name}</td>
              <td className="px-5 py-4">
                <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[exp.status] || 'bg-gray-500/20 text-gray-300'}`}>
                  {exp.status}
                </span>
              </td>
              <td className="px-5 py-4 text-gray-400 text-xs hidden md:table-cell max-w-xs truncate">
                {exp.hypothesis}
              </td>
              <td className="px-5 py-4 text-gray-500 text-xs">
                {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InsightsTab({ projectId }) {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    api.getInsights(projectId)
      .then(setInsights)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [projectId])

  if (loading) return <div className="text-gray-500 text-sm py-10 text-center">Loading insights...</div>
  if (insights.length === 0) return <div className="text-gray-500 text-sm py-10 text-center">No insights yet.</div>

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <div
          key={insight.id}
          className="bg-[#1A2B3C] rounded-xl p-5 border border-white/5 hover:border-[#00B4D8]/30 transition-all duration-300 flex items-start justify-between gap-4"
        >
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm mb-1">💡 {insight.title}</h3>
            <p className="text-xs text-gray-400 mb-3">{insight.content}</p>
            <span className="text-[10px] text-gray-500">
              {insight._count?.linkedPapers || 0} linked papers
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function WorkflowTab({ projectId }) {
  const [experiments, setExperiments] = useState([])

  useEffect(() => {
    if (!projectId) return
    api.getExperiments(projectId).then(setExperiments).catch(console.error)
  }, [projectId])

  const columns = [
    { title: 'Pending', items: experiments.filter((e) => e.status === 'Pending') },
    { title: 'Active', items: experiments.filter((e) => e.status === 'Active') },
    { title: 'Completed', items: experiments.filter((e) => e.status === 'Completed') },
    { title: 'Other', items: experiments.filter((e) => !['Pending', 'Active', 'Completed'].includes(e.status)) },
  ].filter((col) => col.items.length > 0 || col.title !== 'Other')

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((col) => (
        <div key={col.title} className="bg-[#0D1B2A] rounded-xl border border-white/5 p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00B4D8]" />
            {col.title}
            <span className="text-xs text-gray-500 ml-auto">{col.items.length}</span>
          </h4>
          <div className="space-y-3">
            {col.items.map((item) => (
              <div
                key={item.id}
                className="bg-[#1A2B3C] rounded-lg p-3 border border-white/5 hover:border-[#00B4D8]/20 transition-all duration-200"
              >
                <p className="text-xs text-white mb-1">{item.name}</p>
                {item.hypothesis && (
                  <p className="text-[10px] text-gray-500 line-clamp-2">{item.hypothesis}</p>
                )}
              </div>
            ))}
            {col.items.length === 0 && (
              <p className="text-xs text-gray-600 text-center py-4">Empty</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ProjectWorkspace() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const initialTab = tabParam ? tabs.findIndex(t => t.toLowerCase() === tabParam.toLowerCase()) : 0
  const [activeTab, setActiveTab] = useState(initialTab >= 0 ? initialTab : 0)
  const [project, setProject] = useState(null)

  useEffect(() => {
    if (id && id !== 'new') {
      api.getProject(id).then(setProject).catch(console.error)
    }
  }, [id])

  return (
    <div className="p-8">
      {/* Project Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{project?.name || 'Project Workspace'}</h1>
        <p className="text-gray-400 text-sm max-w-2xl">{project?.description || ''}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#1A2B3C] rounded-xl p-1 w-fit">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === i
                ? 'bg-[#00B4D8] text-white shadow-lg shadow-[#00B4D8]/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && <PapersTab projectId={id} />}
      {activeTab === 1 && <ExperimentsTab projectId={id} />}
      {activeTab === 2 && <InsightsTab projectId={id} />}
      {activeTab === 3 && <WorkflowTab projectId={id} />}
    </div>
  )
}
