const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_key;
const supabase = createClient(supabaseUrl, supabaseKey)
const app = express();
app.use(bodyParser.json());

const monthly = async (req, res) => {
    const month = req.query.month
    const year = req.query.year
    let startDate = 0
    let endDate = 0

    if (month === '01' || month === '03' || month === "05" || month === '07' || month === '08' || month === '10' || month === '12') {
        startDate = `${year}/${month}/01`
        endDate = `${year}/${month}/31`
    }
    else if (month === '04' || month === '06' || month === '09' || month === '11') {
        startDate = `${year}/${month}/01`
        endDate = `${year}/${month}/30`
    }
    else {
        startDate = `${year}/02/01`
        endDate = `${year}/02/28`
    }

    const { data: validateData, error: validateError } = await supabase
        .from('sample')
        .select()
        .gt("Date", startDate)
        .lt("Date", endDate)

    if (validateError) {
        return res.status(404).json({ error: validateError.message });
    }
    if (!validateData || validateData.length === 0) {
        return res.status(404).json({ error: "No records found for the provided frequency" });
    } else {
        const { data: sampleData, error: fetchError } = await supabase
            .from('sample')
            .select('*')
            .gt("Date", startDate)
            .lt("Date", endDate)

        if (!sampleData) {
            return res.status(401).json({ error: "No Data" })
        }
        if (fetchError) {
            return res.status(401).json({ error: fetchError.message })
        } else {
            return res.status(200).json({ sampleData })
        }
    }


};

module.exports = monthly