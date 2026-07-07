import { motion } from 'framer-motion'
import { Shield, Upload, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props { onNavigate: (page: string) => void }

export default function EmptyState({ onNavigate }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col items-center justify-center min-h-[70vh] text-center px-6'
    >
      <div className='relative mb-8'>
        <div className='absolute inset-0 rounded-full bg-soc-green/5 blur-3xl scale-150' />
        <div className='relative p-8 rounded-full border border-soc-green/20 bg-soc-panel'>
          <Shield className='w-20 h-20 text-soc-green opacity-80' />
        </div>
        <div className='absolute -top-1 -right-1 w-4 h-4 rounded-full bg-soc-green animate-pulse_soc' />
      </div>

      <h1 className='text-3xl font-bold text-white mb-2'>
        LOG<span className='text-soc-green text-glow-green'>SENTINEL</span>
      </h1>
      <p className='text-muted-foreground text-base mb-2 max-w-md'>
        Enterprise SOC Log Analyzer & Incident Detector
      </p>
      <p className='text-sm text-muted-foreground/60 max-w-sm mb-10'>
        Upload your log files to automatically parse, analyze, and detect security incidents — all in your browser.
      </p>

      <div className='grid sm:grid-cols-3 gap-4 mb-10 max-w-2xl w-full'>
        {[
          { icon: Upload, label: 'Upload Logs', desc: 'Drag & drop .log, .txt, .csv files' },
          { icon: Zap, label: 'Auto-Parse', desc: '8+ built-in incident detection rules' },
          { icon: Shield, label: 'Dashboard', desc: 'Real-time analytics & charts' },
        ].map(({ icon: Icon, label, desc }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
            className='rounded-lg border border-soc-border bg-soc-panel p-4 text-left'>
            <Icon className='w-6 h-6 text-soc-green mb-2' />
            <p className='text-sm font-semibold text-white'>{label}</p>
            <p className='text-xs text-muted-foreground mt-0.5'>{desc}</p>
          </motion.div>
        ))}
      </div>

      <Button onClick={() => onNavigate('upload')} size='lg' className='gap-2 bg-soc-green text-black hover:bg-soc-green/90 font-bold px-8'>
        <Upload className='w-5 h-5' />
        Upload Log Files
      </Button>
    </motion.div>
  )
}
