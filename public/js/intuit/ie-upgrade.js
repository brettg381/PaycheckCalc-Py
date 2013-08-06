function e(str) {
	var ie = "http://www.microsoft.com/windows/Internet-explorer/default.aspx";
	var ffx = "http://www.mozilla.com/firefox/";
	var saf = "http://www.apple.com/safari/download/";
	var chr = "http://www.google.com/chrome";

	var msg = "<div style='text-align: center'><img src='"+str+"sad_face.gif' /></div>";
	var tit1 = "<h1 style='text-align: center'>Bummer... You browser doesn't like us.</h1>";
	var links = "<a href='" +chr+ "'>Chrome</a>, <a href='" +ffx+ "'>Firefox</a>, <a href='" +saf+ "'>Safari</a> or <a href='" +ie+ "'>Internet Explorer 9+</a>";
    var tit2 = "<p style='text-align: center'>Please update your browser so we can be friends!<br/>Try a new version of " + links +"</p>";
	var tit3 = "<p style='text-align: center; color: #999; margin-top: 20px; font-size:11px;'>Trust us, you'll be happy you did!</p>";
	
    var _body = document.getElementsByTagName('body')[0];
    var _d = document.createElement('div');
    var _l = document.createElement('div');
    _body.appendChild(_l);
    _body.appendChild(_d);
    _d.setAttribute('id', '_d');
    _l.setAttribute('id', '_l');
    var _width = document.documentElement.clientWidth;
    var _height = document.documentElement.clientHeight;
    var _dl = document.getElementById('_l');
    _dl.style.width = _width + "px";
    _dl.style.height = _height + "px";
    _dl.style.position = "absolute";
    _dl.style.zIndex = "9999";
    _dl.style.top = "0px";
    _dl.style.left = "0px";
    _dl.style.filter = "alpha(opacity=50)";
    _dl.style.background = "#000";
    var _dd = document.getElementById('_d');
    _ddw = 550;
    _ddh = 260;
    _dd.style.width = _ddw + "px";
    _dd.style.height = _ddh + "px";
    _dd.style.position = "absolute";
    _dd.style.zIndex = "99999";
    _dd.style.top = ((_height - _ddh) / 2) + "px";
    _dd.style.left = ((_width - _ddw) / 2) + "px";
    _dd.style.padding = "20px";
    _dd.style.background = "#fff";
    _dd.style.border = "1px solid #ccc";
    _dd.style.fontFamily = "'Lucida Grande','Lucida Sans Unicode',Arial,Verdana,sans-serif";
    _dd.style.listStyleType = "none";
    _dd.style.color = "#4F4F4F";
    _dd.style.fontSize = "12px";

    _d.innerHTML = msg + tit1 + tit2 + tit3;
}