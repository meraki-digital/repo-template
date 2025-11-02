#!/bin/bash

echo "🧪 Testing Superscapes Financial Mod 0002 Local Setup"
echo "==================================================="

# Test backend
echo ""
echo "🔍 Testing Backend API (port 8000)..."
if curl -s http://localhost:8000/api/system-variables > /dev/null 2>&1; then
    echo "✅ Backend API responding"

    # Test system variables
    VARS=$(curl -s http://localhost:8000/api/system-variables)
    if echo "$VARS" | grep -q "fiscal_year_start_month"; then
        echo "✅ System variables API working"
    else
        echo "❌ System variables API not returning expected data"
    fi

    # Test dashboard with date filtering
    DASHBOARD=$(curl -s "http://localhost:8000/api/dashboard?start_date=2024-01-01&end_date=2024-12-31")
    if echo "$DASHBOARD" | grep -q "kpis"; then
        echo "✅ Dashboard date filtering API working"
    else
        echo "❌ Dashboard API not working"
    fi
else
    echo "❌ Backend API not responding on port 8000"
fi

# Test frontend
echo ""
echo "🔍 Testing Frontend (port 5173)..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend responding"
    if curl -s http://localhost:5173 | grep -q "Superscapes"; then
        echo "✅ Frontend loading correctly"
    else
        echo "⚠️  Frontend loading but may have issues"
    fi
else
    echo "❌ Frontend not responding on port 5173"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Open http://localhost:5173 in your browser"
echo "2. Test the date range picker in the top-right"
echo "3. Change date ranges and verify dashboard updates"
echo "4. Try AI queries with date overrides like 'FY2024 revenue'"
echo "5. Click the Admin button to navigate to admin panel"

echo ""
echo "🎯 Mod 0002 Features to Test:"
echo "□ Date Range Picker (10 options)"
echo "□ Dashboard filtering"
echo "□ AI query date overrides"
echo "□ Admin navigation"
echo "□ localStorage persistence"
