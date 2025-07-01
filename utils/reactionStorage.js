const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/reactions.json');

// โหลดข้อมูลจากไฟล์
function loadReactions() {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            return new Set(JSON.parse(data));
        }
    } catch (error) {
        console.error('❌ Failed to load reactions:', error);
    }
    return new Set();
}

// บันทึกข้อมูลลงไฟล์
function saveReactions(reactionsSet) {
    try {
        const data = JSON.stringify([...reactionsSet], null, 2);
        fs.writeFileSync(filePath, data, 'utf-8');
    } catch (error) {
        console.error('❌ Failed to save reactions:', error);
    }
}

module.exports = { loadReactions, saveReactions };