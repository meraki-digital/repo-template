# pg_cron

**Category:** Database  
**Official Docs:** [https://github.com/citusdata/pg_cron](https://github.com/citusdata/pg_cron)  
**Used In:** Superscapes Financial Intelligence Dashboard - MVP

---

## What Is It?

pg_cron is a PostgreSQL extension that enables job scheduling directly within the database using cron-like syntax. It allows you to schedule SQL commands, functions, or procedures to run at specified times or intervals, making it perfect for automated maintenance, ETL processes, and periodic tasks. Unlike external cron jobs, pg_cron runs within PostgreSQL itself, providing better integration and reliability.

Think of pg_cron as a built-in alarm clock for your database. Instead of setting up external scripts or cron jobs, you can tell PostgreSQL to "remind" itself to run certain tasks at specific times, like running ETL processes every night or cleaning up old data weekly.

---

## Why We're Using It In This Project

pg_cron provides reliable, database-integrated job scheduling for our ETL operations:

- **Database-native scheduling**: No external cron jobs or separate systems to manage
- **Transactional consistency**: Jobs run within database transactions
- **Integrated monitoring**: Job history and status visible in database tables
- **Simple syntax**: Uses familiar cron format for scheduling
- **High availability**: Works with PostgreSQL's replication and failover
- **Audit trail**: All job executions logged in database
- **Cost-effective**: No additional infrastructure needed for basic scheduling

---

## How We'll Use It

pg_cron will schedule our nightly ETL processes and maintenance tasks:

**Example 1: Install and enable pg_cron**
```sql
-- As superuser
CREATE EXTENSION pg_cron;

-- Grant usage to application user
GRANT USAGE ON SCHEMA cron TO your_app_user;
```

**Example 2: Schedule nightly ETL job**
```sql
-- Run ETL process every night at 2 AM
SELECT cron.schedule(
    'nightly-etl',           -- job name
    '0 2 * * *',             -- cron schedule: daily at 2 AM
    'SELECT run_etl_process();'  -- SQL command to execute
);
```

**Example 3: Schedule data cleanup**
```sql
-- Clean old audit logs weekly on Sunday at 3 AM
SELECT cron.schedule(
    'weekly-cleanup',
    '0 3 * * 0',
    'DELETE FROM audit_log WHERE created_at < NOW() - INTERVAL ''90 days'''
);
```

**Example 4: Schedule financial report generation**
```sql
-- Generate monthly reports on the 1st of each month
SELECT cron.schedule(
    'monthly-reports',
    '0 6 1 * *',
    'SELECT generate_monthly_financial_reports();'
);
```

**Example 5: Monitor job execution**
```sql
-- Check job status and history
SELECT * FROM cron.job;
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- View failed jobs
SELECT jobname, status, return_message 
FROM cron.job_run_details 
WHERE status = 'failed' 
ORDER BY start_time DESC;
```

---

## Key Concepts

- **Cron syntax**: Standard time-based scheduling format (minute hour day month day-of-week)
- **Job scheduling**: One-time or recurring job definitions
- **Job execution**: Automatic running of scheduled SQL commands
- **Job monitoring**: Built-in tables for tracking job status and history
- **Database integration**: Jobs run with database permissions and transaction context

---

## Alternatives We Considered

- **External cron jobs**: Requires additional infrastructure and coordination
- **AWS EventBridge**: Cloud-specific, adds complexity for simple scheduling
- **Application schedulers**: Like APScheduler, but pg_cron is more reliable
- **Manual triggers**: Not suitable for automated production processes

---

## Getting Started

1. **Install pg_cron extension** (requires superuser):
   ```sql
   CREATE EXTENSION pg_cron;
   ```
2. **Schedule a simple job**:
   ```sql
   SELECT cron.schedule('test-job', '*/5 * * * *', 'SELECT 1;');
   ```
3. **Monitor jobs**:
   ```sql
   SELECT * FROM cron.job;
   ```

---

## Common Patterns & Best Practices

1. **Use descriptive job names**: 'nightly-etl-main' instead of 'job1'
2. **Schedule off-peak hours**: Run heavy jobs during low-usage times
3. **Monitor job failures**: Set up alerts for failed cron jobs
4. **Test schedules carefully**: Use tools like crontab.guru to verify syntax
5. **Limit job runtime**: Ensure jobs complete within reasonable timeframes

---

## Troubleshooting

**Issue 1:** Jobs not running at expected times  
**Solution:** Check timezone settings and cron syntax

**Issue 2:** Permission denied errors  
**Solution:** Grant proper permissions to the cron schema

---

## Learning Resources

**Essential:**
- [pg_cron GitHub](https://github.com/citusdata/pg_cron)
- [Cron Syntax Guide](https://crontab.guru/)

**Recommended:**
- [PostgreSQL Scheduling with pg_cron](https://www.citusdata.com/blog/2016/09/20/job-scheduling-in-postgresql/)
- [pg_cron Examples](https://github.com/citusdata/pg_cron#examples)

**Community:**
- [PostgreSQL Mailing List](https://www.postgresql.org/list/)
- [pg_cron Issues](https://github.com/citusdata/pg_cron/issues)

---

**Related Technologies:**
- [PostgreSQL](https://www.postgresql.org/docs/) - Database that pg_cron extends
- [Prefect](prefect.md) - Advanced workflow orchestration
- [AWS EventBridge](aws-eventbridge.md) - Cloud scheduling alternative
