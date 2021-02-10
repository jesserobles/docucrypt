#!/bin/bash
set -e

if [ ! -d "/app/node_modules" ]; then
    cd /app
    yarn global add @vue/cli && yarn install
fi

exec "$@"
