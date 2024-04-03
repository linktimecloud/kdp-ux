#!/bin/bash

export PORT=3300

## Base Env ##
COMMON_HOST=localhost

# Mysql env
export DBUSERNAME=root
export DBPASSWORD=123456
export MYSQL_DATABASE=kdp_ux_db
export MYSQL_HOST=localhost
export MYSQL_PORT=3306

# Service env
export PROMETHEUS_SERVICE=http://localhost:9091
export LOKI_SERVICE=http://localhost:3100

export OAM_API_SERVER_DOMAIN=http://localhost:18000
export CATALOG_MANAGER_DOMAIN=http://localhost:8888

# CRON SET
export NIGHTLY_CRON_SET="0 3 * * *"

cd web && npm run dev
