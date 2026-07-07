import { LogEntry, AnalyticsData } from '@/types'

export function computeAnalytics(logs: LogEntry[]): AnalyticsData {
  const levelColors: Record<string, string> = {
    ERROR: '#ff4d4d', WARN: '#ffd700', INFO: '#00aaff',
    DEBUG: '#a855f7', CRITICAL: '#ff0040', FATAL: '#ff0040',
  }

  const levelCounts: Record<string, number> = {}
  const sourceCounts: Record<string, number> = {}
  const timeline: Record<string, Record<string, number>> = {}
  const errorMessages: Record<string, number> = {}
  const hourlyCounts: Record<string, number> = {}

  for (const log of logs) {
    levelCounts[log.level] = (levelCounts[log.level] || 0) + 1
    sourceCounts[log.source] = (sourceCounts[log.source] || 0) + 1

    // Timeline bucket — try to parse timestamp
    try {
      const d = new Date(log.timestamp)
      if (!isNaN(d.getTime())) {
        const bucket = d.toLocaleString('en', { month: 'short', day: '2-digit', hour: '2-digit' })
        const hourKey = d.getHours().toString().padStart(2, '0') + ':00'
        timeline[bucket] ??= { ERROR: 0, WARN: 0, INFO: 0, CRITICAL: 0 }
        const lvl = ['ERROR','WARN','INFO','CRITICAL'].includes(log.level) ? log.level : 'INFO'
        timeline[bucket][lvl] = (timeline[bucket][lvl] || 0) + 1
        hourlyCounts[hourKey] = (hourlyCounts[hourKey] || 0) + 1
      }
    } catch { /* skip */ }

    if (log.level === 'ERROR' || log.level === 'CRITICAL') {
      const key = log.message.substring(0, 60)
      errorMessages[key] = (errorMessages[key] || 0) + 1
    }
  }

  const timelineData = Object.entries(timeline)
    .map(([time, counts]) => ({ time, ERROR: counts.ERROR || 0, WARN: counts.WARN || 0, INFO: counts.INFO || 0, CRITICAL: counts.CRITICAL || 0 }))
    .slice(-24)

  const sourceDistribution = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([source, count]) => ({ source, count }))

  const levelDistribution = Object.entries(levelCounts)
    .map(([level, count]) => ({ level, count, color: levelColors[level] || '#888' }))

  const topErrors = Object.entries(errorMessages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([message, count]) => ({ message, count }))

  const hourlyActivity = Object.entries(hourlyCounts)
    .sort()
    .map(([hour, count]) => ({ hour, count }))

  return {
    totalLogs: logs.length,
    errorCount: levelCounts['ERROR'] || 0,
    warnCount: levelCounts['WARN'] || 0,
    infoCount: levelCounts['INFO'] || 0,
    debugCount: levelCounts['DEBUG'] || 0,
    criticalCount: (levelCounts['CRITICAL'] || 0) + (levelCounts['FATAL'] || 0),
    incidentCount: 0,
    uniqueSources: Object.keys(sourceCounts).length,
    timelineData,
    sourceDistribution,
    levelDistribution,
    topErrors,
    hourlyActivity,
  }
}
