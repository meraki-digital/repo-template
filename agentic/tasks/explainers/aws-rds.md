# AWS RDS (Relational Database Service)

**Category:** Database / Infrastructure
**Official Docs:** https://docs.aws.amazon.com/rds/
**Used In:** Superscapes Financial Intelligence Dashboard - Authentication RDS Management

---

## What Is It?

AWS RDS is a managed database service that handles the operational heavy lifting of running a relational database in the cloud. Think of it as "PostgreSQL as a service"—AWS manages backups, patches, scaling, and high availability, while you focus on your data and queries.

Unlike running PostgreSQL on your own server, RDS provides automated backups, point-in-time recovery, monitoring, and the ability to stop/start instances to save costs. For our project, the key feature is the ability to automatically stop the database after inactivity and restart it on-demand.

---

## Why We're Using It In This Project

- **Cost optimization** - Stop database when inactive (saves ~$20-50/month on small instances)
- **Managed service** - No need to handle PostgreSQL patches, backups, or OS maintenance
- **Auto-start capability** - Users can restart the database via authenticated API calls
- **Reliable backups** - Automated daily backups with 7-day retention
- **Easy scaling** - Can upgrade instance size if analytics workload grows

---

## How We'll Use It

**Example 1: Starting RDS Instance via boto3**
```python
import boto3

rds = boto3.client('rds', region_name='us-east-1')

def start_database():
    response = rds.start_db_instance(
        DBInstanceIdentifier='ss-financial-prod'
    )
    return {
        'status': response['DBInstance']['DBInstanceStatus'],  # 'starting'
        'endpoint': response['DBInstance']['Endpoint']['Address']
    }
```

**Example 2: Checking RDS Status**
```python
def get_database_status(db_identifier: str):
    response = rds.describe_db_instances(
        DBInstanceIdentifier=db_identifier
    )
    instance = response['DBInstances'][0]

    return {
        'status': instance['DBInstanceStatus'],  # 'available', 'stopped', 'starting'
        'endpoint': instance.get('Endpoint', {}).get('Address'),
        'instance_class': instance['DBInstanceClass'],  # 't3.micro'
        'storage_gb': instance['AllocatedStorage']
    }
```

**Example 3: Stopping RDS After Inactivity**
```python
from datetime import datetime, timedelta

def auto_stop_if_inactive(db_identifier: str, last_query_time: datetime, inactivity_threshold_minutes: int = 60):
    time_since_last_query = datetime.utcnow() - last_query_time

    if time_since_last_query > timedelta(minutes=inactivity_threshold_minutes):
        response = rds.stop_db_instance(DBInstanceIdentifier=db_identifier)
        return {
            'stopped': True,
            'reason': f'No activity for {inactivity_threshold_minutes} minutes'
        }
    return {'stopped': False}
```

---

## Key Concepts

- **DB Instance:** A single database server running in AWS (e.g., PostgreSQL 15 on t3.micro)
- **Instance Class:** The compute/memory capacity (t3.micro = 2 vCPU, 1GB RAM)
- **DB Instance Identifier:** Unique name for your database (e.g., `ss-financial-prod`)
- **Endpoint:** Connection string for accessing the database (e.g., `ss-financial.abc123.us-east-1.rds.amazonaws.com:5432`)
- **Auto-stop Limitation:** RDS automatically restarts after 7 days if stopped (can't stay stopped indefinitely)

---

## Alternatives We Considered

- **Self-managed PostgreSQL on EC2:** More control but requires manual maintenance and doesn't support auto-stop
- **AWS Aurora Serverless:** Scales to zero automatically but costs more and adds complexity
- **Heroku Postgres:** Simpler but no auto-stop feature and less control
- **Google Cloud SQL:** Comparable features but team already familiar with AWS

---

## Getting Started

1. **Create RDS instance via AWS Console:**
   - Engine: PostgreSQL 15
   - Instance class: db.t3.micro (free tier eligible)
   - Storage: 20 GB SSD
   - Enable automated backups

2. **Configure security group:**
   - Allow inbound PostgreSQL (port 5432) from your application's IP/security group

3. **Connect from Python:**
   ```python
   from sqlalchemy import create_engine

   engine = create_engine(
       'postgresql://username:password@ss-financial.abc123.us-east-1.rds.amazonaws.com:5432/dbname'
   )
   ```

4. **Test stop/start:**
   ```bash
   aws rds stop-db-instance --db-instance-identifier ss-financial-prod
   aws rds start-db-instance --db-instance-identifier ss-financial-prod
   ```

---

## Common Patterns & Best Practices

1. **Use parameter groups** - Configure PostgreSQL settings (max_connections, shared_buffers) via RDS parameter groups
2. **Enable automated backups** - Set backup retention to 7 days minimum for production
3. **Monitor with CloudWatch** - Track CPU, memory, disk I/O, and connection count
4. **Use read replicas for scaling** - If analytics queries become heavy, add read replicas (future enhancement)
5. **Tag instances for cost tracking** - Add tags like `Project=ss-financial`, `Environment=prod`

---

## Troubleshooting

**Issue 1:** Can't connect to RDS from local machine
**Solution:** Check security group allows inbound traffic from your IP on port 5432. Verify VPC settings if using private subnet.

**Issue 2:** RDS auto-starts after stopping it
**Solution:** This is expected behavior if stopped for 7+ days. Implement EventBridge-triggered stop for continuous cost savings.

**Issue 3:** Database start takes 3+ minutes
**Solution:** Normal for cold starts. Typical startup time is 60-90 seconds. Show progress indicator to users.

**Issue 4:** "InvalidDBInstanceState" error when calling start_db_instance
**Solution:** Instance may already be starting or running. Check status with `describe_db_instances()` before attempting start.

---

## Learning Resources

**Essential:**
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [RDS PostgreSQL Best Practices](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html)

**Recommended:**
- [RDS Cost Optimization](https://aws.amazon.com/rds/cost-optimization/)
- [Stop and Start RDS Instances](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StartInstance.html)

**Community:**
- [AWS RDS Forums](https://forums.aws.amazon.com/forum.jspa?forumID=60)
- [r/aws on Reddit](https://www.reddit.com/r/aws/)

---

**Related Technologies:**
- [PostgreSQL 15](postgresql.md) - Database engine running on RDS
- [boto3](boto3.md) - Python SDK for controlling RDS lifecycle
- [AWS Lambda](aws-lambda.md) - Serverless functions that start/stop RDS
- [AWS EventBridge](aws-eventbridge.md) - Scheduled triggers for RDS auto-stop
- [SQLAlchemy](sqlalchemy.md) - ORM for connecting to RDS PostgreSQL
