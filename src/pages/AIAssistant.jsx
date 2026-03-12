import { useState } from 'react'
import { chatMessages as initialMessages } from '../data/mockData'

const quickActions = ['Summarize Papers', 'Find Gaps', 'Suggest Connections']

export default function AIAssistant() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: input },
      {
        role: 'assistant',
        text: "I'm analyzing your request against the current project context. Based on the 127 papers and 34 insights in your workspace, I'll provide a detailed response shortly. In the meantime, I've identified 3 potentially relevant connections in your Knowledge Graph.",
      },
    ])
    setInput('')
  }

  const handleQuickAction = (action) => {
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: action },
      {
        role: 'assistant',
        text:
          action === 'Summarize Papers'
            ? 'Here\'s a summary of the 6 most recent papers in your active project:\n\n1. **EfficientNet** — Introduces compound scaling for CNNs, achieving SOTA accuracy with fewer parameters.\n2. **Attention Is All You Need** — Foundational transformer architecture paper, replacing recurrence with self-attention.\n3. **GNN Climate Prediction** — Applies graph neural networks to weather forecasting, outperforming numerical models.\n4. **DARTS** — Differentiable NAS approach that reduces search cost through continuous relaxation.\n5. **ClimaX** — Foundation model for weather/climate with strong transfer learning capabilities.\n6. **Sparse Transformers** — Reduces attention complexity from O(n²) to O(n√n) using sparse factorizations.'
            : action === 'Find Gaps'
            ? 'I\'ve identified 4 research gaps across your projects:\n\n1. **Missing temporal modeling** in GNN-based climate prediction — consider Temporal Graph Networks.\n2. **No efficiency benchmarks** for NAS-discovered architectures on edge devices.\n3. **Lack of cross-modal evaluation** — transformer efficiency findings haven\'t been tested on vision tasks.\n4. **Transfer learning baselines** are incomplete — ClimaX needs comparison with non-foundation approaches.'
            : 'Cross-project connections discovered:\n\n🔗 **NAS ↔ Climate**: Use architecture search to optimize GNN topology for weather data.\n🔗 **Efficiency ↔ Foundation Models**: Sparse attention could enable real-time ClimaX inference.\n🔗 **GNN ↔ NAS**: Graph-based search spaces could encode architecture topology naturally.\n\nThese have been added to your Knowledge Graph for visualization.',
      },
    ])
  }

  return (
    <div className="flex h-screen">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00B4D8] to-[#1A6FBF] flex items-center justify-center text-sm">
            🤖
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">Nexus AI Assistant</h1>
            <p className="text-xs text-green-400">Online · Analyzing 127 papers</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#1A6FBF] text-white rounded-br-md'
                    : 'bg-[#1A2B3C] text-gray-300 rounded-bl-md border border-white/5'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-2 flex gap-2">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              className="text-xs bg-[#1A2B3C] text-[#00B4D8] hover:bg-[#00B4D8]/10 px-3 py-1.5 rounded-lg border border-[#00B4D8]/20 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/5">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Nexus AI about your research..."
              className="flex-1 bg-[#1A2B3C] text-white text-sm rounded-xl px-5 py-3 border border-white/5 focus:border-[#00B4D8]/50 focus:outline-none transition-colors placeholder:text-gray-500"
            />
            <button
              onClick={handleSend}
              className="bg-[#00B4D8] hover:bg-[#00B4D8]/80 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <div className="w-80 bg-[#1A2B3C] border-l border-white/5 p-6 overflow-y-auto shrink-0">
        <h2 className="text-sm font-semibold text-white mb-4">Active Project Context</h2>

        <div className="bg-[#0D1B2A] rounded-xl p-4 border border-white/5 mb-6">
          <h3 className="text-sm font-medium text-[#00B4D8] mb-3">Neural Architecture Search</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Papers</span>
              <span className="text-white">42</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Experiments</span>
              <span className="text-white">8</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Insights</span>
              <span className="text-white">12</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Connections</span>
              <span className="text-white">23</span>
            </div>
          </div>
        </div>

        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
          Related Projects
        </h3>
        <div className="space-y-2 mb-6">
          {['Climate Modeling with GNNs', 'Transformer Efficiency Study'].map((p) => (
            <div
              key={p}
              className="bg-[#0D1B2A] rounded-lg px-3 py-2 text-xs text-gray-300 border border-white/5"
            >
              📁 {p}
            </div>
          ))}
        </div>

        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
          Recent Insights
        </h3>
        <div className="space-y-2">
          {['Architecture Scaling Laws', 'Attention Sparsity Threshold', 'GNN Expressiveness Gap'].map(
            (ins) => (
              <div
                key={ins}
                className="bg-[#0D1B2A] rounded-lg px-3 py-2 text-xs text-gray-300 border border-white/5"
              >
                💡 {ins}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
