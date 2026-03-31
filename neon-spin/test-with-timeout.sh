#!/bin/bash
# Redirect to the Node.js based test monitor for better reliability on Mac/Linux
npx tsx scripts/test-monitor.ts "$1"
