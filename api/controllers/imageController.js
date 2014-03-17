module.exports = function(LOG, models, imagePath){
    'use strict';
    LOG.info("Image Controller saving files to: " + imagePath);
    var charybdis = require("charybdis")();

    var path = require('path');
    var fsQ = require("q-io/fs");


    var generateName = function(basePath, prefix, suffix) {
        prefix = prefix || '';
        suffix = suffix || '';

        var now = new Date();
        var name = [prefix, "-",
                    now.getFullYear(), now.getMonth() +1, now.getDate(),
                    '-',
                    (Math.random() * 0x100000000 + 1).toString(36),
                    suffix].join('');
        return name;
    };


    var saveSnapshotImage = function saveSnapshotImage(pageId, contents){
        var filename = generateName(path, "snapshot", ".png");

        //Folder we save in
        var pathyPath = path.join(imagePath, pageId);
        //URI we give to the app
        var imageUri = path.join(pageId,filename);
        //Full name so we can actually save the file
        var fullPath = path.join(pathyPath, filename);

        LOG.info("Saving Snapshot for page: " + pageId + " to File: " + filename);
        return fsQ.makeTree(pathyPath)
            .then(function(){
                return fsQ.write(fullPath, contents)
                    .then(function(response){
                        LOG.info("Finished Saving File");
                        return imageUri;
                    })
                    .fail(function(error){
                        LOG.info("Error writing file for some reason");
                        throw new Error("SHITTY: " + error.message);
                    });

            });
    };


    return {
        saveSnapshotImage:saveSnapshotImage
    };
};