import { motion } from 'framer-motion'
import { LayoutDashboard, Upload, AlertTriangle, FileText, BarChart2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Upload Logs', icon: Upload },
  { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { id: 'logs', label: 'Log Viewer', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
]

interface Props {
  active: string
  onChange: (id: string) => void
  incidentCount: number
  onClear: () => void
}

export default function Sidebar({ active, onChange, incidentCount, onClear }: Props) {
  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className='hidden md:flex flex-col w-56 min-h-screen border-r border-soc-border bg-soc-panel pt-4'
    >
      <nav className='flex-1 px-3 space-y-1'>
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all',
              active === id
                ? 'bg-soc-green/10 text-soc-green border border-soc-green/20 glow-green'
                : 'text-muted-foreground hover:bg-secondary hover:text-white'
            )}
          >
            <Icon className='w-4 h-4 flex-shrink-0' />
            <span>{label}</span>
            {id === 'incidents' && incidentCount > 0 && (
              <span className='ml-auto bg-soc-red text-white text-xs px-1.5 py-0.5 rounded-full font-bold'>
                {incidentCount}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className='px-3 pb-6'>
        <button
          onClick={onClear}
          className='w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20'
        >
          <Trash2 className='w-4 h-4' />
          <span>Clear All Data</span>
        </button>
      </div>
    </motion.aside>
  )
}
