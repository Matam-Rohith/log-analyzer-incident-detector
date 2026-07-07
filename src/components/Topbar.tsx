import { motion } from 'framer-motion'
import { Shield, Activity, Clock, Wifi } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Topbar() {
  const [time, setTime] = useState(new Date())
  const [status] = useState<'ONLINE' | 'OFFLINE'>('ONLINE')

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className='sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-soc-border bg-soc-dark/95 backdrop-blur'
    >
      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-2'>
          <Shield className='w-6 h-6 text-soc-green' />
          <span className='text-lg font-bold text-white tracking-wider'>LOG<span className='text-soc-green'>SENTINEL</span></span>
        </div>
        <div className='hidden md:flex items-center gap-1 ml-4 px-2 py-1 rounded border border-soc-border text-xs text-muted-foreground'>
          <span>SOC Operations Center</span>
          <span className='mx-1 text-soc-border'>|</span>
          <span>v2.4.1</span>
        </div>
      </div>

      <div className='flex items-center gap-6 text-xs'>
        <div className='flex items-center gap-2'>
          <Activity className='w-4 h-4 text-soc-green' />
          <span className='text-muted-foreground'>System</span>
          <span className={`font-bold ${status === 'ONLINE' ? 'text-soc-green' : 'text-soc-red'}`}>{status}</span>
        </div>
        <div className='flex items-center gap-2'>
          <Wifi className='w-4 h-4 text-soc-blue' />
          <span className='text-soc-blue font-mono'>LIVE</span>
          <span className='w-2 h-2 rounded-full bg-soc-green animate-pulse_soc' />
        </div>
        <div className='flex items-center gap-2 font-mono text-muted-foreground'>
          <Clock className='w-4 h-4' />
          <span>{time.toUTCString().split(' ').slice(0, 5).join(' ')}</span>
        </div>
      </div>
    </motion.header>
  )
}
