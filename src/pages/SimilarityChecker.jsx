import { useState } from 'react'
import { sampleDocA, sampleDocB } from '../data/mockData'

const matchingPhrases = [
  'evolutionary strategies combined with weight sharing',
  'efficiently explore the architecture search space',
  'reduces the computational cost',
  'compared to traditional NAS methods',
  'maintaining competitive accuracy on standard benchmarks',
  'architectures with similar topological properties tend to share performance characteristics',
  'targeted modifications to promising architectures rather than random perturbations',
  'CIFAR-10, CIFAR-100, and ImageNet',
  'significant improvement over prior evolutionary NAS methods',
]

const breakdownCategories = [
  { label: 'Abstract Structure', pct: 92, color: 'bg-red-400' },
  { label: 'Methodology Description', pct: 88, color: 'bg-red-400' },
  { label: 'Key Claims', pct: 78, color: 'bg-yellow-400' },
  { label: 'Experimental Setup', pct: 85, color: 'bg-red-400' },
  { label: 'Results Reporting', pct: 71, color: 'bg-yellow-400' },
  { label: 'Vocabulary Overlap', pct: 65, color: 'bg-yellow-400' },
]

function highlightText(text, phrases) {
  let result = text
  phrases.forEach((phrase) => {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    result = result.replace(regex, '|||$1|||')
  })

  const parts = result.split('|||')
  return parts.map((part, i) => {
    const isHighlight = phrases.some((p) => part.toLowerCase().includes(p.toLowerCase()) && part.length < p.length + 10)
    if (isHighlight) {
      return (
        <mark key={i} className="bg-yellow-500/30 text-yellow-200 rounded px-0.5">
          {part}
        </mark>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export default function SimilarityChecker() {
  const [docA, setDocA] = useState(sampleDocA)
  const [docB, setDocB] = useState(sampleDocB)
  const [analyzed, setAnalyzed] = useState(false)
  const similarity = 82

  const getSimilarityColor = (pct) => {
    if (pct >= 75) return 'text-red-400'
    if (pct >= 50) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Similarity Checker</h1>
        <p className="text-gray-400 text-sm">Compare documents to detect overlapping content and paraphrased passages.</p>
      </div>

      {/* Document Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Document A</label>
          <textarea
            value={docA}
            onChange={(e) => { setDocA(e.target.value); setAnalyzed(false) }}
            className="w-full h-64 bg-[#1A2B3C] text-gray-300 text-sm rounded-xl p-5 border border-white/5 focus:border-[#00B4D8]/50 focus:outline-none resize-none transition-colors"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Document B</label>
          <textarea
            value={docB}
            onChange={(e) => { setDocB(e.target.value); setAnalyzed(false) }}
            className="w-full h-64 bg-[#1A2B3C] text-gray-300 text-sm rounded-xl p-5 border border-white/5 focus:border-[#00B4D8]/50 focus:outline-none resize-none transition-colors"
          />
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setAnalyzed(true)}
          className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-white px-8 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          🔍 Analyze Similarity
        </button>
      </div>

      {/* Results */}
      {analyzed && (
        <div className="space-y-8">
          {/* Similarity Score */}
          <div className="flex justify-center">
            <div className="bg-[#1A2B3C] rounded-2xl p-8 border border-white/5 text-center">
              <p className="text-sm text-gray-400 mb-2">Overall Similarity</p>
              <p className={`text-7xl font-bold ${getSimilarityColor(similarity)}`}>
                {similarity}%
              </p>
              <p className="text-sm text-red-400 mt-2">High similarity detected</p>
            </div>
          </div>

          {/* Highlighted Documents */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Matching Passages Highlighted</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#1A2B3C] rounded-xl p-5 border border-white/5">
                <p className="text-xs text-gray-500 mb-3 font-medium">Document A</p>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {highlightText(docA, matchingPhrases)}
                </p>
              </div>
              <div className="bg-[#1A2B3C] rounded-xl p-5 border border-white/5">
                <p className="text-xs text-gray-500 mb-3 font-medium">Document B</p>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {highlightText(docB, matchingPhrases)}
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown Chart */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Similarity Breakdown</h3>
            <div className="bg-[#1A2B3C] rounded-xl p-6 border border-white/5 space-y-4">
              {breakdownCategories.map((cat) => (
                <div key={cat.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-400">{cat.label}</span>
                    <span className="text-gray-300 font-medium">{cat.pct}%</span>
                  </div>
                  <div className="h-2.5 bg-[#0D1B2A] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
