require('dotenv').config();

const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const bodyParser = require('body-parser');

const { saveReactions, loadReactions } = require('./utils/reactionStorage.js');
const { loadMsumCache, saveMsumCache } = require('./utils/msumCacheStorage');

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
const NOTION_EXP_PIM = process.env.NOTION_EXP_PIM_ID;
const NOTION_MSUM = process.env.NOTION_MSUM_ID;
// const NOTION_IMGSELECTORS = process.env.NOTION_IMGSELECTOR_ID;
const NOTION_FABRIC_INVENTORY = process.env.NOTION_FABRIC_INVENTORY_ID;
const NOTION_COLOR_CODE = process.env.NOTION_FABRIC_COLOR_CODE_ID;
const NOTION_SUPPLIER = process.env.NOTION_SUPPLIER_ID;
// const NOTION_INVENTORY_BY_TYPE = process.env.NOTION_INVENTORY_BY_TYPE_ID;

let notionCache = {
    swof: { data: [], lastUpdated: null },
    qts: { data: [], lastUpdated: null },
    expProd: { data: [], lastUpdated: null },
    expAcc: { data: [], lastUpdated: null },
    expDetail: { data: [], lastUpdated: null },
    expPim: { data: [], lastUpdated: null },
    payTailor: { data: [], lastUpdated: null },
    // imgSelectors: { data: [], lastUpdated: null },
    // msum: { data: [], lastUpdated: null },
    msum: loadMsumCache(),
    FabricInv: { data: [], lastUpdated: null },
    FabricColorCode: { data: [], lastUpdated: null },
    Supplier: { data: [], lastUpdated: null },
    // InventoryType: { data: [], lastUpdated: null },
};

const fetchAndCacheDatabase = async (databaseId, cacheKey) => {
    try {
        console.log(`Fetching data for ${cacheKey}...`);
        const allResults = [];

        let cursor = undefined;
        while (true) {
            const response = await notion.databases.query({
                database_id: databaseId,
                start_cursor: cursor,
                page_size: 100,
            });

            allResults.push(...response.results);

            if (!response.has_more) break;
            cursor = response.next_cursor;
        }

        notionCache[cacheKey].data = allResults;
        notionCache[cacheKey].lastUpdated = new Date();
        console.log(`✅ ${cacheKey} cached at`, notionCache[cacheKey].lastUpdated.toISOString());

        if (cacheKey === 'msum') {
            saveMsumCache(notionCache[cacheKey]); // ✨ บันทึกลงไฟล์
        }

    } catch (error) {
        console.error(`❌ Error fetching ${cacheKey}:`, error.message);
    }
};

const startAutoRefresh = () => {

    fetchAndCacheDatabase(NOTION_SWOF, 'swof');
    fetchAndCacheDatabase(NOTION_QTS, 'qts');
    fetchAndCacheDatabase(NOTION_EXP_PROD, 'expProd');
    fetchAndCacheDatabase(NOTION_EXP_ACC, 'expAcc');
    fetchAndCacheDatabase(NOTION_EXP_DETAIL, 'expDetail');
    fetchAndCacheDatabase(NOTION_EXP_PIM, 'expPim');
    fetchAndCacheDatabase(NOTION_PAY_TAILOR, 'payTailor');
    // fetchAndCacheDatabase(NOTION_IMGSELECTORS, 'imgSelectors');
    fetchAndCacheDatabase(NOTION_MSUM, 'msum');
    fetchAndCacheDatabase(NOTION_FABRIC_INVENTORY, 'FabricInv');
    fetchAndCacheDatabase(NOTION_COLOR_CODE, 'FabricColorCode');
    fetchAndCacheDatabase(NOTION_SUPPLIER, 'Supplier');
    // fetchAndCacheDatabase(NOTION_INVENTORY_BY_TYPE, 'InventoryType');
};

startAutoRefresh();

console.log(notionCache.expPim.data);

// --- Set interval every 5 minutes (300000 ms) ---
setInterval(startAutoRefresh, 5 * 60 * 1000);

app.get('/notion-swof', (req, res) => {
    res.status(200).json({
        results: notionCache.swof.data,
        lastUpdated: notionCache.swof.lastUpdated,
    });
});

app.get('/notion-qts', (req, res) => {
    res.status(200).json({
        results: notionCache.qts.data,
        lastUpdated: notionCache.qts.lastUpdated,
    });
});

app.get('/notion-exp-prod', (req, res) => {
    res.status(200).json({
        results: notionCache.expProd.data,
        lastUpdated: notionCache.expProd.lastUpdated,
    });
});

app.get('/notion-exp-acc', (req, res) => {
    res.status(200).json({
        results: notionCache.expAcc.data,
        lastUpdated: notionCache.expAcc.lastUpdated,
    });
});

app.get('/notion-exp-detail', (req, res) => {
    res.status(200).json({
        results: notionCache.expDetail.data,
        lastUpdated: notionCache.expDetail.lastUpdated,
    });
});

app.get('/notion-exp-pim', (req, res) => {
    res.status(200).json({
        results: notionCache.expPim.data,
        lastUpdated: notionCache.expPim.lastUpdated,
    });
});

app.get('/notion-pay-tailor', (req, res) => {
    res.status(200).json({
        results: notionCache.payTailor.data,
        lastUpdated: notionCache.payTailor.lastUpdated,
    });
});

// app.get('/notion-imgselectors', (req, res) => {
//     res.status(200).json({
//         results: notionCache.imgSelectors.data,
//         lastUpdated: notionCache.imgSelectors.lastUpdated,
//     });
// });

app.get('/notion-msum', (req, res) => {
    res.status(200).json({
        results: notionCache.msum.data,
        lastUpdated: notionCache.msum.lastUpdated,
    });
});

app.get('/notion-fabric-inventory', (req, res) => {
    res.status(200).json({
        results: notionCache.FabricInv.data,
        lastUpdated: notionCache.FabricInv.lastUpdated,
    });
});

app.get('/notion-fabric-color-code', (req, res) => {
    res.status(200).json({
        results: notionCache.FabricColorCode.data,
        lastUpdated: notionCache.FabricColorCode.lastUpdated,
    });
});

app.get('/notion-supplier', (req, res) => {
    res.status(200).json({
        results: notionCache.Supplier.data,
        lastUpdated: notionCache.Supplier.lastUpdated,
    });
});

// app.get('/notion-inventorytype', (req, res) => {
//     res.status(200).json({
//         results: notionCache.InventoryType.data,
//         lastUpdated: notionCache.InventoryType.lastUpdated,
//     });
// });

app.post('/refresh-cache', async (req, res) => {
    const { cacheKey } = req.body;

    const keyToIdMap = {
        swof: NOTION_SWOF,
        qts: NOTION_QTS,
        expProd: NOTION_EXP_PROD,
        expAcc: NOTION_EXP_ACC,
        expDetail: NOTION_EXP_DETAIL,
        expPim: NOTION_EXP_PIM,
        payTailor: NOTION_PAY_TAILOR,
        // imgSelectors: NOTION_IMGSELECTORS,
        msum: NOTION_MSUM,
        FabricInv: NOTION_FABRIC_INVENTORY,
        FabricColorCode: NOTION_COLOR_CODE,
        Supplier: NOTION_SUPPLIER,
        // InventoryType: NOTION_INVENTORY_BY_TYPE,
    };

    if (!cacheKey || !keyToIdMap[cacheKey]) {
        return res.status(400).json({ message: 'Invalid or missing cacheKey' });
    }

    try {
        await fetchAndCacheDatabase(keyToIdMap[cacheKey], cacheKey);
        res.status(200).json({ message: `✅ อัปเดตข้อมูลสำเร็จแล้ว` });
    } catch (error) {
        console.error(`❌ Error refreshing ${cacheKey}:`, error);
        res.status(500).json({ message: `❌ อัปเดตข้อมูลล้มเหลว` });
    }
});



// Replace the single 'likedItems' Set with three separate ones
let heartedItems = loadReactions();

app.get('/reactions', (req, res) => {
    res.status(200).json({
        hearts: Array.from(heartedItems),
    });
});


app.post('/react', (req, res) => {
    const { itemId, reactionType } = req.body;

    if (!itemId || reactionType !== 'heart') {
        return res.status(400).json({ message: 'itemId and valid reactionType are required' });
    }

    if (heartedItems.has(itemId)) {
        heartedItems.delete(itemId);
        console.log(`Item ${itemId} removed from hearts`);
    } else {
        heartedItems.add(itemId);
        console.log(`Item ${itemId} added to hearts`);
    }

    saveReactions(heartedItems);

    res.status(200).json({ message: `✅ heart status updated successfully` });
});

app.post('/reactions/clear', (req, res) => {
    try {
        heartedItems.clear();
        console.log('All heart reactions have been cleared.');

        saveReactions(heartedItems);
        
        res.status(200).json({ message: '✅ All heart reactions cleared successfully' });
    } catch (error) {
        console.error('Error clearing heart reactions:', error);
        res.status(500).json({ message: '❌ Failed to clear heart reactions' });
    }
});



app.listen(4000, '192.168.213.190', () => {
    console.log('Server is running on http://192.168.213.190:4000');
});

