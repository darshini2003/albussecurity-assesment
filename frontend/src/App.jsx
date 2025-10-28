import { useState, useEffect } from 'react'
import { Target, Shield, Bug, DollarSign, Plus, Trash2, Edit, AlertCircle, Search, Filter, Download, TrendingUp, Award, Clock, CheckCircle } from 'lucide-react'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('all')

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
    <div className="min-h-screen animated-gradient relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      {/* Header */}
      <header className="relative bg-black/60 backdrop-blur-xl border-b border-purple-500/20 shadow-lg shadow-purple-500/5 z-10">
        <div className="absolute inset-0 shimmer opacity-10"></div>
        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="w-8 h-8 text-purple-400 animate-pulse" />
                <div className="absolute inset-0 w-8 h-8 bg-purple-500/20 rounded-full blur-xl"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Bug Bounty Recon Dashboard</h1>
                <p className="text-xs text-gray-400">Security Research Management Platform</p>
              </div>
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
      <main className="container mx-auto px-4 py-8 relative z-10">
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
    <div className="space-y-8">
      <div className="flex items-center justify-between slide-in-up">
        <div>
          <h2 className="text-5xl font-bold gradient-text mb-2 neon-text">Dashboard Overview</h2>
          <p className="text-gray-300 text-lg">Track your bug bounty hunting progress in real-time</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/70 pulse-glow hover:scale-105">
          <Download className="w-5 h-5" />
          <span className="font-semibold">Export Report</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Shield className="w-8 h-8" />}
          title="Active Programs"
          value={stats.total_programs}
          color="blue"
          trend="+12%"
        />
        <StatCard
          icon={<Target className="w-8 h-8" />}
          title="Recon Targets"
          value={stats.total_targets}
          color="green"
          trend="+8%"
        />
        <StatCard
          icon={<Bug className="w-8 h-8" />}
          title="Vulnerabilities"
          value={stats.total_vulnerabilities}
          color="red"
          trend="+24%"
        />
        <StatCard
          icon={<DollarSign className="w-8 h-8" />}
          title="Total Earnings"
          value={`$${stats.total_bounties.toFixed(2)}`}
          color="yellow"
          trend="+15%"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 slide-in-up" style={{animationDelay: '0.2s'}}>
        <div className="group relative bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-md border-2 border-green-500/30 rounded-2xl p-6 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent shimmer opacity-0 group-hover:opacity-100"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl border-2 border-green-500/40 group-hover:rotate-12 transition-transform duration-500">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Success Rate</h3>
            </div>
            <p className="text-4xl font-black text-green-400 mb-2">87.5%</p>
            <p className="text-sm text-gray-300 font-medium">Accepted vulnerabilities</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-blue-500/10 to-cyan-600/10 backdrop-blur-md border-2 border-blue-500/30 rounded-2xl p-6 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent shimmer opacity-0 group-hover:opacity-100"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl border-2 border-blue-500/40 group-hover:rotate-12 transition-transform duration-500">
                <Award className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Avg Bounty</h3>
            </div>
            <p className="text-4xl font-black text-blue-400 mb-2">${stats.total_vulnerabilities > 0 ? (stats.total_bounties / stats.total_vulnerabilities).toFixed(2) : '0.00'}</p>
            <p className="text-sm text-gray-300 font-medium">Per vulnerability</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-md border-2 border-purple-500/30 rounded-2xl p-6 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent shimmer opacity-0 group-hover:opacity-100"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl border-2 border-purple-500/40 group-hover:rotate-12 transition-transform duration-500">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">This Month</h3>
            </div>
            <p className="text-4xl font-black text-purple-400 mb-2">+{stats.total_vulnerabilities}</p>
            <p className="text-sm text-gray-300 font-medium">New findings</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color, trend }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/40 text-blue-400 shadow-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/40 text-green-400 shadow-green-500/30',
    red: 'from-red-500/20 to-red-600/20 border-red-500/40 text-red-400 shadow-red-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/40 text-yellow-400 shadow-yellow-500/30',
  }

  return (
    <div className={`group relative bg-gradient-to-br ${colorClasses[color]} backdrop-blur-md border-2 rounded-2xl p-6 hover:scale-110 hover:-translate-y-2 transition-all duration-500 shadow-2xl scale-in overflow-hidden`}>
      {/* Shimmer overlay */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating orb */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${colorClasses[color].split(' ')[0]} rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity float`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-4 rounded-xl bg-gradient-to-br from-black/40 to-black/20 ${colorClasses[color].split(' ')[2]} border-2 group-hover:rotate-12 transition-transform duration-500`}>
            {icon}
          </div>
          {trend && (
            <div className="flex items-center space-x-1 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-bold">{trend}</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-gray-300 text-sm font-semibold mb-2 uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-black text-white drop-shadow-lg">{value}</p>
        </div>
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
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPrograms = programs.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.platform.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Bug Bounty Programs</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your active bug bounty programs</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/30 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-purple-500/30"
          >
            <Plus className="w-5 h-5" />
            <span>Add</span>
          </button>
        </div>
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
        {filteredPrograms.map((program, index) => (
          <div key={program.id} className="group relative bg-gradient-to-br from-black/60 to-purple-900/30 backdrop-blur-xl border-2 border-purple-500/40 rounded-2xl p-6 hover:border-purple-400/70 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-500 overflow-hidden scale-in" style={{animationDelay: `${index * 0.1}s`}}>
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 shimmer opacity-0 group-hover:opacity-100"></div>
            
            {/* Glow orb */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg border-2 border-purple-500/40 group-hover:rotate-12 transition-transform duration-500">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">{program.name}</h3>
                </div>
                <button
                  onClick={() => onDelete(program.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg hover:scale-110 transition-all duration-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-center text-sm"><span className="text-purple-400 font-bold mr-2 min-w-[80px]">Platform:</span> <span className="text-gray-200">{program.platform}</span></p>
                {program.scope && <p className="flex items-center text-sm"><span className="text-purple-400 font-bold mr-2 min-w-[80px]">Scope:</span> <span className="text-gray-200">{program.scope}</span></p>}
                {program.max_bounty && (
                  <p className="flex items-center text-sm"><span className="text-purple-400 font-bold mr-2 min-w-[80px]">Max Bounty:</span> <span className="text-green-400 font-black text-lg">${program.max_bounty}</span></p>
                )}
                <div className="pt-3 flex items-center justify-between">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 ${program.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/40' : 'bg-gray-500/20 text-gray-400 border-gray-500/40'}`}>
                    {program.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No programs found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or add a new program</p>
        </div>
      )}
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
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('all')

  const filteredVulnerabilities = vulnerabilities.filter(vuln => {
    const matchesSearch = vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.vulnerability_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === 'all' || vuln.severity === filterSeverity
    return matchesSearch && matchesSeverity
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Vulnerabilities</h2>
          <p className="text-gray-400 text-sm mt-1">Track and manage discovered vulnerabilities</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-purple-500/30"
        >
          <Plus className="w-5 h-5" />
          <span>Add Vulnerability</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vulnerabilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/30 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-black/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>
        </div>
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

      <div className="space-y-6">
        {filteredVulnerabilities.map((vuln, index) => {
          const target = targets.find(t => t.id === vuln.target_id)
          const severityBg = {
            critical: 'bg-red-500/10 border-red-500/50 shadow-red-500/30',
            high: 'bg-orange-500/10 border-orange-500/50 shadow-orange-500/30',
            medium: 'bg-yellow-500/10 border-yellow-500/50 shadow-yellow-500/30',
            low: 'bg-blue-500/10 border-blue-500/50 shadow-blue-500/30',
            info: 'bg-gray-500/10 border-gray-500/50 shadow-gray-500/30'
          }
          return (
            <div key={vuln.id} className={`group relative bg-gradient-to-br from-black/60 to-purple-900/20 backdrop-blur-xl border-2 ${severityBg[vuln.severity]} rounded-2xl p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-hidden scale-in`} style={{animationDelay: `${index * 0.05}s`}}>
              {/* Shimmer effect */}
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-3 mb-4">
                      <div className={`p-2 rounded-xl ${getSeverityColor(vuln.severity)} bg-black/30 border-2 border-current/30`}>
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">{vuln.title}</h3>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black ${getSeverityColor(vuln.severity)} bg-black/40 border-2 border-current/40 uppercase tracking-wider`}>
                        {vuln.severity}
                      </span>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 ${
                        vuln.status === 'resolved' ? 'bg-green-500/20 text-green-400 border-green-500/40' :
                        vuln.status === 'reported' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                        vuln.status === 'triaged' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' :
                        'bg-gray-500/20 text-gray-400 border-gray-500/40'
                      } uppercase tracking-wider`}>
                        {vuln.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
                      {target && (
                        <div className="flex items-center bg-black/20 p-3 rounded-lg border border-purple-500/20">
                          <Target className="w-5 h-5 mr-2 text-purple-400" />
                          <span className="text-purple-400 font-bold mr-2">Target:</span>
                          <span className="font-semibold">{target.domain}</span>
                        </div>
                      )}
                      <div className="flex items-center bg-black/20 p-3 rounded-lg border border-purple-500/20">
                        <Bug className="w-5 h-5 mr-2 text-purple-400" />
                        <span className="text-purple-400 font-bold mr-2">Type:</span>
                        <span className="font-semibold">{vuln.vulnerability_type}</span>
                      </div>
                      {vuln.bounty_amount && (
                        <div className="flex items-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 rounded-lg border-2 border-green-500/30">
                          <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                          <span className="text-green-400 font-bold mr-2">Bounty:</span>
                          <span className="text-green-400 font-black text-xl">${vuln.bounty_amount}</span>
                        </div>
                      )}
                      {vuln.description && (
                        <div className="md:col-span-2 mt-2 p-4 bg-black/30 rounded-xl border-2 border-purple-500/20">
                          <span className="text-purple-400 font-bold text-sm uppercase tracking-wider">Description:</span>
                          <p className="text-gray-200 mt-2 leading-relaxed">{vuln.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(vuln.id)}
                    className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl hover:scale-110 transition-all duration-300 ml-4 border-2 border-transparent hover:border-red-500/40"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {filteredVulnerabilities.length === 0 && (
        <div className="text-center py-12">
          <Bug className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No vulnerabilities found</p>
          <p className="text-gray-500 text-sm">Try adjusting your filters or add a new vulnerability</p>
        </div>
      )}
    </div>
  )
}

export default App
