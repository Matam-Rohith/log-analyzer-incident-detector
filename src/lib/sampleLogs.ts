export const SAMPLE_LOG = `2024-03-15T08:00:01.123Z INFO  AuthService - User admin@company.com logged in successfully from 192.168.1.10
2024-03-15T08:00:15.456Z INFO  ApiGateway - GET /api/v1/dashboard 200 45ms
2024-03-15T08:01:02.789Z WARN  DatabasePool - Connection pool at 80% capacity (80/100)
2024-03-15T08:01:33.012Z ERROR AuthService - Failed login attempt for user root from 10.0.0.45
2024-03-15T08:01:34.100Z ERROR AuthService - Failed login attempt for user root from 10.0.0.45
2024-03-15T08:01:35.200Z ERROR AuthService - Failed login attempt for user root from 10.0.0.45
2024-03-15T08:02:00.300Z CRITICAL SystemMonitor - CPU usage exceeded 95% threshold on node-03
2024-03-15T08:02:10.400Z ERROR ApiGateway - POST /api/v1/users 500 Internal Server Error
2024-03-15T08:02:11.500Z ERROR ApiGateway - POST /api/v1/users 500 Internal Server Error
2024-03-15T08:02:45.600Z WARN  CacheService - Redis eviction rate high: 1200 keys/sec
2024-03-15T08:03:00.700Z ERROR DatabaseService - Query timeout after 30000ms: SELECT * FROM users WHERE id=1 UNION SELECT username,password FROM admin--
2024-03-15T08:03:22.800Z INFO  DeploymentService - Deployment pipeline started for v2.4.1
2024-03-15T08:03:55.900Z WARN  NetworkMonitor - Unusual outbound traffic: 2.3GB in last 5 minutes
2024-03-15T08:04:10.010Z CRITICAL MemoryManager - Out of memory: Kill process 3421 (node) score 892
2024-03-15T08:04:11.020Z FATAL  ApplicationServer - Process killed by OOM killer
2024-03-15T08:04:12.030Z ERROR  FileSystem - Access denied: /etc/passwd read attempt from PID 4523
2024-03-15T08:05:00.040Z INFO  AuthService - User devops@company.com logged in from 192.168.1.20
2024-03-15T08:05:30.050Z WARN  ApiGateway - Rate limit approaching for IP 203.0.113.42 (900/1000 req/min)
2024-03-15T08:06:00.060Z DEBUG Scheduler - Cron job 'cleanup_temp' completed in 234ms
2024-03-15T08:06:45.070Z INFO  BackupService - Daily backup completed successfully (14.2GB)
2024-03-15T08:07:00.080Z ERROR DatabaseService - Deadlock detected between transactions T1 and T2
2024-03-15T08:07:30.090Z WARN  SSLCertMonitor - Certificate for api.company.com expires in 14 days
2024-03-15T08:08:00.100Z INFO  MetricsCollector - System health check passed
2024-03-15T08:08:30.110Z CRITICAL SecurityScanner - Possible port scan detected from 198.51.100.0 (nmap fingerprint)
`
