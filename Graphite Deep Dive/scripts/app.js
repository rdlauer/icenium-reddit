// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
	navigator.splashscreen.hide();
	sqlite.init(); // initialize the database
}

// get a list of subreddits for our home view from our sqlite database
function getSubReddits() {
	var render = function (tx, rs) {
		var d = $.parseJSON(convertRStoJSON(rs));
		$("#subreddit-list").kendoMobileListView({
			dataSource: d,
			template: $("#subreddit-list-template").html(),
            style: "inset"
		});
	}
    
	if (sqlite.db) {
		sqlite.selectAllSubReddits(render);
	}
}

// get the top 25 submissions for the specified subreddit
function getSubRedditData(e) {
    var name = e.view.params.name;
    $("#subreddit-data-navbar").data("kendoMobileNavBar").title(name); // set the title in the nav bar
    
    if (name == "reddit Front Page") {
        name = "";
    } else {
        name = "r/" + name + "/";
    }
    
    $.getJSON("http://www.reddit.com/" + name + ".json?jsonp=?", function(data) { 
        //console.log(data.data.children);
        //console.log("loaded data for " + name);
		$("#subreddit-data").kendoMobileListView({
			dataSource: data.data.children,
			template: $("#subreddit-data-template").html(),
            style: "inset"
		});
    });
}

function toggleDeleteButtons() {
    if ($(".toggleButton").text() == "Edit") {
        $(".delete").show();
        $(".toggleButton").text("Done");
    } else {
        $(".delete").hide();
        $(".toggleButton").text("Edit");
    }
}

function openExternalURL(e) {
    var url = e.touch.target[0].attributes[2].nodeValue;
    if (window.plugins && window.plugins.childBrowser) {
        window.plugins.childBrowser.showWebPage(url);
    } else {
        console.log(url);
    }
}

function addSubReddit() {
    if ($("#txtNew").val().length == 0) return;
    sqlite.insertRecord($("#txtNew").val());
    $("#txtNew").val("");
    // refresh our listview with the new data
    var listView = $("#subreddit-list").data("kendoMobileListView");
    listView.refresh();
}

function removeSubReddit(e) {
    var data = e.button.data();
    sqlite.deleteRecord(data.id);
    $("a[data-id='" + data.id + "']").closest("li").remove();
}

function convertRStoJSON(rs) {
	var arr = [];
    for (var i = 0; i < rs.rows.length; i++) {
        arr.push(rs.rows.item(i));
    }
    return JSON.stringify(arr);
}