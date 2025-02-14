require('dotenv').config();

const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || 'localhost';

const notion = new Client({ auth: process.env.NOTION_AUTH });
const NOTION_SWOF = process.env.NOTION_SWOF_ID;
const NOTION_QTS = process.env.NOTION_QTS_ID;
const NOTION_PAY_TAILOR = process.env.NOTION_PAY_TAILOR_ID;
const NOTION_EXP_PROD = process.env.NOTION_EXP_PROD_ID;
const NOTION_EXP_ACC = process.env.NOTION_EXP_ACC_ID;
const NOTION_EXP_DETAIL = process.env.NOTION_EXP_DETAIL_ID;

const fetchNotionDatabase = async (databaseId) => {
    try {
        const response = await notion.databases.query({ database_id: databaseId });
        return response;
    } catch (error) {
        console.error("Notion API Error:", error.message);
        throw new Error("Failed to fetch Notion database");
    }
};

app.get('/notion-swof', async (req, res) => {
    try {
        const data = await fetchNotionDatabase(NOTION_SWOF);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/notion-qts', async (req, res) => {
    try {
        const data = await fetchNotionDatabase(NOTION_QTS);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/notion-exp-prod', async (req, res) => {
    try {
        const data = await fetchNotionDatabase(NOTION_EXP_PROD);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/notion-exp-acc', async (req, res) => {
    try {
        const data = await fetchNotionDatabase(NOTION_EXP_ACC);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/notion-exp-detail', async (req, res) => {
    try {
        const data = await fetchNotionDatabase(NOTION_EXP_DETAIL);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
