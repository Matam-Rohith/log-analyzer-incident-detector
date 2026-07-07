import { motion } from 'framer-motion'
import { AnalyticsData } from '@/types'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Legend
} from 'recharts'

interface Props { analytics: AnalyticsData }

export default function AnalyticsView({ analytics }: Props) {
  const radarData = [
    { subject: 'Errors', A: analytics.errorCount },
    { subject: 'Warnings', A: analytics.warnCount },
    { subject: 'Critical', A: analytics.criticalCount },
    { subject: 'Debug', A: analytics.debugCount },
    { subject: 'Info', A: analytics.infoCount },
    { subject: 'Incidents', A: analytics.incidentCount * 10 },
  ]

  return (
    <div className='space-y-6'>
      <h2 className='text-xl font-bold text-white'>Advanced Analytics</h2>

      <div className='grid md:grid-cols-2 gap-4'>
        {analytics.hourlyActivity.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='rounded-lg border border-soc-border bg-soc-panel p-5'>
            <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4'>Hourly Log Activity</h3>
            <ResponsiveContainer width='100%' height={200}>
              <BarChart data={analytics.hourlyActivity}>
                <CartesianGrid strokeDasharray='3 3' stroke='#1e2d4a' />
                <XAxis dataKey='hour' tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1224', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey='count' fill='#00aaff' radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='rounded-lg border border-soc-border bg-soc-panel p-5'>
          <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4'>Threat Radar</h3>
          <ResponsiveContainer width='100%' height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke='#1e2d4a' />
              <PolarAngleAxis dataKey='subject' tick={{ fill: '#64748b', fontSize: 11 }} />
              <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 9 }} />
              <Radar name='Events' dataKey='A' stroke='#00ff88' fill='#00ff88' fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {analytics.topErrors.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='rounded-lg border border-soc-border bg-soc-panel p-5'>
          <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4'>Top Error Messages</h3>
          <div className='space-y-3'>
            {analytics.topErrors.map((e, i) => (
              <div key={i} className='flex items-center gap-3'>
                <span className='text-xs font-mono text-soc-red w-4'>{e.count}×</span>
                <div className='flex-1 bg-soc-border/20 rounded h-6 relative overflow-hidden'>
                  <div className='absolute inset-y-0 left-0 bg-red-500/20 rounded' style={{ width: `${Math.min(100, (e.count / (analytics.topErrors[0]?.count || 1)) * 100)}%` }} />
                  <span className='absolute inset-0 flex items-center px-2 text-xs text-gray-300 font-mono truncate'>{e.message}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {analytics.sourceDistribution.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='rounded-lg border border-soc-border bg-soc-panel p-5'>
          <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4'>Source Log Volume</h3>
          <ResponsiveContainer width='100%' height={200}>
            <BarChart data={analytics.sourceDistribution} layout='vertical'>
              <CartesianGrid strokeDasharray='3 3' stroke='#1e2d4a' />
              <XAxis type='number' tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis dataKey='source' type='category' tick={{ fill: '#94a3b8', fontSize: 11 }} width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#0d1224', border: '1px solid #1e2d4a', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey='count' fill='#a855f7' radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  )
}
