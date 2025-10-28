import { useState, useEffect } from 'react'
import { Target, Shield, Bug, DollarSign, Plus, Trash2, Edit, AlertCircle } from 'lucide-react'

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [programs, setPrograms] = useState([])
  const [targets, setTargets] = useState([])
  const [vulnerabilities, setVulnerabilities] = useState([])
  const [stats, setStats] = useState({ total_programs: 0, total_targets: 0, total_vulnerabilities: 0, total_bounties: 0 })
  const [showProgramForm, setShowProgramForm] = useState(false)
  const [showTargetForm, setShowTargetForm] = useState(false)
  const [showVulnForm, setShowVulnForm] = useState(false)

  // Fetch data
  useEffect(() => {
    fetchStats()
    fetchPrograms()
    fetchTargets()
    fetchVulnerabilities()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/programs`)
      const data = await response.json()
      setPrograms(data)
    } catch (error) {
      console.error('Error fetching programs:', error)
    }
  }

  const fetchTargets = async () => {
    try {
      const response = await fetch(`${API_URL}/api/targets`)
      const data = await response.json()
      setTargets(data)
    } catch (error) {
      console.error('Error fetching targets:', error)
    }
  }

  const fetchVulnerabilities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vulnerabilities`)
      const data = await response.json()
      setVulnerabilities(data)
    } catch (error) {
      console.error('Error fetching vulnerabilities:', error)
    }
  }

  const deleteProgram = async (id) => {
    try {
      await fetch(`${API_URL}/api/programs/${id}`, { method: 'DELETE' })
      fetchPrograms()
      fetchStats()
    } catch (error) {
      console.error('Error deleting program:', error)
    }
  }

  const deleteTarget = async (id) => {
    try {
      await fetch(`${API_URL}/api/targets/${id}`, { method: 'DELETE' })
      fetchTargets()
      fetchStats()
    } catch (error) {
      console.error('Error deleting target:', error)
    }
  }

  const deleteVulnerability = async (id) => {
    try {
      await fetch(`${API_URL}/api/vulnerabilities/${id}`, { method: 'DELETE' })
      fetchVulnerabilities()
      fetchStats()
    } catch (error) {
      console.error('Error deleting vulnerability:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Bug Bounty Recon Dashboard</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === 'dashboard'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-purple-600/20'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('programs')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === 'programs'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-purple-600/20'
                }`}
              >
                Programs
              </button>
              <button
                onClick={() => setActiveTab('targets')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === 'targets'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-purple-600/20'
                }`}
              >
                Targets
              </button>
              <button
                onClick={() => setActiveTab('vulnerabilities')}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === 'vulnerabilities'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-purple-600/20'
                }`}
              >
                Vulnerabilities
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} />
        )}
        {activeTab === 'programs' && (
          <Programs
            programs={programs}
            onDelete={deleteProgram}
            onRefresh={fetchPrograms}
            showForm={showProgramForm}
            setShowForm={setShowProgramForm}
          />
        )}
        {activeTab === 'targets' && (
          <Targets
            targets={targets}
            programs={programs}
            onDelete={deleteTarget}
            onRefresh={fetchTargets}
            showForm={showTargetForm}
            setShowForm={setShowTargetForm}
          />
        )}
        {activeTab === 'vulnerabilities' && (
          <Vulnerabilities
            vulnerabilities={vulnerabilities}
            targets={targets}
            onDelete={deleteVulnerability}
            onRefresh={fetchVulnerabilities}
            showForm={showVulnForm}
            setShowForm={setShowVulnForm}
          />
        )}
      </main>
    </div>
  )
}

function Dashboard({ stats }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Shield className="w-8 h-8" />}
          title="Programs"
          value={stats.total_programs}
          color="blue"
        />
        <StatCard
          icon={<Target className="w-8 h-8" />}
          title="Targets"
          value={stats.total_targets}
          color="green"
        />
        <StatCard
          icon={<Bug className="w-8 h-8" />}
          title="Vulnerabilities"
          value={stats.total_vulnerabilities}
          color="red"
        />
        <StatCard
          icon={<DollarSign className="w-8 h-8" />}
          title="Total Bounties"
          value={`$${stats.total_bounties.toFixed(2)}`}
          color="yellow"
        />
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-md border rounded-xl p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="text-white opacity-80">{icon}</div>
      </div>
    </div>
  )
}

function Programs({ programs, onDelete, onRefresh, showForm, setShowForm }) {
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    scope: '',
    max_bounty: '',
    status: 'active'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API_URL}/api/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          max_bounty: formData.max_bounty ? parseFloat(formData.max_bounty) : null
        })
      })
      setFormData({ name: '', platform: '', scope: '', max_bounty: '', status: 'active' })
      setShowForm(false)
      onRefresh()
    } catch (error) {
      console.error('Error creating program:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Bug Bounty Programs</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Program</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Program Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400"
              required
            />
            <input
              type="text"
              placeholder="Platform (e.g., HackerOne, Bugcrowd)"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400"
              required
            />
            <input
              type="text"
              placeholder="Scope"
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400"
            />
            <input
              type="number"
              placeholder="Max Bounty ($)"
              value={formData.max_bounty}
              onChange={(e) => setFormData({ ...formData, max_bounty: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              Create Program
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{program.name}</h3>
              <button
                onClick={() => onDelete(program.id)}
                className="text-red-400 hover:text-red-300 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-gray-300">
              <p><span className="text-purple-400">Platform:</span> {program.platform}</p>
              {program.scope && <p><span className="text-purple-400">Scope:</span> {program.scope}</p>}
              {program.max_bounty && (
                <p><span className="text-purple-400">Max Bounty:</span> ${program.max_bounty}</p>
              )}
              <p><span className="text-purple-400">Status:</span> {program.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Targets({ targets, programs, onDelete, onRefresh, showForm, setShowForm }) {
  const [formData, setFormData] = useState({
    program_id: '',
    domain: '',
    ip_address: '',
    tech_stack: '',
    notes: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API_URL}/api/targets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          program_id: parseInt(formData.program_id)
        })
      })
      setFormData({ program_id: '', domain: '', ip_address: '', tech_stack: '', notes: '' })
      setShowForm(false)
      onRefresh()
    } catch (error) {
      console.error('Error creating target:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Recon Targets</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Target</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.program_id}
              onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
              required
            >
              <option value="">Select Program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>{program.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Domain (e.g., example.com)"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400"
              required
            />
            <input
              type="text"
              placeholder="IP Address"
              value={formData.ip_address}
              onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Tech Stack"
              value={formData.tech_stack}
              onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400"
            />
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 md:col-span-2"
              rows="3"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              Create Target
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targets.map((target) => {
          const program = programs.find(p => p.id === target.program_id)
          return (
            <div key={target.id} className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{target.domain}</h3>
                <button
                  onClick={() => onDelete(target.id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2 text-gray-300">
                {program && <p><span className="text-purple-400">Program:</span> {program.name}</p>}
                {target.ip_address && <p><span className="text-purple-400">IP:</span> {target.ip_address}</p>}
                {target.tech_stack && <p><span className="text-purple-400">Tech:</span> {target.tech_stack}</p>}
                {target.notes && <p><span className="text-purple-400">Notes:</span> {target.notes}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Vulnerabilities({ vulnerabilities, targets, onDelete, onRefresh, showForm, setShowForm }) {
  const [formData, setFormData] = useState({
    target_id: '',
    title: '',
    severity: 'medium',
    vulnerability_type: '',
    description: '',
    status: 'draft',
    bounty_amount: '',
    reported_at: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API_URL}/api/vulnerabilities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          target_id: parseInt(formData.target_id),
          bounty_amount: formData.bounty_amount ? parseFloat(formData.bounty_amount) : null
        })
      })
      setFormData({
        target_id: '',
        title: '',
        severity: 'medium',
        vulnerability_type: '',
        description: '',
        status: 'draft',
        bounty_amount: '',
        reported_at: ''
      })
      setShowForm(false)
      onRefresh()
    } catch (error) {
      console.error('Error creating vulnerability:', error)
    }
  }

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-500',
      high: 'text-orange-500',
      medium: 'text-yellow-500',
      low: 'text-blue-500',
      info: 'text-gray-500'
    }
    return colors[severity] || colors.medium
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Vulnerabilities</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Vulnerability</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.target_id}
              onChange={(e) => setFormData({ ...formData, target_id: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
              required
            >
              <option value="">Select Target</option>
              {targets.map((target) => (
                <option key={target.id} value={target.id}>{target.domain}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Vulnerability Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400"
              required
            />
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
              required
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>
            <input
              type="text"
              placeholder="Type (e.g., XSS, SQLi, IDOR)"
              value={formData.vulnerability_type}
              onChange={(e) => setFormData({ ...formData, vulnerability_type: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400"
              required
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
            >
              <option value="draft">Draft</option>
              <option value="reported">Reported</option>
              <option value="triaged">Triaged</option>
              <option value="resolved">Resolved</option>
              <option value="duplicate">Duplicate</option>
            </select>
            <input
              type="number"
              placeholder="Bounty Amount ($)"
              value={formData.bounty_amount}
              onChange={(e) => setFormData({ ...formData, bounty_amount: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-800/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 md:col-span-2"
              rows="4"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              Create Vulnerability
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {vulnerabilities.map((vuln) => {
          const target = targets.find(t => t.id === vuln.target_id)
          return (
            <div key={vuln.id} className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertCircle className={`w-6 h-6 ${getSeverityColor(vuln.severity)}`} />
                    <h3 className="text-xl font-bold text-white">{vuln.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(vuln.severity)}`}>
                      {vuln.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                    {target && <p><span className="text-purple-400">Target:</span> {target.domain}</p>}
                    <p><span className="text-purple-400">Type:</span> {vuln.vulnerability_type}</p>
                    <p><span className="text-purple-400">Status:</span> {vuln.status}</p>
                    {vuln.bounty_amount && (
                      <p><span className="text-purple-400">Bounty:</span> ${vuln.bounty_amount}</p>
                    )}
                    {vuln.description && (
                      <p className="md:col-span-2"><span className="text-purple-400">Description:</span> {vuln.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDelete(vuln.id)}
                  className="text-red-400 hover:text-red-300 transition ml-4"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
