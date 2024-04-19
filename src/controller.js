const router = require('express').Router()
const dailyReport = require('./daily')
const weeklyReport = require('./weekly')
const monthlyReport = require('./monthly')
const yearlyReport = require('./yearly')

router.route('/get-daily-report').get(dailyReport)
router.route('/getweekly-report').get(weeklyReport)
router.route('/get-monthly-report').get(monthlyReport)
router.route('/get-yearly-report').get(yearlyReport)

module.exports = router