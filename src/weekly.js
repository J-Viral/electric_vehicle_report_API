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

const weakly = async (req, res) => {
    const month = req.params.month
    const year = req.params.year

    if (month === '01' || month === '03' || month === "05" || month === '07' || month === '08' || month === '10' || month === '12') {
        const startDate = `01/${month}/${year}`
        const endDate = `31/${month}/${year}`
    }
    else if(month === '04' || month === '06' || month === '09' || month === '11') {
        const startDate = `01/${month}/${year}`
        const endDate = `30/${month}/${year}`
    }
    else {
        const startDate = `01/02/${year}`
        const endDate = `28/02/${year}`
    }



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
};

module.exports = weakly