import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, AlertOctagon, Info, CheckCircle, Clock, Shield } from 'lucide-react'
import { Incident } from '@/types'
import { Badge } from '@/components/ui/badge'

const SEVERITY_CONFIG = {
  CRITICAL: { color: '#ff0040', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertOctagon, label: 'CRITICAL' },
  HIGH:     { color: '#ff4d4d', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertTriangle, label: 'HIGH' },
  MEDIUM:   { color: '#ffd700', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: Info, label: 'MEDIUM' },
  LOW:      { color: '#00aaff', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: Shield, label: 'LOW' },
}

const STATUS_CONFIG = {
  OPEN:          { color: 'text-red-400', label: 'OPEN' },
  INVESTIGATING: { color: 'text-yellow-400', label: 'INVESTIGATING' },
  RESOLVED:      { color: 'text-green-400', label: 'RESOLVED' },
}

interface Props { incidents: Incident[] }

export default function IncidentPanel({ incidents }: Props) {
  if (incidents.length === 0) return (
    <div className='flex flex-col items-center justify-center py-20 text-center'>
      <CheckCircle className='w-16 h-16 text-soc-green mb-4 opacity-50' />
      <p className='text-lg font-semibold text-white'>No Incidents Detected</p>
      <p className='text-sm text-muted-foreground mt-1'>Upload log files to run incident detection rules</p>
    </div>
  )

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold text-white'>Detected Incidents</h2>
        <span className='text-sm text-muted-foreground'>{incidents.length} incident{incidents.length > 1 ? 's' : ''} found</span>
      </div>
      <AnimatePresence>
        {incidents.map((inc, i) => {
          const cfg = SEVERITY_CONFIG[inc.severity]
          const Icon = cfg.icon
          const status = STATUS_CONFIG[inc.status]
          return (
            <motion.div key={inc.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className={`rounded-lg border ${cfg.border} ${cfg.bg} p-5`}>
              <div className='flex items-start gap-4'>
                <div className='p-2 rounded-md mt-0.5' style={{ background: `${cfg.color}20` }}>
                  <Icon className='w-5 h-5' style={{ color: cfg.color }} />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span className='font-semibold text-white'>{inc.title}</span>
                    <Badge variant='outline' className='text-xs border-current' style={{ color: cfg.color, borderColor: `${cfg.color}60` }}>{cfg.label}</Badge>
                    <span className={`text-xs font-mono font-bold ${status.color}`}>{status.label}</span>
                  </div>
                  <p className='text-sm text-muted-foreground mt-1'>{inc.description}</p>
                  <div className='flex items-center gap-4 mt-2 text-xs text-muted-foreground'>
                    <span className='flex items-center gap-1'><Clock className='w-3 h-3' />{new Date(inc.detectedAt).toLocaleString()}</span>
                    <span className='font-mono'>Rule: {inc.ruleTriggered}</span>
                    <span>{inc.affectedLogs.length} log entries affected</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
