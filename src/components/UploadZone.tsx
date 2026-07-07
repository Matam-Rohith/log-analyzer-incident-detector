import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle, Loader2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { parseLogContent } from '@/lib/logParser'
import { detectIncidents } from '@/lib/incidentDetector'
import { computeAnalytics } from '@/lib/analytics'
import { storage } from '@/lib/storage'
import { SAMPLE_LOG } from '@/lib/sampleLogs'
import { LogEntry, Incident, AnalyticsData, LogFile } from '@/types'
import { generateId } from '@/lib/utils'

interface Props {
  onProcessed: (logs: LogEntry[], incidents: Incident[], analytics: AnalyticsData, files: LogFile[]) => void
}

export default function UploadZone({ onProcessed }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [done, setDone] = useState(false)

  const processFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setIsProcessing(true)
    setDone(false)

    const existingLogs = storage.getLogs()
    const existingFiles = storage.getFiles()
    let allLogs: LogEntry[] = [...existingLogs]
    const newFiles: LogFile[] = []

    for (const file of Array.from(fileList)) {
      const text = await file.text()
      const parsed = parseLogContent(text, file.name)
      allLogs = [...allLogs, ...parsed]
      newFiles.push({
        id: generateId(),
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        lineCount: parsed.length,
        parsed: true
      })
    }

    const allFiles = [...existingFiles, ...newFiles]
    const incidents = detectIncidents(allLogs)
    const analytics = computeAnalytics(allLogs)
    analytics.incidentCount = incidents.length

    storage.saveLogs(allLogs)
    storage.saveIncidents(incidents)
    storage.saveFiles(allFiles)

    await new Promise(r => setTimeout(r, 600))
    setIsProcessing(false)
    setDone(true)
    setTimeout(() => setDone(false), 2000)
    onProcessed(allLogs, incidents, analytics, allFiles)
  }, [onProcessed])

  const loadSample = () => {
    const dt = new DataTransfer()
    const file = new File([SAMPLE_LOG], 'sample-soc.log', { type: 'text/plain' })
    dt.items.add(file)
    processFiles(dt.files)
  }

  return (
    <div className='max-w-2xl mx-auto py-8 space-y-6'>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className='text-xl font-bold text-white mb-1'>Upload Log Files</h2>
        <p className='text-sm text-muted-foreground'>
          Supports <span className='text-green-400'>.log</span>,{' '}
          <span className='text-green-400'>.txt</span>,{' '}
          <span className='text-green-400'>.csv</span> — parsed entirely in your browser
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files) }}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-green-400 bg-green-400/5'
            : 'border-slate-700 hover:border-green-400/50 bg-slate-900'
        }`}
      >
        <AnimatePresence mode='wait'>
          {isProcessing ? (
            <motion.div key='proc' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex flex-col items-center gap-3'>
              <Loader2 className='w-12 h-12 text-green-400 animate-spin' />
              <p className='text-green-400 font-semibold'>Parsing logs...</p>
              <p className='text-xs text-muted-foreground'>Running incident detection rules</p>
            </motion.div>
          ) : done ? (
            <motion.div key='done' initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className='flex flex-col items-center gap-3'>
              <CheckCircle className='w-12 h-12 text-green-400' />
              <p className='text-green-400 font-semibold'>Analysis complete!</p>
            </motion.div>
          ) : (
            <motion.div key='idle' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex flex-col items-center gap-4'>
              <div className='p-4 rounded-full bg-slate-800'>
                <Upload className='w-10 h-10 text-green-400' />
              </div>
              <div>
                <p className='text-white font-semibold'>Drag & drop log files here</p>
                <p className='text-sm text-muted-foreground mt-1'>or click to browse</p>
              </div>
              <input
                type='file'
                multiple
                accept='.log,.txt,.csv'
                className='absolute inset-0 opacity-0 cursor-pointer'
                onChange={e => processFiles(e.target.files)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className='flex items-center gap-3'>
        <div className='flex-1 h-px bg-slate-700' />
        <span className='text-xs text-muted-foreground'>or</span>
        <div className='flex-1 h-px bg-slate-700' />
      </div>

      <Button
        onClick={loadSample}
        variant='outline'
        className='w-full border-green-400/40 text-green-400 hover:bg-green-400/10 gap-2'
      >
        <Zap className='w-4 h-4' />
        Load Sample SOC Log File
      </Button>
    </div>
  )
}
