const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const app = express();
app.use(bodyParser.json());

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhanNkcWZyeXFqcnFiemFpdm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzNDkyOTksImV4cCI6MjAyODkyNTI5OX0.2TnqT-QqiYYspw4H-akhLN5wXtDuXhrvW2P_GEOi-O4";
const supabase = createClient(supabaseUrl, supabaseKey)

const daily = async (req, res) => {
    const date = req.query.date

    const { data: validateData, error: validateError } = await supabase
        .from('sample')
        .select()
        .eq("Date", date)

    if (validateError) {
        return res.status(404).json({ error: validateError.message });
    }
    if (!validateData || validateData.length === 0) {
        return res.status(404).json({ error: "No records found for the provided date" });
    } else {
        const { data: sampleData, error: fetchError } = await supabase
            .from('sample')
            .select('*')
            .eq("Date", date)

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

module.exports = daily
