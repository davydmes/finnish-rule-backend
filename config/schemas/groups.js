'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const groupsSchema = new schema({
    name : String,
    inventoryMonitoring : Boolean,
    storageUnits : Boolean,
    columns : {
        productCode : Boolean,
        name : Boolean,
        additionalInformation : Boolean,
        inStore : Boolean,
        busy: Boolean,
        unit: Boolean,
        sellingPrice : Boolean,
        vat : Boolean,
        purchasePrice : Boolean,
        shelfLocation : Boolean,
        picture: Boolean,
        size : Boolean,
        thickness : Boolean
    }
});

const Groups = mongoose.model(config.groupsCollection, groupsSchema);

module.exports = Groups;