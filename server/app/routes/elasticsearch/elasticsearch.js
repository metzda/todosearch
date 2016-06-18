var elasticsearch = require('elasticsearch');

var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var indexName = "randomindex";

/**
* Delete an existing index
*/
function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
* create the index
*/
function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

/**
* check if the index exists
*/
function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

/**
* Define how to map the data to be stored in elasticsearch
*/

function initMapping() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "document",
        body: {
            properties: {
                title: { type: "string" },
                suggest: {
                    type: "completion",
                    analyzer: "simple",
                    search_analyzer: "simple",
                    payloads: true
                }
            }
        }
    });
}
exports.initMapping = initMapping;

/**
* Add a document to the database leveraging its title, allowing for suggestions
* using the title split into an array of words for indexing
*/

function addDocument(document) {
    return elasticClient.index({
        index: indexName,
        type: "document",
        body: {
            title: document.title,
            suggest: {
                input: document.title.split(" "),
                output: document.title,
                payload: document.metadata || {}
            }
        }
    });
}
exports.addDocument = addDocument;

/**
* Deliver suggestions to the client
*/

function getSuggestions(input) {
    return elasticClient.suggest({
        index: indexName,
        type: "document",
        body: {
            docsuggest: {
                text: input,
                completion: {
                    field: "suggest",
                    fuzzy: true // this is where the magic happens
                }
            }
        }
    })
}
exports.getSuggestions = getSuggestions;
