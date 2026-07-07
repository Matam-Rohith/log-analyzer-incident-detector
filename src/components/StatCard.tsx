import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface Props {
  title: string
  value: number
  icon: LucideIcon
  color: string
  glowClass?: string
  delta?: string
  index?: number
}

export default function StatCard({ title, value, icon: Icon, color, glowClass, delta, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`relative rounded-lg border border-soc-border bg-soc-panel p-5 overflow-hidden ${glowClass || ''}`}
    >
      <div className='absolute inset-0 opacity-5' style={{ background: `radial-gradient(circle at 70% 50%, ${color}, transparent 70%)` }} />
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-xs font-medium text-muted-foreground uppercase tracking-widest'>{title}</p>
          <p className='mt-1 text-3xl font-bold' style={{ color }}>{formatNumber(value)}</p>
          {delta && <p className='mt-1 text-xs text-muted-foreground'>{delta}</p>}
        </div>
        <div className='p-2.5 rounded-md' style={{ background: `${color}18` }}>
          <Icon className='w-5 h-5' style={{ color }} />
        </div>
      </div>
    </motion.div>
  )
}
