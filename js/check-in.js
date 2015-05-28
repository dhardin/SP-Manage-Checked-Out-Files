var check_in = (function() {
    var state_map = {
            $container: false,
            url: '',
            results: ''
        },
        jquery_map = {},
        populate_jquery_map, getListItems, getListGUIDfromURL, onFetchBtnClick, init;

    populate_jquery_map = function($container) {
        jquery_map.$list_textbox = $container.find('.list');
        jquery_map.$fetch_btn = $container.find('.fetch');
        jquery_map.$results = $container.find('.results');
    };

      // Begin Utility Method /getListItems/
    getListItems = function (url, guid, callback) {
        var results = [],
            soapEnv, body;

        // Build SOAP request envelope to match web service SOAP operation request XML.  
        // Don't forget to pass in required parameters!
        soapEnv =
            '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
  <soap12:Body>\
    <GetListItems xmlns="http://schemas.microsoft.com/sharepoint/soap/">\
      <listName>' + guid + '</listName>\
    </GetListItems>\
  </soap12:Body>\
</soap12:Envelope>';

        $.ajax({
            url: url + '_vti_bin/lists.asmx',
            type: 'POST',
            dataType: 'xml',
            contentType: 'application/soap+xml; charset="utf-8"',
            data: soapEnv, //pass in constructed SOAP envelope
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //handle any errors that are returned from Ajax call
                console.log(XMLHttpRequest + '\n\n' + textStatus + '\n\n' + errorThrown);
            },
            complete: function(xData, status) {
                //filter the response xml so we can easily parse each returned objects attributes
                var results = $(xData.responseXML).filterNode('z:row');

                // run callback if passed as argument
                if (callback) {
                    callback(xData.responseText);
                }
            }
        });
    };
    // End Utility Method /getListItems/
    getListGUIDfromURL = function(url, callback) {
        var results = [],
            soapEnv, body;

        // Build SOAP request envelope to match web service SOAP operation request XML.  
        // Don't forget to pass in required parameters!
        soapEnv = '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
  <soap12:Body>\
    <GetListCollection xmlns="http://schemas.microsoft.com/sharepoint/soap/" />\
  </soap12:Body>\
</soap12:Envelope>';

        $.ajax({
            url: url + '_vti_bin/lists.asmx',
            type: 'POST',
            dataType: 'xml',
            contentType: 'application/soap+xml; charset="utf-8"',
            data: soapEnv, //pass in constructed SOAP envelope
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //handle any errors that are returned from Ajax call
                console.log(XMLHttpRequest + '\n\n' + textStatus + '\n\n' + errorThrown);
            },
            complete: function(xData, status) {
                //filter the response xml so we can easily parse each returned objects attributes
                var results = $(xData.responseXML).filterNode('List');

                // run callback if passed as argument
                if (callback) {
                    callback(results);
                }
            }
        });
    };

    parseTo = function(fromString, parseToString){
    	var index = fromString.indexOf(parseToString);



    	return index > -1 ? fromString.substring(0, parseToString) : fromString;

    };


    onFetchBtnClick = function(e) {
        state_map.url = jquery_map.$list_textbox.val();

        if (state_map.url.length == 0) {
            return false;
        }

        state_map.url = parseTo(state_map.url, '/Forms');

        getListGUIDfromURL(state_map.url, function(guid){
        	
        	getListItems(state_map.url, guid, function(results){
        		console.log(results);
        	});
        });

    };

    init = function($container) {
        state_map.$container = $container;
        populate_jquery_map(state_map.$container);

        jquery_map.$fetch_btn.on('click', onFetchBtnClick);
    };

    return {
        init: init
    };
})();


 // This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
    // http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
    // for performance details.
    $.fn.filterNode = function (name) {
        return this.find('*').filter(function () {
            return this.nodeName === name;
        });
    }; // End $.fn.filterNode