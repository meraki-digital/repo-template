#!/bin/bash

# Restore DEV backup to PROD
# Edit the password below before running

# ========================================
# CONFIGURATION
# ========================================
PGPASSWORD='password here'
export PGPASSWORD

RDS_HOST="superscapes-poc.cipiqieiiyov.us-east-1.rds.amazonaws.com"
DB_USER="postgres"
PROD_DB="superscapes_poc_prod"
BACKUP_FILE="dev_backup.sql"

set -e  # Exit on error

echo "=========================================="
echo "Restoring DEV backup to PROD"
echo "=========================================="
echo ""

# Step 1: Kill existing connections
echo "Step 1: Killing existing connections to PROD..."
psql -h $RDS_HOST \
  -U $DB_USER \
  -d postgres \
  -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$PROD_DB' AND pid <> pg_backend_pid();"

echo "✓ Connections terminated"
echo ""

# Step 2: Drop PROD database
echo "Step 2: Dropping PROD database..."
psql -h $RDS_HOST \
  -U $DB_USER \
  -d postgres \
  -c "DROP DATABASE IF EXISTS $PROD_DB;"

echo "✓ PROD database dropped"
echo ""

# Step 3: Create PROD database
echo "Step 3: Creating PROD database..."
psql -h $RDS_HOST \
  -U $DB_USER \
  -d postgres \
  -c "CREATE DATABASE $PROD_DB;"

echo "✓ PROD database created"
echo ""

# Step 4: Restore backup to PROD
echo "Step 4: Restoring backup to PROD..."
psql -h $RDS_HOST \
  -U $DB_USER \
  -d $PROD_DB \
  -f $BACKUP_FILE

echo "✓ Backup restored"
echo ""

echo "=========================================="
echo "✓ Restore complete!"
echo "=========================================="

# Unset password
unset PGPASSWORD
