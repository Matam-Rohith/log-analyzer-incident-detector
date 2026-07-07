export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'CRITICAL' | 'FATAL';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  raw: string;
  lineNumber: number;
  fileName: string;
}

export interface Incident {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  affectedLogs: string[];
  detectedAt: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  ruleTriggered: string;
}

export interface LogFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  lineCount: number;
  parsed: boolean;
}

export interface AnalyticsData {
  totalLogs: number;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  debugCount: number;
  criticalCount: number;
  incidentCount: number;
  uniqueSources: number;
  timelineData: TimelinePoint[];
  sourceDistribution: SourcePoint[];
  levelDistribution: LevelPoint[];
  topErrors: ErrorPoint[];
  hourlyActivity: HourlyPoint[];
}

export interface TimelinePoint { time: string; ERROR: number; WARN: number; INFO: number; CRITICAL: number; }
export interface SourcePoint { source: string; count: number; }
export interface LevelPoint { level: string; count: number; color: string; }
export interface ErrorPoint { message: string; count: number; }
export interface HourlyPoint { hour: string; count: number; }
