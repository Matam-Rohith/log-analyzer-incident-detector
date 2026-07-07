import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { LogEntry, LogLevel } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'

const LEVEL_COLORS: Record<LogLevel, string> = {
  ERROR:    'text-red-400 bg-red-500/10 border-red-500/20',
  WARN:     'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  INFO:     'text-blue-400 bg-blue-500/10 border-blue-500/20',
  DEBUG:    'text-purple-400 bg-purple-500/10 border-purple-500/20',
  CRITICAL: 'text-red-300 bg-red-600/20 border-red-400/30',
  FATAL:    'text-pink-300 bg-pink-600/20 border-pink-400/30',
}

interface Props { logs: LogEntry[] }

export default function LogViewer({ logs }: Props) {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('ALL')
  const [sourceFilter, setSourceFilter] = useState<string>('ALL')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 100

  const sources = useMemo(() => ['ALL', ...Array.from(new Set(logs.map(l => l.source)))], [logs])
  const levels = ['ALL', 'CRITICAL', 'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG']

  const filtered = useMemo(() => logs.filter(l => {
    if (levelFilter !== 'ALL' && l.level !== levelFilter) return false
    if (sourceFilter !== 'ALL' && l.source !== sourceFilter) return false
    if (search && !l.raw.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [logs, levelFilter, sourceFilter, search])

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-3'>
        <div className='relative flex-1 min-w-48'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
            placeholder='Search logs...'
            className='w-full pl-9 pr-4 py-2 text-sm bg-soc-panel border border-soc-border rounded-md text-white placeholder:text-muted-foreground focus:outline-none focus:border-soc-green/50'
          />
        </div>
        <select value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setPage(0) }}
          className='px-3 py-2 text-sm bg-soc-panel border border-soc-border rounded-md text-white focus:outline-none focus:border-soc-green/50 cursor-pointer'>
          {levels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => { setSourceFilter(e.target.value); setPage(0) }}
          className='px-3 py-2 text-sm bg-soc-panel border border-soc-border rounded-md text-white focus:outline-none focus:border-soc-green/50 cursor-pointer max-w-48'>
          {sources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className='text-xs text-muted-foreground'>
        Showing <span className='text-white'>{paginated.length}</span> of <span className='text-white'>{filtered.length}</span> logs
        {filtered.length !== logs.length && <span> (filtered from {logs.length} total)</span>}
      </div>

      <ScrollArea className='h-[560px] rounded-lg border border-soc-border bg-soc-panel'>
        <div className='p-1 font-mono text-xs'>
          {paginated.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(i * 0.003, 0.3) }}
              className='flex items-start gap-3 px-3 py-1.5 hover:bg-white/5 rounded'
            >
              <span className='text-muted-foreground/50 w-10 text-right flex-shrink-0 pt-0.5'>{(page * PAGE_SIZE) + i + 1}</span>
              <span className={`flex-shrink-0 px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase w-16 text-center ${LEVEL_COLORS[log.level] || 'text-gray-400'}`}>{log.level}</span>
              <span className='text-blue-400/70 flex-shrink-0 hidden sm:block w-36 truncate pt-0.5'>{log.timestamp.substring(0, 19).replace('T', ' ')}</span>
              <span className='text-green-400/60 flex-shrink-0 w-24 truncate pt-0.5'>{log.source}</span>
              <span className='text-gray-300 break-all leading-relaxed'>{log.message}</span>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-2'>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className='px-3 py-1.5 text-xs bg-soc-panel border border-soc-border rounded hover:border-green-400/50 disabled:opacity-40'>Prev</button>
          <span className='text-xs text-muted-foreground'>Page {page + 1} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className='px-3 py-1.5 text-xs bg-soc-panel border border-soc-border rounded hover:border-green-400/50 disabled:opacity-40'>Next</button>
        </div>
      )}
    </div>
  )
}
