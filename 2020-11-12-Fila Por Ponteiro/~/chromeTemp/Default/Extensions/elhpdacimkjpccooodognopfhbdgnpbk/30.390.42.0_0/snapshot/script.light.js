function injectSnapshotScripts(injectionId) {
    /* Here goes the wrapped snapshot script  */
 
var KasperskyLab = (function(ns) {
    ns.SESSION_ID = null;
    ns.SIGNATURE = injectionId;
   	ns.RES_SIGNATURE = injectionId.split('').reverse().join('');
    ns.PREFIX = "http://gc.kis.v2.scr.kaspersky-labs.com/";
    
    return ns;
})( KasperskyLab || {});
var KasperskyLab = (function(ns) {
    ns.PLUGINS_LIST = "light_ext";
    ns.LIGHT_PLUGIN_API_KEY = "klTabId_kis";
    
    return ns;
})( KasperskyLab || {});
 var KasperskyLab = (function (context) {
    context['JSONStringify'] = JSON.stringify;
    context['JSONParse'] = JSON.parse;
    return context;
}).call(this, KasperskyLab || {});
 var KasperskyLab = (function ( ns) {

	ns.MaxRequestDelay = 2000;

	ns.Log = function()
	{};

	ns.SessionLog = function()
	{};

	ns.GetDomainName = function() 
	{
	    return document.location.hostname;
	}

	var originalWindowOpen = window.open;

	ns.WindowOpen = function(url)
	{
		if (typeof(originalWindowOpen) === "function")
			originalWindowOpen.call(window, url);
		else
			originalWindowOpen(url);	
	}

	ns.EncodeURI = encodeURI;
	ns.GetResourceSrc = function () {};

	ns.AddEventListener = function(element, name, func)
	{
		if ("addEventListener" in element)
			element.addEventListener(name, 
				function(e) 
				{
					try
					{
						func(e || window.event);
					}
					catch (e)
					{
						ns.SessionLog(e);
					}
				}, true);
		else
			element.attachEvent("on" + name, 
				function(e)
				{
					try
					{
						func.call(element, e || window.event);
					}
					catch (e)
					{
						ns.SessionLog(e);
					}
				});
	};

	ns.AddRemovableEventListener = function ( element,  name,  func) {
		if (element.addEventListener)
			element.addEventListener(name, func, true);
		else
			element.attachEvent('on' + name, func);
	};

	ns.RunModule = function(func, timeout)
	{
		if (document.readyState === "loading")
		{
			if (timeout)
				ns.SetTimeout(func, timeout);

			if (document.addEventListener)
				ns.AddEventListener(document, "DOMContentLoaded", func);
			else
				ns.AddEventListener(document, "load", func);
		}
		else
		{
			func();
		}
	};
	ns.RemoveEventListener = function ( element,  name, func) {
		if (element.removeEventListener)
			element.removeEventListener(name, func, true);
		else
			element.detachEvent('on' + name, func);
	};

	ns.SetTimeout = function(func, timeout)
	{
		return setTimeout(
			function()
			{
				try
				{
					func();
				}
				catch (e)
				{
					ns.SessionLog(e);
				}
			}, timeout);
	}

	ns.SetInterval = function(func, interval)
	{
		return setInterval(
			function()
			{
				try
				{
					func();
				}
				catch (e)
				{
					ns.SessionLog(e);
				}
			}, interval);
	}

	function InsertStyleRule( style,  rule) {
		if (style.styleSheet)
		{
			style.styleSheet.cssText += rule + '\n';
		}
		else
		{
			style.appendChild(document.createTextNode(rule));
			ns.SetTimeout(
				function()
				{
					if (!style.sheet)
						return;
					var rules = style.sheet.cssRules || style.sheet.rules;
					if (rules && rules.length === 0)
						style.sheet.insertRule(rule);
				}, 500);
		}
	}

	ns.AddStyles = function (rules)
	{
		return ns.AddDocumentStyles(document, rules);
	}

	ns.AddDocumentStyles = function(document, rules)
	{
		if (typeof rules !== 'object' || rules.constructor !== Array) {
			return;
		}

        var styles = [];
		for (var i = 0, len = rules.length; i < len; )
		{
		    var style = document.createElement('style');
            style.type = 'text/css';
            style.setAttribute('nonce', ns.ContentSecurityPolicyNonceAttribute);

            for (var n = 0; n < 4 && i < len; ++n, ++i)
            {
                var rule = rules[i];
                if (document.querySelectorAll)
                {
                    InsertStyleRule(style, rule);
                }
                else
                {
                    var styleBegin = rule.lastIndexOf('{');
                    if (styleBegin == -1)
                        continue;

                    var styleText = rule.substr(styleBegin);
                    var selectors = rule.substr(0, styleBegin).split(',');
                    if (style.styleSheet)
                    {
                        var cssText = '';
                        for (var j = 0; j != selectors.length; ++j)
                            cssText += selectors[j] + styleText + '\n';

                        style.styleSheet.cssText += cssText;
                    }
                    else
                    {
                        for (var j = 0; j != selectors.length; ++j)
                            style.appendChild(document.createTextNode(selectors[j] + styleText));
                    }
                }
            }

            if (document.head)
                document.head.appendChild(style);
            else
                document.getElementsByTagName('head')[0].appendChild(style);

            styles.push(style);
		}

        return styles;
	};

	ns.AddCssLink = function(document, href, loadCallback, errorCallback)
	{
		var link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = href;
		if (loadCallback)
		{
			ns.AddEventListener(link, "load", function()
				{
					try
					{
						link && link.sheet && link.sheet.cssText;	
						loadCallback();
					}
					catch(e)
					{
						if (errorCallback)
							errorCallback();
					}
				});
		}
		if (errorCallback)
		{
			ns.AddEventListener(link, "error",
				function()
				{
					errorCallback();
					ns.SessionLog("failed load resource: " + href);
				});
		}

		if (document.head)
			document.head.appendChild(link);
		else
			document.getElementsByTagName("head")[0].appendChild(link);
	}

	ns.GetCurrentTime = function () {
		return new Date().getTime();
	};
	ns.GetPageScroll = function()
	{
		return {
				left: (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft,
				top: (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
			};
	};

	ns.GetPageHeight = function()
	{
		return document.documentElement.clientHeight || document.body.clientHeight;
	};

	ns.GetPageWidth = function()
	{
		return document.documentElement.clientWidth || document.body.clientWidth;
	};
	ns.IsDefined = function (variable)
	{
		return "undefined" !== typeof(variable);
	};
	ns.StopProcessingEvent = function(evt)
	{
		if (evt.preventDefault)
			evt.preventDefault();
		else
			evt.returnValue = false;
		if (evt.stopPropagation)
			evt.stopPropagation();
		if (ns.IsDefined(evt.cancelBubble))
			evt.cancelBubble = true;
	}

	ns.AddIframeDoctype = function(element)
	{
		var frameDocument = element.contentDocument || element.contentWindow.document;
		if (document.implementation && document.implementation.createDocumentType)
		{
			var newDoctype = document.implementation.createDocumentType('html', '', '');
			if (frameDocument.childNodes.length)
				frameDocument.insertBefore(newDoctype, frameDocument.childNodes[0]);
			else
				frameDocument.appendChild(newDoctype);
		}
	}

	function IsGoogleSearch(linkElement)
    {
        var parentTagName = linkElement.parentNode.tagName.toLowerCase();
        if (parentTagName === "div")
        {
            if (linkElement.className)
                return false;
        }
        else if (parentTagName !== "h3")
        {
            return false;
        }
        return linkElement.parentNode.className.toLowerCase() === "r";
	}

	function IsYandexSearch(linkElement)
	{
		if (linkElement.parentNode.tagName.toLowerCase() === "h2" && (
				linkElement.className.toLowerCase().indexOf("serp-item__title-link") !== -1 ||
				linkElement.className.toLowerCase().indexOf("b-serp-item__title-link") !== -1 ||
				linkElement.className.toLowerCase().indexOf("organic__url") !== -1))
		    return true;
        else
		    return false;
	}

	function IsYahooSearch(linkElement)
	{
		if (linkElement.className.toLowerCase().indexOf("ac-21th") !== -1)
			return true;
		return false;
	}
	function IsYahooLocalSearch(linkElement)
	{
		return IsYahooSearch(linkElement) || linkElement.className.toLowerCase().indexOf("td-u") !== -1;
	}

	function IsYahooCoSearch(linkElement)
	{
		if (linkElement.parentNode.tagName.toLowerCase() === "h3" &&
			linkElement.parentNode.parentNode &&
			linkElement.parentNode.parentNode.className.toLowerCase() === "hd")
			return true;
		return false;
	}

	function IsBingSearch(linkElement)
	{
		if (linkElement.parentNode.tagName.toLowerCase() !== "h2" || !linkElement.parentNode.parentNode)
			return false;
		if (linkElement.parentNode.parentNode.className.toLowerCase().indexOf("sb_tlst") !== -1 ||
			linkElement.parentNode.parentNode.className.toLowerCase().indexOf("b_algo") !== -1)
			return true;
		if (linkElement.parentNode.parentNode.parentNode &&
			linkElement.parentNode.parentNode.className.toLowerCase().indexOf("b_title") !== -1 &&
			linkElement.parentNode.parentNode.parentNode.className.toLowerCase().indexOf("b_algo") !== -1)
			return true;
		return false;
	}

	function IsMailRuSearch(linkElement)
	{
		if (linkElement.target.toLowerCase() === "_blank" && (
			linkElement.parentNode.className.toLowerCase() === "res-head" ||
			linkElement.parentNode.className.toLowerCase() === "result__title"))
			return true;
		return false;
	}

	function IsRamblerRuSearch(linkElement)
	{
		if (linkElement.className.toLowerCase() === "b-serp-item__link")
			return true;
		return false;
	}

	function IsBaiduComSearch(linkElement)
	{
		if (linkElement.parentNode.className.toLowerCase() === "t")
			return true;
		return false;
	}

	function IsBaiduJpSearch(linkElement)
	{
		if (linkElement.parentNode.tagName.toLowerCase() === "h3" &&
			linkElement.parentNode.parentNode &&
			linkElement.parentNode.parentNode.parentNode &&
			linkElement.parentNode.parentNode.parentNode.className.toLowerCase() === "web")
			return true;
		return false;
	}

	function IsAskComSearch(linkElement)
	{
		if (linkElement.className.toLowerCase() === "partialsearchresults-item-title-link result-link")
			return true;
		return false;
	}

	function NotSearchSite()
	{
		return false;
	}
	function DecodeURI(query)
	{
		return decodeURIComponent(query.replace(/\+/g, ' '));
	}

	function GetSearchRequest(parameterName, decodeUriFunc)
	{
		var parameters = document.location.href.split(/[?#&]/);
		var result = "";
		for (var i = 0; i < parameters.length; ++i) 
		{
			var parameter = parameters[i];
			var parameterSeparatorPos = parameter.indexOf("=");
			if (parameterSeparatorPos == -1)
				continue;
			if (parameter.substr(0, parameterSeparatorPos) != parameterName)
				continue;
			if (decodeUriFunc)
				result = decodeUriFunc(parameter.substr(parameterSeparatorPos + 1));
			else
				result = DecodeURI(parameter.substr(parameterSeparatorPos + 1));
		}
		return result;
	}

	function NotSearchSiteRequest()
	{
		return "";
	}

	function GetGeneralSearchSiteRequest()
	{
		return GetSearchRequest('q');
	}

	function GetYahooSearchSiteRequest()
	{
		return GetSearchRequest('p');
	}

	function GetYandexSearchSiteRequest()
	{
		return GetSearchRequest('text');
	}

	function GetRamblerSearchSiteRequest()
	{
		return GetSearchRequest('query');
	}
	function GetBaiduSearchSiteRequest()
	{
		return GetSearchRequest('wd');
	}


	function GetGoogleTypedSearchRequest()
	{
		var t = document.getElementById('lst-ib');
		if (t && t.tagName.toLowerCase() == "input")
			return t.value;
		else
			return ns.GetSearchSiteRequest();
	}
	try
	{
		var currentPageUrl = document.location.href;
		var schemeEndPos = currentPageUrl.indexOf("://");
		var linkFilterFunction;
		var getSearchSiteRequest;
		var getTypedRequest = null;
		if (schemeEndPos !== -1)
		{
			var host = currentPageUrl.substr(schemeEndPos + 3).toLowerCase();
			if (host.indexOf("www.google.") === 0)
			{
				linkFilterFunction = IsGoogleSearch;
				getSearchSiteRequest = GetGeneralSearchSiteRequest;
				getTypedRequest =  GetGoogleTypedSearchRequest;
			}
			else if (host.indexOf("yandex.") === 0 || host.indexOf("www.yandex.") === 0)
			{
				linkFilterFunction = IsYandexSearch;
				getSearchSiteRequest = GetYandexSearchSiteRequest;
			}
			else if (host.indexOf("search.yahoo.com") === 0)
			{
				linkFilterFunction = IsYahooSearch;
				getSearchSiteRequest = GetYahooSearchSiteRequest;
			}
			else if (host.indexOf("search.yahoo.co.") === 0)
			{
				linkFilterFunction = IsYahooCoSearch;
				getSearchSiteRequest = GetYahooSearchSiteRequest;
			}
			else if (host.indexOf("search.yahoo.com") !== -1)
			{
				linkFilterFunction = IsYahooLocalSearch;
				getSearchSiteRequest = GetYahooSearchSiteRequest;
			}
			else if (host.indexOf("www.bing.com") === 0)
			{
				linkFilterFunction = IsBingSearch;
				getSearchSiteRequest = GetGeneralSearchSiteRequest;
			}
			else if (host.indexOf("go.mail.ru") === 0)
			{
				linkFilterFunction = IsMailRuSearch;
				getSearchSiteRequest = GetGeneralSearchSiteRequest;
			}
			else if (host.indexOf("nova.rambler.ru") === 0)
			{
				linkFilterFunction = IsRamblerRuSearch;
				getSearchSiteRequest = GetRamblerSearchSiteRequest;
			}
			else if (host.indexOf("www.baidu.com") === 0)
			{
				linkFilterFunction = IsBaiduComSearch;
				getSearchSiteRequest = GetBaiduSearchSiteRequest;
			}
			else if (host.indexOf("www.baidu.jp") === 0)
			{
				linkFilterFunction = IsBaiduJpSearch;
				getSearchSiteRequest = GetBaiduSearchSiteRequest;
			}
			else if (host.indexOf("www.ask.com") === 0)
			{
				linkFilterFunction = IsAskComSearch;
				getSearchSiteRequest = GetGeneralSearchSiteRequest;
			}
			else
			{
				linkFilterFunction = NotSearchSite;
				getSearchSiteRequest = NotSearchSiteRequest;
			}			
		}
		ns.IsLinkSearchResult = linkFilterFunction;
		ns.GetSearchSiteRequest = getSearchSiteRequest;
		ns.GetTypedSearchRequest = getTypedRequest ? getTypedRequest : getSearchSiteRequest;
	}
	catch(e)
	{
		ns.IsLinkSearchResult = NotSearchSite;
		ns.GetSearchSiteRequest = NotSearchSiteRequest;
		ns.GetTypedSearchRequest = NotSearchSiteRequest;
	}

	function IsElementNode(node)
	{
		return node.nodeType === 1; 
	}

	function IsNodeContainsElementWithTag(node, observeTag)
	{
		return observeTag == "*" || (IsElementNode(node) && (node.tagName.toLowerCase() === observeTag || node.getElementsByTagName(observeTag).length > 0));
	}

	function MutationChangeObserver(observeTag)
	{
		var m_observer;
		var m_callback;
		var m_functionCheckInteresting = observeTag ? function(node){return IsNodeContainsElementWithTag(node, observeTag);} : IsElementNode;

		function ProcessNodeList(nodeList)
		{
			for (var i = 0; i < nodeList.length; ++i)
			{
				if (m_functionCheckInteresting(nodeList[i]))
					return true;
			}
			return false;
		}

		function ProcessDomChange(records)
		{
			if (!m_callback)
				return;

			for (var i = 0; i < records.length; ++i)
			{
				var record = records[i];
				if ((record.addedNodes.length && ProcessNodeList(record.addedNodes)) ||
					(record.removedNodes.length && ProcessNodeList(record.removedNodes)))
				{
					m_callback();
					return;
				}
			}
		}

		this.Start = function(callback)
		{
			m_callback = callback;
			m_observer = new MutationObserver(ProcessDomChange);
			m_observer.observe(document, { childList: true, subtree: true });
		};
		this.Stop = function()
		{
			m_observer.disconnect();
			m_callback = null;
		};
	}

	ns.GetDomChangeObserver = function(observeTag)
	{
		var observeTagLowerCase = observeTag ? observeTag.toLowerCase() : observeTag;
			return new MutationChangeObserver(observeTagLowerCase);
	}

	ns.StartLocationHref = document.location.href;

	return ns;
}) (KasperskyLab || {});
(function (ns) {
	function md5cycle(x, k) {
		var a = x[0],
		b = x[1],
		c = x[2],
		d = x[3];

		a = ff(a, b, c, d, k[0], 7, -680876936);
		d = ff(d, a, b, c, k[1], 12, -389564586);
		c = ff(c, d, a, b, k[2], 17, 606105819);
		b = ff(b, c, d, a, k[3], 22, -1044525330);
		a = ff(a, b, c, d, k[4], 7, -176418897);
		d = ff(d, a, b, c, k[5], 12, 1200080426);
		c = ff(c, d, a, b, k[6], 17, -1473231341);
		b = ff(b, c, d, a, k[7], 22, -45705983);
		a = ff(a, b, c, d, k[8], 7, 1770035416);
		d = ff(d, a, b, c, k[9], 12, -1958414417);
		c = ff(c, d, a, b, k[10], 17, -42063);
		b = ff(b, c, d, a, k[11], 22, -1990404162);
		a = ff(a, b, c, d, k[12], 7, 1804603682);
		d = ff(d, a, b, c, k[13], 12, -40341101);
		c = ff(c, d, a, b, k[14], 17, -1502002290);
		b = ff(b, c, d, a, k[15], 22, 1236535329);

		a = gg(a, b, c, d, k[1], 5, -165796510);
		d = gg(d, a, b, c, k[6], 9, -1069501632);
		c = gg(c, d, a, b, k[11], 14, 643717713);
		b = gg(b, c, d, a, k[0], 20, -373897302);
		a = gg(a, b, c, d, k[5], 5, -701558691);
		d = gg(d, a, b, c, k[10], 9, 38016083);
		c = gg(c, d, a, b, k[15], 14, -660478335);
		b = gg(b, c, d, a, k[4], 20, -405537848);
		a = gg(a, b, c, d, k[9], 5, 568446438);
		d = gg(d, a, b, c, k[14], 9, -1019803690);
		c = gg(c, d, a, b, k[3], 14, -187363961);
		b = gg(b, c, d, a, k[8], 20, 1163531501);
		a = gg(a, b, c, d, k[13], 5, -1444681467);
		d = gg(d, a, b, c, k[2], 9, -51403784);
		c = gg(c, d, a, b, k[7], 14, 1735328473);
		b = gg(b, c, d, a, k[12], 20, -1926607734);

		a = hh(a, b, c, d, k[5], 4, -378558);
		d = hh(d, a, b, c, k[8], 11, -2022574463);
		c = hh(c, d, a, b, k[11], 16, 1839030562);
		b = hh(b, c, d, a, k[14], 23, -35309556);
		a = hh(a, b, c, d, k[1], 4, -1530992060);
		d = hh(d, a, b, c, k[4], 11, 1272893353);
		c = hh(c, d, a, b, k[7], 16, -155497632);
		b = hh(b, c, d, a, k[10], 23, -1094730640);
		a = hh(a, b, c, d, k[13], 4, 681279174);
		d = hh(d, a, b, c, k[0], 11, -358537222);
		c = hh(c, d, a, b, k[3], 16, -722521979);
		b = hh(b, c, d, a, k[6], 23, 76029189);
		a = hh(a, b, c, d, k[9], 4, -640364487);
		d = hh(d, a, b, c, k[12], 11, -421815835);
		c = hh(c, d, a, b, k[15], 16, 530742520);
		b = hh(b, c, d, a, k[2], 23, -995338651);

		a = ii(a, b, c, d, k[0], 6, -198630844);
		d = ii(d, a, b, c, k[7], 10, 1126891415);
		c = ii(c, d, a, b, k[14], 15, -1416354905);
		b = ii(b, c, d, a, k[5], 21, -57434055);
		a = ii(a, b, c, d, k[12], 6, 1700485571);
		d = ii(d, a, b, c, k[3], 10, -1894986606);
		c = ii(c, d, a, b, k[10], 15, -1051523);
		b = ii(b, c, d, a, k[1], 21, -2054922799);
		a = ii(a, b, c, d, k[8], 6, 1873313359);
		d = ii(d, a, b, c, k[15], 10, -30611744);
		c = ii(c, d, a, b, k[6], 15, -1560198380);
		b = ii(b, c, d, a, k[13], 21, 1309151649);
		a = ii(a, b, c, d, k[4], 6, -145523070);
		d = ii(d, a, b, c, k[11], 10, -1120210379);
		c = ii(c, d, a, b, k[2], 15, 718787259);
		b = ii(b, c, d, a, k[9], 21, -343485551);

		x[0] = add32(a, x[0]);
		x[1] = add32(b, x[1]);
		x[2] = add32(c, x[2]);
		x[3] = add32(d, x[3]);

	}

	function cmn(q, a, b, x, s, t) {
		a = add32(add32(a, q), add32(x, t));
		return add32((a << s) | (a >>> (32 - s)), b);
	}

	function ff(a, b, c, d, x, s, t) {
		return cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}

	function gg(a, b, c, d, x, s, t) {
		return cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}

	function hh(a, b, c, d, x, s, t) {
		return cmn(b^c^d, a, b, x, s, t);
	}

	function ii(a, b, c, d, x, s, t) {
		return cmn(c^(b | (~d)), a, b, x, s, t);
	}

	function md51(s) {
		var n = s.length,
		state = [1732584193, -271733879, -1732584194, 271733878],
		i;
		for (i = 64; i <= s.length; i += 64) {
			md5cycle(state, md5blk(s.substring(i - 64, i)));
		}
		s = s.substring(i - 64);
		var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		for (i = 0; i < s.length; i++)
			tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
		tail[i >> 2] |= 0x80 << ((i % 4) << 3);
		if (i > 55) {
			md5cycle(state, tail);
			for (i = 0; i < 16; i++)
				tail[i] = 0;
		}
		tail[14] = n * 8;
		md5cycle(state, tail);
		return state;
	}

	function md5blk(s) {
		var md5blks = [],
		i;
		for (i = 0; i < 64; i += 4) {
			md5blks[i >> 2] = s.charCodeAt(i) +
				 (s.charCodeAt(i + 1) << 8) +
				 (s.charCodeAt(i + 2) << 16) +
				 (s.charCodeAt(i + 3) << 24);
		}
		return md5blks;
	}

	var hex_chr = '0123456789abcdef'.split('');

	function rhex(n) {
		var s = '',
		j = 0;
		for (; j < 4; j++)
			s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]+hex_chr[(n >> (j * 8)) & 0x0F];
		return s;
	}

	function hex(x) {
		for (var i = 0; i < x.length; i++)
			x[i] = rhex(x[i]);
		return x.join('');
	}

	ns.md5 = function (s) {
		return hex(md51(s));
	};


	function add32(a, b) {
		return (a + b) & 0xFFFFFFFF;
	}

	if (ns.md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
		add32 = function(x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF),
			msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}
	}

})(KasperskyLab || {});
var KasperskyLab = (function ( ns) {

ns.NMSTransportSupported = false;

return ns;
}) (KasperskyLab || {});


var KasperskyLab = (function (ns)
{

ns.AjaxTransportSupported = true;

var ajaxRequestProvider = (function ()
	{
		var oldOpen = window.XMLHttpRequest && window.XMLHttpRequest.prototype.open;
		var oldSend = window.XMLHttpRequest && window.XMLHttpRequest.prototype.send;
		var oldXHR = window.XMLHttpRequest;
		var oldXDR = window.XDomainRequest;

		return {
			GetAsyncRequest: function ()
				{
					var xmlhttp = oldXDR ? new oldXDR() : new oldXHR();
					if (!oldXDR) {
						xmlhttp.open = oldOpen;
						xmlhttp.send = oldSend;
					}
					xmlhttp.onprogress = function(){};
					return xmlhttp;
				},
			GetSyncRequest: function ()
				{
					var xmlhttp = new oldXHR();
					xmlhttp.open = oldOpen;
					xmlhttp.send = oldSend;
					xmlhttp.onprogress = function(){};
					return xmlhttp;
				}
		};
	})();

var restoreSessionCallback = function(){};

var PingPongCallReceiver = function(caller)
{
	var m_caller = caller;
	var m_isProductConnected = false;
	var m_pingWaitResponse = false;
	var m_requestDelay = ns.MaxRequestDelay;
	var m_requestTimer = null;
	var m_callCallback = function(){};
	var m_errorCallback = function(){};
	var m_updateCallback = function(){};

	function SendRequest()
	{
		try 
		{
			m_caller.Call(
				"from",
				null,
				null,
				 true,
				function(result, parameters, method)
				{
					m_pingWaitResponse = false;
					m_isProductConnected = true;

					if (parameters === "undefined" || method === "undefined") 
					{
						m_errorCallback('AJAX pong is not received. Product is deactivated');
						return;
					}

					if (method)
					{
						ns.SetTimeout(function () { SendRequest(); }, 0);
						m_callCallback(method, parameters);
					}
				},
				function(error)
				{
					m_pingWaitResponse = false;
					m_isProductConnected = false;
					restoreSessionCallback();
					m_errorCallback(error);
				});

			m_pingWaitResponse = true;
		}
		catch (e)
		{
			m_errorCallback('Ajax send ping exception: ' + (e.message || e));
		}
	}

	function Ping()
	{
		try
		{
			if (m_pingWaitResponse)
			{
				m_requestTimer = ns.SetTimeout(Ping, 100);
				return;
			}

			m_requestDelay = m_updateCallback();

			SendRequest();
			m_requestTimer = ns.SetTimeout(Ping, m_requestDelay);
		}
		catch (e)
		{
			m_errorCallback('Send ping request: ' + (e.message || e));
		}
	}

	this.StartReceive = function(callCallback, errorCallback, updateCallback)
	{
		m_callCallback = callCallback;
		m_errorCallback = errorCallback;
		m_updateCallback = updateCallback;

		m_requestDelay = m_updateCallback();
		m_requestTimer = ns.SetTimeout(Ping, m_requestDelay);
	};
	this.ForceReceive = function()
	{
		clearTimeout(m_requestTimer);
		m_requestTimer = ns.SetTimeout(Ping, 0);
	}
	this.StopReceive = function()
	{
		clearTimeout(m_requestTimer);
		m_requestTimer = null;
		m_callCallback = function(){};
		m_errorCallback = function(){};
		m_updateCallback = function(){};
	};
	this.IsStarted = function()
	{
		return m_requestTimer !== null;
	}
	this.IsProductConnected = function()
	{
		return m_isProductConnected;
	};
};

var LongPoolingReceiver = function(caller)
{
	var m_caller = caller;
	var m_isProductConnected = false;
	var m_isStarted = false;
	var m_callCallback = function(){};
	var m_errorCallback = function(){};

	function SendRequest()
	{
		try 
		{
			m_isProductConnected = true;

			m_caller.Call(
				"longpooling",
				null,
				null,
				 true,
				OnResponse,
				function(error)
				{
					m_isProductConnected = false;
					restoreSessionCallback();
					m_errorCallback(error);
				},
				true);
		}
		catch (e)
		{
			ns.SessionLog(e);
			m_errorCallback("Ajax send ping exception: " + (e.message || e));
		}
	}

	function OnResponse(result, parameters, method)
	{
		if (!ns.IsDefined(parameters) || !ns.IsDefined(method))
		{
			m_errorCallback('AJAX pong is not received. Product is deactivated');
			return;
		}

		ns.SetTimeout(function () { SendRequest(); }, 0);

		if (method)
			m_callCallback(method, parameters);
	}

	this.StartReceive = function(callCallback, errorCallback)
	{
		m_isStarted = true;
		m_callCallback = callCallback;
		m_errorCallback = errorCallback;
		SendRequest();
	};
	this.ForceReceive = function(){}
	this.StopReceive = function()
	{
		m_isStarted = false;
		m_callCallback = function(){};
		m_errorCallback = function(){};
	};
	this.IsStarted = function()
	{
		return m_isStarted;
	}
	this.IsProductConnected = function()
	{
		return m_isProductConnected;
	};
};

ns.AjaxCaller = function()
{
	var m_path = ns.PREFIX + ns.SIGNATURE;
	var m_longPooling;
	var m_longPoolingRequest;

	function NoCacheParameter() 
	{
		return "&nocache=" + Math.floor((1 + Math.random()) * 0x10000).toString(16);
	}

	function GetSpecialPlugins(predefined) 
	{
		return (predefined) ? "&plugins=" + encodeURIComponent(predefined) : "";
	}

	function PrepareRequestObject(command, commandAttribute, isPost, isAsync)
	{
		var request = isAsync ? ajaxRequestProvider.GetAsyncRequest() : ajaxRequestProvider.GetSyncRequest();
		if (request)
		{
			var urlPath = m_path + "/" + command;
			if (commandAttribute)
				urlPath += "/" + commandAttribute;

			if (isPost)
			{
				request.open("POST", urlPath);
			}
			else
			{
				if (urlPath.indexOf("?") === -1)
					urlPath += "?get";
				urlPath += NoCacheParameter();
				request.open("GET", urlPath, isAsync);
			}
		}
		return request;
	}

	function ClearRequest(request)
	{
		request.onerror = function(){};
		request.onload = function(){};
	}

	function AsyncCall(command, commandAttribute, data, callbackResult, callbackError, isLongPoolingCall)
	{
		try
		{
			var request = PrepareRequestObject(command, commandAttribute, data ? true : false, true);
			if (!request) 
			{
				callbackError && callbackError("Cannot create AJAX request!");
				return;
			}

			if (!m_longPooling)
			{
				var timeout = ns.SetTimeout(function () 
					{
						callbackError && callbackError("Cannot send AJAX request for calling " + command + "/" + commandAttribute);
						request.abort();
						ClearRequest(request);
					}, 120000);
			}

			request.onerror = function ()
				{
					clearTimeout(timeout);
					ClearRequest(request);
					callbackError && callbackError("AJAX request error for calling " + command + "/" + commandAttribute);
				};

			request.onload = function ()
				{
					clearTimeout(timeout);
					ClearRequest(request);

					if (request.responseText)
					{
						if (callbackResult)
							callbackResult(request.responseText);
						return;
					}

					if (callbackError)
						callbackError("AJAX request with unsupported url type!"); 
				};

			if (isLongPoolingCall)
				m_longPoolingRequest = request;

			request.send(data);
			ns.Log("Call native function " + command + "/" + commandAttribute);
		}
		catch (e)
		{
			if (callbackError)
				callbackError("AJAX request " + command  + "/" + commandAttribute + " exception: " + (e.message || e));
		}
	};

	function SyncCall(command, commandAttribute, data, callbackResult, callbackError)
	{
		try
		{
			var request = PrepareRequestObject(command, commandAttribute + "?" + ns.EncodeURI(data), false, false);
			if (!request)
			{
				callbackError && callbackError("Cannot create AJAX request!");
				return false;
			}

			request.send();
			if (request.status === 200)
			{
				if (callbackResult && request.responseText)
					callbackResult(request.responseText);
				request = null;
				return true;
			}
		}
		catch (e)
		{
			if (callbackError)
				callbackError("AJAX request " + command + " exception: " + (e.message || e));
		}
		return false;
	}

	this.Start = function(callbackSuccess)
	{
		callbackSuccess();
	}

	this.SendLog = function(message)
	{
		AsyncCall("log?" + encodeURIComponent(message));
	}

	this.Call = function(command, commandAttribute, data, isAsync, callbackResult, callbackError, isLongPoolingCall) 
	{
		var callFunction = (isAsync || !ns.IsDefined(isAsync)) ? AsyncCall : SyncCall;
		return callFunction(
			command,
			commandAttribute,
			data,
			function(responseText)
			{
				var commandResponse = ns.JSONParse(responseText);
				if (commandResponse.result === -1610612735)
				{
					callFunction(
						command,
						commandAttribute,
						data,
						function(responseText)
						{
							if (!callbackResult)
								return;

							commandResponse = ns.JSONParse(responseText);
							callbackResult(commandResponse.result, commandResponse.parameters, commandResponse.method);
						},
						callbackError,
						isLongPoolingCall);
				}
				else
				{
					if (callbackResult)
						callbackResult(commandResponse.result, commandResponse.parameters, commandResponse.method);
				}
			},
			callbackError,
			isLongPoolingCall);
	}
	this.Shutdown = function()
	{
		if (m_longPoolingRequest != undefined)
		{
			m_longPoolingRequest.abort();
			m_longPoolingRequest = undefined;
		}
	}

	this.InitCall = function(pluginsInitData, callbackResult, callbackError)
	{
		restoreSessionCallback = callbackError;
		var specialPlugins = GetSpecialPlugins(ns.PLUGINS_LIST);
		var serializedInitData = (pluginsInitData.length) ? "&data=" + encodeURIComponent(ns.JSONStringify({data : pluginsInitData})) : "";
		var isTopLevel = "&isTopLevel=" + (window && window == window.top).toString();

		if (ns.StartLocationHref == "data:text/html,chromewebdata")
			return callbackError();

		AsyncCall(
			"init?url=" + encodeURIComponent(ns.StartLocationHref) + specialPlugins + serializedInitData + isTopLevel,
			null,
			null,
			function(responseText)
			{
				try
				{
					var initSettings = ns.JSONParse(responseText);
					m_path = (ns.PREFIX || '/') + initSettings.ajaxId + '/' + initSettings.sessionId;
					m_longPooling = initSettings.longPooling;
					callbackResult(initSettings);
				} catch(e)
				{
					restoreSessionCallback && restoreSessionCallback("Error " + e.name + ": " + e.message);
				}
			},
			callbackError);
	}

	this.GetReceiver = function()
	{
		return m_longPooling ? new LongPoolingReceiver(this) : new PingPongCallReceiver(this);
	}
};

return ns;
}) (KasperskyLab || {});
var KasperskyLab = (function ( ns) {

ns.WebSocketTransportSupported = ns.IsDefined(window.WebSocket);
if (!ns.WebSocketTransportSupported)
	return ns;

var webSocketProvider = function()
	{
		var WebSocketObject = WebSocket;
		var WebSocketSend = WebSocket.prototype.send;
		var WebSocketClose = WebSocket.prototype.close;

		return {
			GetWebSocket: function(path)
			{
				var webSocket = new WebSocketObject(path);
				webSocket.send = WebSocketSend;
				webSocket.close = WebSocketClose;
				return webSocket;
			}
		}
	}();

ns.WebSocketCaller = function()
{
	var m_socket;
	var m_waitResponse = {};
	var m_callReceiver = function(){};
	var m_errorCallback = function(){};
	var m_callReceiverEnabled = false;
	var m_connected = false;
	var m_initialized = false;
	var m_deferredCalls = [];
	var m_wasCallbackErrorCalled = false;

	function GetWebSocket(callbackSuccess, callbackError)
	{
		var url = (ns.PREFIX === "/") 
			? document.location.protocol + "//" + document.location.host + ns.PREFIX 
			: ns.PREFIX;

		var webSocketPath = (url.indexOf("https:") === 0) 
			? "wss" + url.substr(5)
			: "ws" + url.substr(4);
		webSocketPath += ns.SIGNATURE + "/websocket?url=" + encodeURIComponent(ns.StartLocationHref) + "&nocache=" + (new Date().getTime());

		var webSocket;
		try
		{
			webSocket = webSocketProvider.GetWebSocket(webSocketPath);
		}
		catch (e)
		{
			throw e;
		}

		webSocket.onmessage = function(arg)
			{
				ProcessMessage(arg, callbackError);
			};
		webSocket.onerror = function()
			{
				if (!m_wasCallbackErrorCalled && callbackError)
					callbackError();
				m_wasCallbackErrorCalled = true;
			}
		webSocket.onopen = function()
			{
				m_wasCallbackErrorCalled = false;
				m_connected = true;
				if (callbackSuccess)
					callbackSuccess();
			}
		webSocket.onclose = function(closeEvent)
			{
				m_connected = false;
				if (closeEvent && closeEvent.code == 1006)
					webSocket.onerror(closeEvent);

				m_errorCallback("websocket closed");
			};
		return webSocket;
	}

	function ProcessMessage(arg, errorCallback)
	{
		try
		{
			m_wasCallbackErrorCalled = false;
			var response = ns.JSONParse(arg.data);
			if (m_waitResponse[response.callId])
			{
				var callWaiter = m_waitResponse[response.callId];
				delete m_waitResponse[response.callId];
				clearTimeout(callWaiter.timeout);
				if (callWaiter.callbackResult)
					callWaiter.callbackResult(response.commandData);
				return;
			}

			if (!m_initialized)
			{
				m_deferredCalls.push(arg);
				return;
			}
			if (response.command === "from")
			{
				var command = ns.JSONParse(response.commandData);
				m_callReceiver(command.method, command.parameters);
			}
			else if (response.command === "reconnect")
			{
				m_socket.onmessage = function(){};
				m_socket.onerror = function(){};
				m_socket.onopen = function(){};
				m_socket.onclose = function(){};
				m_socket.close();

				m_socket = GetWebSocket(function()
					{
						CallImpl("restore", "", response.commandData);
					},
					errorCallback);
			}
		}
		catch (e)
		{
			ns.SessionLog(e)
		}
	}

	function CallImpl(command, commandAttribute, data, callbackResult, callbackError)
	{
		try
		{
			var callId = 0;
			if (callbackResult || callbackError)
			{
				callId = Math.floor((1 + Math.random()) * 0x10000);
				var timeout = ns.SetTimeout(function()
					{
						delete m_waitResponse[callId];
						if (callbackError)
							callbackError("websocket call timeout for " + command  + "/" + commandAttribute);
					}, 120000);
				var callWaiter = 
					{
						callId: callId,
						callbackResult: callbackResult,
						timeout: timeout
					};
				m_waitResponse[callId] = callWaiter;
			}

			m_socket.send(ns.JSONStringify(
				{
					callId: callId,
					command: command,
					commandAttribute: commandAttribute || "",
					commandData: data || ""
				}));
		}
		catch (e)
		{
			if (callbackError)
				callbackError("websocket call " + command  + "/" + commandAttribute + " exception: " + (e.message || e));
		}
	}
	this.Start = function(callbackSuccess, callbackError)
	{
		try
		{
			m_socket = GetWebSocket(callbackSuccess, callbackError);
		}
		catch (e)
		{
			if (callbackError)
				callbackError("websocket start exception: " + (e.message || e));
		}
	}
	this.SendLog = function(message)
	{
		CallImpl("log", null, message);
	}

	this.Call = function(command, commandAttribute, data, isAsync, callbackResult, callbackError) 
	{
		if (ns.IsDefined(isAsync) && !isAsync)
			return false;

		CallImpl(
			command, 
			commandAttribute, 
			data,
			callbackResult 
				? 	function(responseText)
					{
						if (callbackResult)
						{
							var command = ns.JSONParse(responseText);
							callbackResult(command.result, command.parameters, command.method);
						}
					}
				: null,
			callbackError);
	}

	this.InitCall = function(pluginsInitData, callbackResult, callbackError)
	{
		var initData = 
			{
				url: ns.StartLocationHref,
				plugins: ns.PLUGINS_LIST,
				data: { data : pluginsInitData },
				isTopLevel: (window && window == window.top)
			};
		if (ns.StartLocationHref == "data:text/html,chromewebdata")
			return callbackError();

		CallImpl("init", null, ns.JSONStringify(initData),
			function(responseText)
			{
				m_initialized = true;
				var initSettings = ns.JSONParse(responseText);
				if (initSettings.Shutdown !== undefined)
					return;
				callbackResult(initSettings);

				for (var i = 0; i < m_deferredCalls.length; ++i)
					ProcessMessage(m_deferredCalls[i], callbackError);
				m_deferredCalls = [];
			},
			callbackError);
	}

	this.GetReceiver = function()
	{
		return this;
	}

	this.StartReceive = function(callMethod, errorCallback)
	{
		m_callReceiverEnabled = true;
		m_callReceiver = callMethod;
		m_errorCallback = errorCallback;
	}

	this.ForceReceive = function(){};

	this.StopReceive = function()
	{
		m_callReceiverEnabled = false;
		m_callReceiver = function(){};
		m_errorCallback = function(){};
		if (m_socket)
		{
			m_connected = false;
			m_socket.onmessage = function(){};
			m_socket.onerror = function(){};
			m_socket.onopen = function(){};
			m_socket.onclose = function(){};
			m_socket.close();
			m_socket = null;
		}
	}

	this.IsStarted = function()
	{
		return m_callReceiverEnabled;
	}

	this.IsProductConnected = function()
	{
		return m_connected;
	}
}

return ns;
}) (KasperskyLab || {});
var kaspersyLabSessionInstance = null;
(function ( ns) {
	var currentLocationHref = document.location.href;

	if (ns.WORK_IDENTIFIERS)
	{
		var workIdentifiers = ns.WORK_IDENTIFIERS.split(",");
		for (var i = 0; i < workIdentifiers.length; ++i)
		{
			if (window[workIdentifiers[i]])
			{
				ns.AddRunner = function(){};
				return;
			}
			window[workIdentifiers[i]] = true;
		}
	}

	if (ns.INJECT_ID)
		removeThisScriptElement(ns.INJECT_ID);

	function removeThisScriptElement(injectId)
	{
		var pattern = injectId.toLowerCase();
		for (var i = 0, scriptsCount = document.scripts.length; i < scriptsCount; ++i) 
		{
			var tag = document.scripts[i];
			if (typeof tag.src === 'string' && tag.src.length > 45 &&
				tag.src.toLowerCase().indexOf(pattern) > 0 &&
				/\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/main.js/.test(tag.src))
			{
				tag.parentElement.removeChild(tag);
				break; 
			}
		}
	}

	var CallReceiver = function (caller) {
		var m_plugins = {};
		var m_receiver = caller.GetReceiver();
		var m_caller = caller;

		this.RegisterMethod = function (methodName, callback) {
			var pluginId = GetPluginIdFromMethodName(methodName);
			if (pluginId) {
				var methods = GetPluginMethods(pluginId);
				if (methods) {
					if (methods[methodName]) {
						throw 'Already registered method ' + methodName;
					}
					methods[methodName] = callback;
				}
				else {
					throw 'Cannot registered ' + methodName;
				}
			}
		};

		this.RegisterPlugin = function (pluginId, callbackPing, callbackError) {
			if (m_plugins[pluginId]) {
				throw 'Already started plugin ' + pluginId;
			}

			var plugin = {
				onError: callbackError,
				onPing: callbackPing,
				methods: {}
			};

			m_plugins[pluginId] = plugin;

			if (!m_receiver.IsStarted())
				m_receiver.StartReceive(CallMethod, ReportError, UpdateDelay);
		};

		this.UnregisterPlugin = function (pluginId) {
			delete m_plugins[pluginId];

			if (IsPluginListEmpty())
				m_receiver.StopReceive();
		};

		this.ForceReceive = function()
		{
			m_receiver.ForceReceive();
		}

		this.UnregisterAll = function () {
			if (IsPluginListEmpty())
				return;
			m_receiver.StopReceive();
			m_plugins = {};
		};

		this.IsEmpty = IsPluginListEmpty;

		function IsPluginListEmpty() {
			for (var key in m_plugins) {
				if (m_plugins.hasOwnProperty(key))
					return false;
			}
			return true;
		}
		this.IsProductConnected = function()
		{
			return m_receiver.IsProductConnected();
		}

		function UpdateDelay() {
			var newDelay = ns.MaxRequestDelay;
			var currentTime = ns.GetCurrentTime();

			for (var pluginId in m_plugins) {
				try {
					var onPing = m_plugins[pluginId].onPing;
					if (onPing) {
						var delay = onPing(currentTime);
						if (delay < newDelay && delay > 0 && delay < ns.MaxRequestDelay) {
							newDelay = delay;
						}
					}
				}
				catch (e) {
					ReportPluginError(pluginId, 'UpdateDelay: ' + (e.message || e));
				}
			}

			return newDelay;
		}

		function ReportPluginError(pluginId, status) {
			var onError = m_plugins[pluginId].onError;
			if (onError)
				onError(status);
		}

		function ReportError(status) {
			for (var pluginId in m_plugins)
				ReportPluginError(pluginId, status);
		}

		function GetPluginIdFromMethodName(methodName) {
			if (methodName) {
				var names = methodName.split('.', 2);
				if (names.length === 2) {
					return names[0];
				}
			}
			return null;
		}

		function GetPluginMethods(pluginId) {
			var plugin = m_plugins[pluginId];
			return plugin ? plugin.methods : null;
		}

		function CallPluginMethod(pluginId, methodName, args) {
			var methods = GetPluginMethods(pluginId);
			if (methods) {
				var callback = methods[methodName];
				if (callback) {
					try {						
						if (args)
							callback(ns.JSONParse(args));
						else
							callback();
						m_caller.SendLog(methodName + " executed.");
						return true;
					}
					catch (e) {
						m_caller.SendLog("Call " + methodName + " in plugin " + pluginId + " error: " + (e.message || e));
					}
				}
			}
			m_caller.SendLog("Cannot call " + methodName + " for plugin " + pluginId);
			return false;
		}
		function CallMethod(methodName, args)
		{
			ns.Log("Try to find js callback " + methodName);
			var pluginId = GetPluginIdFromMethodName(methodName);
			if (pluginId)
				CallPluginMethod(pluginId, methodName, args);
		}
	};

	var KasperskyLabSessionClass = function (caller) {
		var self = this;
		var m_caller = caller;
		var m_callReceiver = new CallReceiver(caller);

		function CallImpl(methodName, argsObj, callbackResult, callbackError, isAsync) {
			var data = (argsObj) 
				? ns.JSONStringify(
					{
						result: 0,
						method: methodName,
						parameters: ns.JSONStringify(argsObj)
					})
				: null;
			var callback = function(result, args, method)
				{
					if (callbackResult)
						callbackResult(result, args ? ns.JSONParse(args) : null, method);
				};
			return m_caller.Call("to", methodName, data, isAsync, callback, callbackError);
		}

		function Call(methodName, arrayOfArgs, callbackResult, callbackError) {
			CallImpl(methodName, arrayOfArgs, callbackResult, callbackError, true);
		}

		function SyncCall(methodName, arrayOfArgs, callbackResult, callbackError) {
			return CallImpl(methodName, arrayOfArgs, callbackResult, callbackError, false);
		}

		function Stop() {
			try {
				m_callReceiver.UnregisterAll();
				ns.Log("session stopped");
				if (m_callReceiver.IsProductConnected())
				{
					if (!m_caller.Call("shutdown", null, null, false))
						m_caller.Call("shutdown");
				}

				if (m_caller.Shutdown)
					m_caller.Shutdown();				
			}
			catch (e) {
			}
		}

		function DeactivatePlugin(pluginId) {
			ns.Log('DeactivatePlugin ' + pluginId);
			m_callReceiver.UnregisterPlugin(pluginId);
			if (m_callReceiver.IsEmpty()) {
				Stop();
			}
		}

		function ActivatePlugin(pluginId, callbackPing, callbackError) {
			ns.Log('ActivatePlugin ' + pluginId);

			m_callReceiver.RegisterPlugin(pluginId, callbackPing, function (e) {
				callbackError && callbackError(e);
				m_callReceiver.UnregisterPlugin(pluginId);
				if (m_callReceiver.IsEmpty()) {
					Stop();
				}
			});
		}

		function RegisterMethod(methodName, callback) {
			ns.Log('RegisterMethod ' + methodName);
			m_callReceiver.RegisterMethod(methodName, callback);
		}

		this.Log = function(error) 
		{
			try
			{
				var msg = "" + (error.message || error);
				if (error.stack)
					msg += "\r\n" + error.stack;
				msg && msg.length <= 2048 ? m_caller.SendLog(msg) : m_caller.SendLog(msg.substring(0, 2048) + '<...>');
			}
			catch(e)
			{
				ns.Log(e.message || e);
			}
		};
		this.ForceReceive = function()
		{
			m_callReceiver.ForceReceive();
		}

		this.InitializePlugin = function (init) {
			init(
				function () {
					ActivatePlugin.apply(self, arguments);
				},
				function () {
					RegisterMethod.apply(self, arguments);
				},
				function () {
					Call.apply(self, arguments);
				},
				function () {
					DeactivatePlugin.apply(self, arguments);
				},
				function () {
					return SyncCall.apply(self, arguments);
				}
			);
		};

		ns.AddEventListener(window, "unload", function() 
			{
				if (!m_callReceiver.IsEmpty())
					Stop();
			});
	};

	var runners = {};
	var pluginsInitData = [];
	ns.AddRunner = function(pluginName, runnerFunc, initParameters)
	{
		runners[pluginName] = runnerFunc;
		if (initParameters)
		{
			pluginsInitData.push({plugin: pluginName, parameters: ns.JSONStringify(initParameters)});
		}
	};

	ns.SessionLog = function(e)
	{
		if (kaspersyLabSessionInstance)
			kaspersyLabSessionInstance.Log(e);
	}

	ns.ContentSecurityPolicyNonceAttribute = ns.CSP_NONCE;

	var SupportedCallerProvider = function()
	{
		var m_current = 0;
		var m_supportedCallers = [];
		if (ns.NMSTransportSupported)
			m_supportedCallers.push(new ns.NMSCaller);
		if (ns.WebSocketTransportSupported)
			m_supportedCallers.push(new ns.WebSocketCaller);
		if (ns.AjaxTransportSupported)
			m_supportedCallers.push(new ns.AjaxCaller);

		function FindSupportedImpl(callbackSuccess)
		{
			if (m_current < m_supportedCallers.length)
			{
				var caller = m_supportedCallers[m_current++];
				caller.Start(function(){callbackSuccess(caller);}, function(){FindSupportedImpl(callbackSuccess);});
			}
			else
			{
				m_current = 0;
				PostponeInit();
			}
		}

		this.FindSupported = function(callbackSuccess)
		{
			FindSupportedImpl(callbackSuccess);
		}
	}

	function Init()
	{
		var callerProvider = new SupportedCallerProvider;
		callerProvider.FindSupported(
			function(caller) 
			{
				caller.InitCall(
					pluginsInitData,
					function(initSettings)
					{
						ns.IsRtl = initSettings.rtl;
						ns.RES_SIGNATURE = initSettings.resSignature;
						ns.GetResourceSrc = function (resourceName)
						{
							return ns.PREFIX + ns.RES_SIGNATURE + resourceName;
						};
						ns.GetCommandSrc = function()
						{
							return (ns.PREFIX || "/") + initSettings.ajaxId + "/" + initSettings.sessionId;
						}

						kaspersyLabSessionInstance = new KasperskyLabSessionClass(caller);
						var plugins = initSettings.plugins;
						for (var i = 0, pluginsCount = plugins.length; i < pluginsCount; ++i)
						{
							var plugin = plugins[i];
							var pluginRunnerFunction = runners[plugin.name];
							if (pluginRunnerFunction)
								pluginRunnerFunction(KasperskyLab, kaspersyLabSessionInstance, plugin.settings, plugin.localization);
						}
					},
					function()
					{
						PostponeInit();
					});
			});
	}

	var lastPostponedInitTime = (new Date()).getTime();
	var postponedInitTimeout = null;
	function PostponeInit()
	{
		var nowPostponeTime = (new Date()).getTime();
		var postponeDelay = (nowPostponeTime - lastPostponedInitTime) > 5000 ? 200 : 60 * 1000;
		lastPostponedInitTime = nowPostponeTime;
		clearTimeout(postponedInitTimeout)
		postponedInitTimeout = ns.SetTimeout(function () { Init(); }, postponeDelay);
	}

	ns.SetTimeout(function () { Init(); }, 0);
})(KasperskyLab);
(function (ns) 
{

ns.waitForApiInjection = function(isApiInjected, eventName, callback)
{
    if (isApiInjected())
    {
        callback();
        return;
    }

    var subscription = createSubscription(eventName, onApiInjected)

    function onApiInjected()
    {
        if (isApiInjected())
        {
            subscription.unsubscribe();
            callback();
        }
    }
}

function createSubscription(eventName, callback)
{
    var windowEventsSupported = document.createEvent || window.addEventListener;
    return new (windowEventsSupported ? ModernSubscription : IeLegacySubscription)(eventName, callback);
}

function ModernSubscription(eventName, callback)
{
    ns.AddRemovableEventListener(window, eventName, callback);

    this.unsubscribe = function()
    {
        ns.RemoveEventListener(window, eventName, callback);
    }
}

function IeLegacySubscription(eventName, callback)
{
    ns.AddRemovableEventListener(document.documentElement, 'propertychange', onPropertyChange);

    this.unsubscribe = function()
    {
        ns.RemoveEventListener(document.documentElement, 'propertychange', onPropertyChange);
    }

    function onPropertyChange(event)
    {
        if (event.propertyName == eventName)
            callback();
    }
}

})(KasperskyLab || {});
var PLUGIN_ID = 'light_ext';

var productConnection = {
	_connectedSession: null,

	onSessionConnected: function(session, productServices)
	{
    	if (this._connectedSession === session)
    		return;

    	if (this._connectedSession)
    	    this._reset();

        window.product = productServices;
        this._connectedSession = session;
	    try
	    {
	        plugin.onConnect({} /* settings, for compatibilty with old plugins */);
	    }
	    catch(e)
	    {
	        this._cleanup();
	        throw e;
	    }
	},

	onSessionDisconnected: function(session)
	{
		if (this._connectedSession === session)
			this._reset();
	},

	_reset: function()
	{
		try
		{
       		plugin.onDisconnect();
       	}
       	finally
       	{
       	    this._cleanup();
      	}
	},

    _cleanup: function()
    {
        window.product = null;
        this._connectedSession = null;
    }
};

KasperskyLab.AddRunner("light_ext", function (ns, session)
{

var tabIdPropertyName = ns.LIGHT_PLUGIN_API_KEY || '%LIGHT_PLUGIN_API_KEY%';

ns.waitForApiInjection(isApiInjected, tabIdPropertyName, function()
{
    session.InitializePlugin(onPluginInitialized);
});

function onPluginInitialized(activatePlugin, registerMethod, callFunction)
{
	activatePlugin(PLUGIN_ID, onPing, onError);
    registerMethod(PLUGIN_ID + '.setDefaultButtonState', setDefaultButtonState);
    registerMethod(PLUGIN_ID + '.setButtonStateForTab', setButtonStateForTab);
    registerMethod(PLUGIN_ID + '.openNewTab', openNewTab);
    registerMethod(PLUGIN_ID + '.closeTab', closeTab);

    callFunction("light_ext.connect", [], onSessionConnected, onError);
}

function isApiInjected()
{
    return !!window.plugin;
}

function onSessionConnected(result, args)
{
    try
    {
        if (result != 0)
            throw new Error('Connect returned result=' + result);

        var productServices = {
            tracer: {
                log: function(message) { session.Log(message) }
            }
        };

        productConnection.onSessionConnected(session, productServices);
    }
    catch (e)
    {
        onError(e);
    }
}

function onPing()
{
    return ns.MaxRequestDelay;
}

function onError()
{
    productConnection.onSessionDisconnected(session);
    if (window.console && console.log)
        console.log('Error: ' + Array.prototype.slice.call(arguments).join(' '));
}

function setDefaultButtonState(args)
{
    plugin.toolbarButton.setDefaultState(args);
}

function setButtonStateForTab(args)
{
    plugin.toolbarButton.setStateForTab(args.tabId, ns.JSONParse(args.state));
}

function openNewTab(args)
{
    plugin.openNewTab.call(plugin, args.url);
}

function closeTab(arg)
{
    plugin.closeTab.call(plugin, arg);
}

});
KasperskyLab.PLUGINS_LIST = KasperskyLab.PLUGINS_LIST ? KasperskyLab.PLUGINS_LIST + "&ee" : "ee";
KasperskyLab.AddRunner("ee", function (ns, session, settings)
{
var m_callFunction;
var m_redirectList = {};

function onPing()
{
	return ns.MaxRequestDelay;
}

function onError(){}

function IsRedirectNeed(requestId)
{
	return !!m_redirectList[requestId];
}

function GetBlockingResponseObject(requestId)
{
	var blockingResponseObject = {};
	if (IsRedirectNeed(requestId))
	{
		blockingResponseObject.redirectUrl = m_redirectList[requestId];
		callToService("redirectHandled", {redirected: true, requestId: requestId});
		delete m_redirectList[requestId];
	}
	return blockingResponseObject;
}

function CleanupRedirectObject(details)
{
	if (IsRedirectNeed(details.requestId))
	{
		var redirectUrl = m_redirectList[details.requestId];
		delete m_redirectList[details.requestId];

		if (details.type !== "main_frame")
		{
			callToService("redirectHandled", {redirected: false, requestId: details.requestId});
			return;
		}

		chrome.tabs.update(details.tabId, {url: redirectUrl},
			function()
			{
				var redirected = !chrome.runtime.lastError;
				callToService("redirectHandled", {redirected: redirected, requestId: details.requestId});
			});
	}
}

function onBeforeRequestHandler(details)
{
	callToService("beforeRequest", {
		requestId: details.requestId,
		url: details.url,
		method: details.method,
		resourceType: details.type,
		tabId: details.tabId,
		frameId: details.frameId});
	return GetBlockingResponseObject(details.requestId);
}

function onBeforeSendHeaders(details)
{
	callToService("sendHeaders", {
		requestId: details.requestId,
		url: details.url,
		method: details.method,
		resourceType: details.type,
		tabId: details.tabId,
		frameId: details.frameId,
		requestHeaders: details.requestHeaders});
	return GetBlockingResponseObject(details.requestId);
}

function onHeadersReceived(details)
{
	callToService("headersReceived", {
		requestId: details.requestId,
		statusLine: details.statusLine,
		statusCode: details.statusCode,
		responseHeaders: details.responseHeaders});
	return GetBlockingResponseObject(details.requestId);
}

function onAuthRequiredOptions(details)
{
	return GetBlockingResponseObject(details.requestId);
}

function onCompleted(details)
{
	callToService("requestComplete", {requestId: details.requestId});
	CleanupRedirectObject(details);
}

function onRequestError(details)
{
	callToService("requestError", {requestId: details.requestId, error:details.error});
	CleanupRedirectObject(details);
}

function callToService(commandPostfix, args)
{
	m_callFunction("ee." + commandPostfix, args);
}

function OnRedirectCall(redirectDetails)
{
	m_redirectList[redirectDetails.requestId] = redirectDetails.url;
	ns.SetTimeout(function(){CleanupRedirectObject(redirectDetails);}, 500);
}

function onPluginInitialized(activatePlugin, registerMethod, callFunction)
{
	m_callFunction = callFunction;

	activatePlugin("ee", onPing, onError);
	registerMethod("ee.redirect", OnRedirectCall);

	webrequest.dispatcher.subscribeToRequestEvents(onBeforeRequestHandler, onBeforeSendHeaders, onHeadersReceived, onAuthRequiredOptions, onCompleted, onRequestError);
}

function InitializePlugin()
{
	var testPath = ns.PREFIX + ns.SIGNATURE + "/init?url=" + encodeURIComponent("webextension://test") + "&isTopLevel=";
	testPath = testPath.replace("http://", "https://");
	var testRequest = new XMLHttpRequest;
	testRequest.open("GET", testPath, true);
	testRequest.send();
	testRequest.onerror = function(){session.InitializePlugin(onPluginInitialized);};
}

InitializePlugin();

});
KasperskyLab.PLUGINS_LIST = KasperskyLab.PLUGINS_LIST ? KasperskyLab.PLUGINS_LIST + "&cm" : "cm";
KasperskyLab.AddRunner("cm", function (ns, session, settings)
{
var m_callFunction;
var m_optionalCookieFields = ["value", "domain", "path", "secure", "httpOnly", "expirationDate"];

function onPing()
{
	return ns.MaxRequestDelay;
}

function onError(){}

function ConvertTimeUnixToWindows(unixTime)
{
	var diff = 116444736000000000;
	return unixTime * 10000000 + diff;
}

function ConvertTimeWindowsToUnix(winTime)
{
	var diff = 11644473600;
	return winTime / 10000000 - diff;
}

function callToService(commandPostfix, jsonArg)
{
	m_callFunction("cm." + commandPostfix, jsonArg);
}

function OnGetCookieCall(getCookieDetails)
{
	chrome.cookies.getAll({url: getCookieDetails.url}, function(cookies){OnGetCookieCallback(getCookieDetails.callId, cookies);});
}

function OnSetCookieCall(setCookieDetails)
{
	if (setCookieDetails.cookies.length === 0)
	{
		ns.SessionLog("Wrong cookies list");
		return;
	}
	SetCookieImpl(setCookieDetails.callId, setCookieDetails.url, setCookieDetails.cookies.shift(), setCookieDetails.cookies, "");
}

function OnGetCookieCallback(callId, cookies)
{
	var cookiesArg = [];
	if (chrome.runtime.lastError)
	{
		callToService("getCallback", {callId: callId, isSucceeded: false});
		ns.SessionLog("Get cookie error occure: " + chrome.runtime.lastError.message);
		return;
	}

	for (var i = 0; i < cookies.length; ++i)
	{
		var cookie = cookies[i];
		var cookieArg = {name: cookie.name, value: cookie.value};
		for (var j = 0; j < m_optionalCookieFields.length; ++j)
		{
			var cookieField = m_optionalCookieFields[j];
			if (ns.IsDefined(cookie[cookieField]))
			{
				cookieArg[cookieField + "_initialized"] = true;
				cookieArg[cookieField] = cookie[cookieField];
			}
		}
		if (ns.IsDefined(cookieArg.expirationDate))
			cookieArg.expirationDate = ConvertTimeUnixToWindows(cookieArg.expirationDate);

		cookiesArg.push(cookieArg);
	}
	callToService("getCallback", {callId: callId, isSucceeded: true, cookies: cookiesArg});
}

function OnSetCookieCallback(callId, url, tail, errors, settedCookie)
{
	if (!settedCookie && chrome.runtime.lastError)
		errors += chrome.runtime.lastError.message + ";";

	if (!tail.length)
	{
		callToService("setCallback", {callId: callId, isSucceeded: !errors && settedCookie});
		return;
	}
	
	var cookie = tail.shift();
	SetCookieImpl(callId, url, cookie, tail, errors);
}

function SetCookieImpl(callId, url, cookie, tail, errors)
{
	var cookieArg = {url: url, name: cookie.name};
	for (var i = 0; i < m_optionalCookieFields.length; ++i)
	{
		var cookieField = m_optionalCookieFields[i];
		if (cookie[cookieField + "_initialized"])
			cookieArg[cookieField] = cookie[cookieField];
	}
	if (ns.IsDefined(cookieArg.expirationDate))
		cookieArg.expirationDate = ConvertTimeWindowsToUnix(cookieArg.expirationDate);

	chrome.cookies.set(cookieArg, function(settedCookie){OnSetCookieCallback(callId, url, tail, errors, settedCookie);});
}

function onPluginInitialized(activatePlugin, registerMethod, callFunction)
{
	m_callFunction = callFunction;

	activatePlugin("cm", onPing, onError);
	registerMethod("cm.getCookie", OnGetCookieCall);
	registerMethod("cm.setCookie", OnSetCookieCall);
}

session.InitializePlugin(onPluginInitialized);
});
KasperskyLab.PLUGINS_LIST = KasperskyLab.PLUGINS_LIST ? KasperskyLab.PLUGINS_LIST + "&ab_background" : "ab_background";
KasperskyLab.AddRunner("ab_background", function (ns, session, settings, locales)
{
	var m_callFunction = function(){};
	var m_isTaskEnabled = false;

	function OnPing()
	{
		return ns.MaxRequestDelay;
	}
	
	function AddContextMenu()
	{
		chrome.contextMenus.create({id: "AddToBlockList", title: locales["AntiBannerContextMenuPrompt"], contexts: ["image"], targetUrlPatterns: ["http://*/*", "https://*/*"], onclick: HandleAddToBlockList});
	}

	function Cleanup()
	{
		chrome.contextMenus.removeAll();
	}

	function HandleAddToBlockList(args)
	{
		m_callFunction("ab_background.AddToBlockList", { src: args.srcUrl });
	}
	
	function SetTaskEnabled(isTaskEnabled)
	{
		if (isTaskEnabled == m_isTaskEnabled)
			return;
		m_isTaskEnabled = isTaskEnabled;
		if (m_isTaskEnabled)
			AddContextMenu();
		else
			Cleanup();
	}
	
	function OnSetTaskEnabled(settings)
	{
		SetTaskEnabled(settings.isTaskEnabled);
	}

	function Init()
	{
		session.InitializePlugin(
			function(activatePlugin, registerMethod, callFunction)
			{
				m_callFunction = callFunction;
				activatePlugin("ab_background", OnPing, Cleanup);
				registerMethod("ab_background.setTaskEnabled", OnSetTaskEnabled);
			});
		SetTaskEnabled(settings.isTaskEnabled);
	}

	Init();
});

/* Here the wrapped code ends */
} // injectSnapshotScripts(injectionId)
