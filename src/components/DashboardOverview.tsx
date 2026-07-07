import { motion } from 'framer-motion'
import { AlertTriangle, AlertOctagon, Info, Bug, Shield, FileText, Activity, Server } from 'lucide-react'
import StatCard from './StatCard'
import { AnalyticsData } from '@/types'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Props { analytics: AnalyticsData }

export default function DashboardOverview({ analytics }: Props) {
  const COLORS = ['#ff4d4d', '#ffd700', '#00aaff', '#a855f7', '#ff0040']

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <StatCard title='Total Logs' value={analytics.totalLogs} icon={FileText} color='#00aaff' index={0} />
        <StatCard title='Incidents' value={analytics.incidentCount} icon={Shield} color='#ff0040' glowClass='glow-red' index={1} />
        <StatCard title='Errors' value={analytics.errorCount} icon={AlertOctagon} color='#ff4d4d' index={2} />
        <StatCard title='Warnings' value={analytics.warnCount} icon={AlertTriangle} color='#ffd700' index={3} />
        <StatCard title='Info' value={analytics.infoCount} icon={Info} color='#00aaff' index={4} />
        <StatCard title='Critical' value={analytics.criticalCount} icon={Activity} color='#ff0040' index={5} />
        <StatCard title='Debug' value={analytics.debugCount} icon={Bug} color='#a855f7' index={6} />
        <StatCard title='Sources' value={analytics.uniqueSources} icon={Server} color='#00ff88' glowClass='glow-green' index={7} />
      </div>

      {analytics.timelineData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className='rounded-lg border border-soc-border bg-soc-panel p-5'>
          <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4'>Log Activity Timeline</h3>
          <ResponsiveContainer width='100%' height={200}>
            <AreaChart data={analytics.timelineData}>
              <defs>
                <linearGradient id='gError' x1='0' y1='0' x2='0' y2='1'><stop offset='5%' stopColor='#ff4d4d' stopOpacity={0.3}/><stop offset='95%' stopColor='#ff4d4d' stopOpacity={0}/></linearGradient>
                <linearGradient id='gWarn' x1='0' y1='0' x2='0' y2='1'><stop offset='5%' stopColor='#ffd700' stopOpacity={0.3}/><stop offset='95%' stopColor='#ffd700' stopOpacity={0}/></linearGradient>
                <linearGradient id='gInfo' x1='0' y1='0' x2='0' y2='1'><stop offset='5%' stopColor='#00aaff' stopOpacity={0.2}/><stop offset='95%' stopColor='#00aaff' stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' stroke='#1e2d4a' />
              <XAxis dataKey='time' tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0d1224', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12 }} />
              <Area type='monotone' dataKey='CRITICAL' stroke='#ff0040' fill='url(#gError)' strokeWidth={2} />
              <Area type='monotone' dataKey='ERROR' stroke='#ff4d4d' fill='url(#gError)' strokeWidth={2} />
              <Area type='monotone' dataKey='WARN' stroke='#ffd700' fill='url(#gWarn)' strokeWidth={1.5} />
              <Area type='monotone' dataKey='INFO' stroke='#00aaff' fill='url(#gInfo)' strokeWidth={1} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {analytics.levelDistribution.length > 0 && (
        <div className='grid md:grid-cols-2 gap-4'>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className='rounded-lg border border-soc-border bg-soc-panel p-5'>
            <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4'>Level Distribution</h3>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie data={analytics.levelDistribution} dataKey='count' nameKey='level' cx='50%' cy='50%' outerRadius={80} label={({ level, percent }) => `${level} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#1e2d4a' }}>
                  {analytics.levelDistribution.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0d1224', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className='rounded-lg border border-soc-border bg-soc-panel p-5'>
            <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4'>Top Error Sources</h3>
            <div className='space-y-3'>
              {analytics.sourceDistribution.slice(0, 6).map((s, i) => (
                <div key={s.source} className='flex items-center gap-3'>
                  <span className='text-xs text-muted-foreground w-4'>{i + 1}</span>
                  <span className='text-xs text-white flex-1 truncate font-mono'>{s.source}</span>
                  <div className='flex items-center gap-2'>
                    <div className='h-1.5 rounded-full bg-soc-green/30 overflow-hidden' style={{ width: 80 }}>
                      <div className='h-full bg-soc-green rounded-full' style={{ width: `${Math.min(100, (s.count / analytics.totalLogs) * 100 * 5)}%` }} />
                    </div>
                    <span className='text-xs text-soc-green font-mono w-8 text-right'>{s.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
