#!/bin/bash

# Sync DEV database to PROD
# Usage: ./sync-dev-to-prod.sh

set -e  # Exit on error

RDS_HOST="superscapes-poc.cipiqieiiyov.us-east-1.rds.amazonaws.com"
DB_USER="postgres"
DEV_DB="superscapes_poc"
PROD_DB="superscapes_poc_prod"
BACKUP_FILE="dev_backup.sql"

echo "=========================================="
echo "Syncing DEV → PROD"
echo "=========================================="
echo ""

# Step 1: Dump DEV
echo "Step 1: Dumping DEV database..."
pg_dump -h $RDS_HOST \
  -U $DB_USER \
  -d $DEV_DB \
  --no-owner --no-acl \
  -f $BACKUP_FILE

echo "✓ DEV dumped to $BACKUP_FILE"
echo ""

# Step 2: Drop and recreate PROD
echo "Step 2: Recreating PROD database..."
psql -h $RDS_HOST \
  -U $DB_USER \
  -d postgres \
  -c "DROP DATABASE IF EXISTS $PROD_DB;"

psql -h $RDS_HOST \
  -U $DB_USER \
  -d postgres \
  -c "CREATE DATABASE $PROD_DB;"

echo "✓ PROD database recreated"
echo ""

# Step 3: Restore to PROD
echo "Step 3: Restoring to PROD..."
psql -h $RDS_HOST \
  -U $DB_USER \
  -d $PROD_DB \
  -f $BACKUP_FILE

echo "✓ PROD restored"
echo ""

# Cleanup
echo "Cleaning up backup file..."
rm $BACKUP_FILE
echo "✓ Backup file removed"
echo ""

echo "=========================================="
echo "✓ Sync complete!"
echo "=========================================="
