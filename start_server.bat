@echo off
cd /d D:\notionapi
start "Notion API Server" cmd /k "node server.js"
timeout /t 5
cd /d D:\notionapi\notioncms
start "Notion CMS" cmd /k "npm run dev -- --host"
