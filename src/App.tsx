import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogEntry, Incident, AnalyticsData, LogFile } from '@/types'
import { computeAnalytics } from '@/lib/analytics'
import { detectIncidents } from '@/lib/incidentDetector'
import { storage } from '@/lib/storage'
import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'
import DashboardOverview from '@/components/DashboardOverview'
import UploadZone from '@/components/UploadZone'
import IncidentPanel from '@/components/IncidentPanel'
import LogViewer from '@/components/LogViewer'
import AnalyticsView from '@/components/AnalyticsView'
import EmptyState from '@/components/EmptyState'

type Page = 'dashboard' | 'upload' | 'incidents' | 'logs' | 'analytics'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [files, setFiles] = useState<LogFile[]>([])
  const [loaded, setLoaded] = useState(false)

  // Restore from localStorage on mount
  useEffect(() => {
    const savedLogs = storage.getLogs()
    const savedIncidents = storage.getIncidents()
    const savedFiles = storage.getFiles()
    if (savedLogs.length > 0) {
      const a = computeAnalytics(savedLogs)
      a.incidentCount = savedIncidents.length
      setLogs(savedLogs)
      setIncidents(savedIncidents)
      setAnalytics(a)
      setFiles(savedFiles)
    }
    setLoaded(true)
  }, [])

  const handleProcessed = (l: LogEntry[], i: Incident[], a: AnalyticsData, f: LogFile[]) => {
    setLogs(l)
    setIncidents(i)
    setAnalytics(a)
    setFiles(f)
    setPage('dashboard')
  }

  const handleClear = () => {
    storage.clearAll()
    setLogs([])
    setIncidents([])
    setAnalytics(null)
    setFiles([])
    setPage('dashboard')
  }

  const hasData = logs.length > 0

  return (
    <div className='min-h-screen bg-soc-dark grid-bg scanline'>
      <Topbar />
      <div className='flex'>
        <Sidebar active={page} onChange={p => setPage(p as Page)} incidentCount={incidents.length} onClear={handleClear} />
        <main className='flex-1 overflow-auto'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
            <AnimatePresence mode='wait'>
              {!loaded ? null : (
                <motion.div key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
                  {page === 'dashboard' && (hasData && analytics ? <DashboardOverview analytics={analytics} /> : <EmptyState onNavigate={p => setPage(p as Page)} />)}
                  {page === 'upload' && <UploadZone onProcessed={handleProcessed} />}
                  {page === 'incidents' && <IncidentPanel incidents={incidents} />}
                  {page === 'logs' && <LogViewer logs={logs} />}
                  {page === 'analytics' && analytics && <AnalyticsView analytics={analytics} />}
                  {page === 'analytics' && !analytics && <EmptyState onNavigate={p => setPage(p as Page)} />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
