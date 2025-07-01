const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/msum-cache.json');

// โหลด cache จากไฟล์
function loadMsumCache() {
    try {
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf-8');
            const parsed = JSON.parse(raw);
            return {
                data: parsed.data || [],
                lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : null
            };
        }
    } catch (error) {
        console.error('❌ Failed to load MSUM cache:', error);
    }
    return { data: [], lastUpdated: null };
}

// บันทึก cache ลงไฟล์
function saveMsumCache(cache) {
    try {
        const content = JSON.stringify({
            data: cache.data,
            lastUpdated: cache.lastUpdated
        }, null, 2);
        fs.writeFileSync(filePath, content, 'utf-8');
    } catch (error) {
        console.error('❌ Failed to save MSUM cache:', error);
    }
}

module.exports = { loadMsumCache, saveMsumCache };
