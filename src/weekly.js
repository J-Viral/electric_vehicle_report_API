const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

const app = express();
app.use(bodyParser.json());

const weakly = async (req, res) => {
    const startDate = req.query.startDate
    const endDate = req.query.endDate

    if(!startDate || !endDate) {
        return res.status(404).json({error: "Field Is empty!"})
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log("start : ", start, "end : ", end)
    // Calculate the difference in milliseconds
    const diff = end - start;

    // Calculate the difference in days
    const diffDays = diff / (1000 * 60 * 60 * 24);

    // Check if the difference is exactly 7 days
    if (diffDays !== 6) { // 6 because it's zero-based and includes both start and end dates
        return res.status(404).json({ error: 'Selected range is not a week range i.e. 7 days frequency. Please select a proper frequency.' });
    } else {

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
        
    }


};

module.exports = weakly
