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

const yearly = async (req, res) => {
    const year = req.query.year

    if(!year) {
        return res.status(404).json({error: "Field Is empty!"})
    }
    const startDate = `${year}/01/01`
    const endDate = `${year}/12/31`

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

module.exports = yearly
