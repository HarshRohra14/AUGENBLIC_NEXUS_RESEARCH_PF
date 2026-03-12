import { useState, useEffect, useRef } from 'react'
import { api } from '../lib/api'

const quickActions = ['Summarize Papers', 'Find Gaps', 'Suggest Connections']

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I\'m Nexus AI. Ask me anything about your research — I can summarize papers, find gaps, suggest connections, or answer questions.' }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    api.getProjects().then((data) => {
      setProjects(data)
      if (data.length > 0) setSelectedProject(data[0])
    }).catch(console.error)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (role, text) => setMessages((prev) => [...prev, { role, text }])

  const handleSend = async () => {
    const msg = input.trim()
    if (!msg || sending) return
    setInput('')
    addMessage('user', msg)
    setSending(true)
    try {
      const context = selectedProject
        ? `Project: ${selectedProject.title || selectedProject.name}. ${selectedProject.description || ''}`
        : ''
      const result = await api.aiChat(msg, context)
      addMessage('assistant', result.response || result.message || 'No response.')
    } catch (err) {
      addMessage('assistant', `Error: ${err.message}`)
    } finally {
      setSending(false)
    }
  }

  const handleQuickAction = async (action) => {
    addMessage('user', action)
    setSending(true)
    try {
      let result
      const context = selectedProject
        ? `Project: ${selectedProject.title || selectedProject.name}. ${selectedProject.description || ''}`
        : ''
      if (action === 'Find Gaps') {
        result = await api.aiGaps(context)
        addMessage('assistant', result.gaps || result.response || JSON.stringify(result))
      } else if (action === 'Suggest Connections') {
        result = await api.aiConnections(context)
        addMessage('assistant', result.connections || result.response || JSON.stringify(result))
      } else {
        result = await api.aiChat(action, context)
        addMessage('assistant', result.response || result.message || 'No response.')
      }
    } catch (err) {
      addMessage('assistant', `Error: ${err.message}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#A855F7] to-[#7C3AED] flex items-center justify-center text-sm">
            🤖
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-white">Nexus AI Assistant</h1>
            <p className={`text-xs ${sending ? 'text-yellow-400' : 'text-green-400'}`}>
              {sending ? 'Thinking...' : 'Online · Ready'}
            </p>
          </div>
          {projects.length > 1 && (
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => setSelectedProject(projects.find((p) => p.id === e.target.value) || null)}
              className="bg-[#0A000F] text-white text-xs rounded-lg px-3 py-1.5 border border-white/5 focus:outline-none"
            >
              {projects.map((p) => <option key={p.id} value={p.id}>{p.title || p.name}</option>)}
            </select>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#7C3AED] text-white rounded-br-md'
                    : 'bg-[#150825] text-gray-300 rounded-bl-md border border-white/5'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-[#150825] border border-white/5 rounded-2xl rounded-bl-md px-5 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#A855F7] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#A855F7] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#A855F7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-2 flex gap-2">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              disabled={sending}
              className="text-xs bg-[#150825] text-[#A855F7] hover:bg-[#A855F7]/10 disabled:opacity-50 px-3 py-1.5 rounded-lg border border-[#A855F7]/20 transition-colors"
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
              disabled={sending}
              placeholder="Ask Nexus AI about your research..."
              className="flex-1 bg-[#150825] text-white text-sm rounded-xl px-5 py-3 border border-white/5 focus:border-[#A855F7]/50 focus:outline-none transition-colors placeholder:text-gray-500 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="bg-[#A855F7] hover:bg-[#A855F7]/80 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      <div className="w-80 bg-[#150825] border-l border-white/5 p-6 overflow-y-auto shrink-0">
        <h2 className="text-sm font-semibold text-white mb-4">Active Project Context</h2>

        {selectedProject ? (
          <div className="bg-[#0A000F] rounded-xl p-4 border border-white/5 mb-6">
            <h3 className="text-sm font-medium text-[#A855F7] mb-1">{selectedProject.title || selectedProject.name}</h3>
            <p className="text-xs text-gray-400 line-clamp-3">{selectedProject.description}</p>
          </div>
        ) : (
          <div className="bg-[#0A000F] rounded-xl p-4 border border-white/5 mb-6">
            <p className="text-xs text-gray-500">No project selected</p>
          </div>
        )}

        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
          Tips
        </h3>
        <div className="space-y-2">
          {[
            'Ask about research gaps in your field',
            'Request connections between your papers',
            'Summarize your most recent findings',
            'Get methodology suggestions',
          ].map((tip) => (
            <div
              key={tip}
              className="bg-[#0A000F] rounded-lg px-3 py-2 text-xs text-gray-400 border border-white/5"
            >
              💡 {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
