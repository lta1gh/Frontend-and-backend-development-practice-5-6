@echo off
start cmd /k "cd backend && node server.js"
start cmd /k "cd frontend && npm run dev"