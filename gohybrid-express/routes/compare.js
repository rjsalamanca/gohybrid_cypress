const express = require('express'),
    router = express.Router(),
    CompareModel = require('../models/compare.js');

router.post('/', async (req, res, next) => {
    const { user_id, html } = req.body
    const compareInstance = new CompareModel(null, user_id, html);
    const addCompareInstance = await compareInstance.addCompare();

    addCompareInstance.rowCount === 1 ? res.json({ addedCompare: true }) : res.json({ addedCompare: false });
});

router.post('/remove', async (req, res, next) => {
    const { comparison_id } = req.body;
    const remove = await CompareModel.removeComparison(comparison_id);

    remove.rowCount === 1 ? res.json({ removed: true }) : res.json({ removed: false });
});
module.exports = router;
