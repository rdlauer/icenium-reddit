// based on icenium sample sqlite (https://github.com/Icenium/sample-sqlite)

var sqlite = function () {
	var defaultData = {
		subreddits: [
			{"name": "reddit Front Page"},
			{"name": "pics"},
			{"name": "funny"},
			{"name": "gaming"},
			{"name": "videos"},
			{"name": "IAmA"},
			{"name": "todayilearned"},
			{"name": "AdviceAnimals"},
			{"name": "movies"},
			{"name": "AskReddit"}
		]
	};
    
	// initialize and create our default table
	var init = function() {
		if (window.sqlitePlugin !== undefined) {
			sqlite.db = window.sqlitePlugin.openDatabase("reddit");
		}
		else {
			// For debugging in simulator fallback to native SQL Lite
			//console.log("Using built-in SQL Lite");
			sqlite.db = window.openDatabase("reddit", "1.0", "reddit on icenium demo", 200000);
		}
        
		sqlite.db.transaction(function(tx) {
			// create our table if it doesn't already exist
			tx.executeSql("CREATE TABLE IF NOT EXISTS subreddit (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)", []);
            
			// check to see if we already have records in our table - it not, populate with default values
			tx.executeSql("SELECT * FROM subreddit", [],
						  checkSubRedditCount,
						  logError);
		});
	}
    
	var checkSubRedditCount = function (tx, rs) {
		var self = this;
        
		if (rs.rows.length == 0) {
			$.each(defaultData.subreddits, function(index, data) {
				self.sqlite.insertRecord(data.name);
			});
		}
        
		getSubReddits(); // load our home view with our newly inserted list of subreddits
	}
    
	var logSuccess = function(tx) {
		console.log("SQLite Query Executed: " + tx);
	}
    
	var logError = function(tx, e) {
		console.log("SQLite Error: " + e);
	}
    
	var insertRecord = function(name) {
		sqlite.db.transaction(function(tx) {
			tx.executeSql("INSERT INTO subreddit (name) VALUES (?)", [name],
						  logSuccess,
						  logError);
		});
	}
    
	var deleteRecord = function(id) {
		sqlite.db.transaction(function(tx) {
			tx.executeSql("DELETE FROM subreddit WHERE ID=?", [id],
						  logSuccess,
						  logError);
		});
	}
    
    var selectAllSubReddits = function(fn) {
        sqlite.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM subreddit ORDER BY id", [],
                          fn,
					      logError);
	    });
    }   

	return {
		init: init,
		logSuccess: logSuccess,
		logError : logError,
		insertRecord: insertRecord,
		deleteRecord: deleteRecord,
        selectAllSubReddits: selectAllSubReddits
	}
}();