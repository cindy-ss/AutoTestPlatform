define("common/widget/slide/slide_focus", ["require"], function (e) {
    function t(e) {
        this.obj = e, this.oLi = this.obj.pic.find("li"), this.liL = this.oLi.length, this.index = 0, this.oldIndex = 0, this.timer = null, this.dir = "right"
    }

    return $.extend(t.prototype, {
        init: function () {
            this.liL > 1 && (this.slideLeft(), this.slideRight(), this.focusPlay(), this.obj.nav && this.navHover())
        }, navSel: function (e) {
            this.obj.nav && (this.obj.nav.removeClass("cur"), this.obj.nav.eq(e).addClass("cur"))
        }, conSel: function (e) {
            this.oLi.removeClass("cur").find(".pic").css({"z-index": "0"}), this.oLi.eq(this.oldIndex).find(".pic").css({"z-index": "1"}), this.oLi.eq(e).addClass("cur").find(".pic").css({"z-index": "2"}), this.obj.callback && this.obj.callback(this.oLi.eq(e), this.oLi.eq(this.oldIndex))
        }, allSel: function (e) {
            this.navSel(e), this.conSel(e)
        }, navHover: function () {
            var e = this;
            this.obj.nav.each(function (t) {
                e.onOffPlay($(this), function () {
                    e.index !== t && (e.oldIndex = e.index, e.index = t, e.allSel(e.index), e.dir = "right")
                })
            })
        }, slideLeft: function () {
            var e = this;
            this.onOffPlay(this.obj.btnL), this.obj.btnL.on("click", function () {
                e.dir === "right" && (e.oldIndex = e.index, e.index--, e.dir = "left"), e.index === -1 && (e.index = Math.ceil(e.liL - 1)), e.allSel(e.index), e.oldIndex = e.index, e.index--
            })
        }, slideRight: function () {
            var e = this;
            this.onOffPlay(this.obj.btnR), this.obj.btnR.on("click", function () {
                e.playFun()
            })
        }, onOffPlay: function (e, t) {
            var n = this;
            e.hover(function () {
                n.focusStop(), t && t()
            }, function () {
                n.focusPlay()
            })
        }, focusPlay: function () {
            var e = this;
            this.obj.s = this.obj.s || 5e3, this.timer = setInterval(function () {
                e.playFun()
            }, this.obj.s)
        }, playFun: function () {
            this.dir === "left" && (this.index++, this.dir = "right"), this.oldIndex = this.index, this.index++, this.index === Math.ceil(this.liL) && (this.index = 0), this.allSel(this.index), this.off = !1
        }, focusStop: function () {
            clearInterval(this.timer)
        }
    }), t
}), define("common/widget/slide/slide_focus_simple", ["require"], function (e) {
    function t(e) {
        this.obj = e, this.oLi = this.obj.pic.find("li"), this.liL = this.oLi.length
    }

    return $.extend(t.prototype, {
        init: function () {
            this.liL > 1 && this.navHover()
        }, navHover: function () {
            var e = this;
            this.obj.nav.each(function (t) {
                $(this).bind("click", function () {
                    e.show($(this), t)
                })
            })
        }, show: function (e, t) {
            var n = this;
            n.obj.nav.each(function () {
                $(this).removeClass("cur")
            }), e.addClass("cur"), this.oLi.each(function (e) {
                $(this).removeClass("show"), t === e && $(this).addClass("show")
            })
        }
    }), t
}), define("common/widget/string/utils", ["require", "exports", "module"], function (e, t, n) {
    var r = {
        getLength: function (e) {
            var t = /[\u4e00-\u9fa5]/g, n = e.replace(t, "ww").length;
            return n
        }, setEllipsis: function (e, t, n) {
            n = n || "";
            var r = this, i = this.getLength(e);
            if (i <= t)return e;
            var s = 0, o = [], u = e.split("");
            for (var a = 0, f = u.length; a < f; a++) {
                var l = u[a];
                s += r.getLength(l);
                if (!(s <= t))break;
                o.push(l)
            }
            return o.join("") + n
        }, unhtml: function (e, t) {
            return e ? e.replace(t || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp);)?/g, function (e, t) {
                return t ? e : {"<": "&lt;", "&": "&amp;", '"': "&quot;", ">": "&gt;", "'": "&#39;"}[e]
            }) : ""
        }, html: function (e) {
            return e ? e.replace(/&((g|l|quo)t|amp|#39);/g, function (e) {
                return {"&lt;": "<", "&amp;": "&", "&quot;": '"', "&gt;": ">", "&#39;": "'"}[e]
            }) : ""
        }, unhtml4Hash: function (e) {
            for (var t in e)if (e.hasOwnProperty(t)) {
                var n = e[t];
                typeof n == "string" && (e[t] = this.unhtml(n))
            }
            return e
        }
    };
    n.exports = r
}), define("common/widget/voice/voiceSpeech", ["require", "common/widget/string/utils"], function (e) {
    function n(e) {
        this._self = e, this.spdmap = {
            1: "1X",
            3: "2X",
            5: "3X",
            7: "4X",
            9: "5X"
        }, this.defaultParams = {
            tex: "百度语音，面向广大开发者永久免费开放语音合成技术。所采用的离在线融合技术，根据当前网络状况，自动判断使用本地引擎或者云端引擎，进行语音合成，再也不用担心流量消耗了！",
            per: 3,
            lan: "zh",
            spd: 5,
            vol: 5
        }, this.playParams = $.extend({}, this.defaultParams), this._limit = 400
    }

    var t = e("common/widget/string/utils");
    return $.extend(n.prototype, {
        init: function () {
            this.initDom(), this.checkNumber(), this.bindInput(), this.bindPlayBtn(), this.bindSpeechConfig()
        }, bindSpeechConfig: function () {
            var e = this;
            this._self.delegate(".config-sex *[data-action]", "click", function (t) {
                t.preventDefault();
                var n = $(this).attr("data-action"), r = $(this).attr("data-code"), i = {};
                i[n] = r, $.extend(e.playParams, i), $(this).siblings(".item-active").removeClass("item-active"), $(this).addClass("item-active"), e.play()
            }), this.bindVolConfig(), this.bindSpdConfig()
        }, bindSpdConfig: function () {
            var e = this;
            this._self.delegate(".speed-box .left", "click", function (t) {
                t.preventDefault();
                var n = $(this).next(), r = parseInt(n.attr("data-code"), 10);
                if (r >= 3) {
                    var i = r - 2;
                    n.attr("data-code", i), n.html(e.spdmap[i]), e.setSpdValue(i), e.play()
                }
            }), this._self.delegate(".speed-box .right", "click", function (t) {
                t.preventDefault();
                var n = $(this).prev(), r = parseInt(n.attr("data-code"), 10);
                if (r <= 7) {
                    var i = r + 2;
                    n.attr("data-code", i), n.html(e.spdmap[i]), e.setSpdValue(i), e.play()
                }
            })
        }, setSpdValue: function (e) {
            $.extend(this.playParams, {spd: e})
        }, bindVolConfig: function () {
            function n() {
                t || ($(document).on("mousemove", function (t) {
                    if (e.volmove) {
                        var n = t.pageX - e._self.find(".vol-config").offset().left;
                        e.setVolPoint(n)
                    }
                }), t = 1)
            }

            var e = this, t = 0;
            this._self.find(".vol-handle").on("mousedown", function (t) {
                t.preventDefault(), e.volmove = 1, e.volmovestart = 1, n()
            }), this._self.find(".vol-handle").on("mouseup", function (t) {
                t.preventDefault(), e.volmove = 0
            }), this._self.find(".vol-config").on("mouseleave", function (t) {
                t.preventDefault(), e.volmove = 0
            }), this._self.find(".vol-config").on("mouseup", function (t) {
                t.preventDefault(), e.volmove = 0, e.volmovestart === 1 && (e.play(), e.volmovestart = 0)
            }), this._self.find(".vol-config").on("click", function (t) {
                var n = t.pageX - $(this).offset().left;
                e.volmovestart = 1, e.setVolPoint(n)
            })
        }, setVolValue: function (e) {
            var t = window.parseInt(e / 10);
            t = t > 9 ? 9 : t, $.extend(this.playParams, {vol: t})
        }, setVolPoint: function (e) {
            e = e < 0 ? 0 : e, e = e > 100 ? 100 : e, this._self.find(".vol-handle").css({left: e - 4 + "px"}), this._self.find(".vol-bar").css({width: e + "px"}), this.setVolValue(e)
        }, bindPlayBtn: function () {
            var e = this;
            this._self.delegate("a[data-action=play]", "click", function (t) {
                t.preventDefault(), e.play()
            }), this._self.delegate("a[data-action=pause]", "click", function (t) {
                t.preventDefault(), e.activePlayer && e.activePlayer.pause && e.activePlayer.pause()
            })
        }, play: function () {
            var e = this.getMp3Url();
            document.createElement("audio").canPlayType && document.createElement("audio").canPlayType("audio/mpeg") ? this.playForH5(e) : this.playForNoH5(e)
        }, getMp3Url: function () {
            var e = "http://tts.baidu.com/text2audio", t = this.getParams();
            return e + "?idx=1" + "&tex=" + encodeURIComponent(encodeURIComponent(t.tex)) + "&cuid=baidu_speech_demo" + "&cod=2" + "&lan=" + t.lan + "&ctp=1" + "&pdt=1" + "&spd=" + t.spd + "&per=" + t.per + "&vol=" + t.vol + "&pit=5"
        }, playForNoH5: function (e) {
            this.activePlayer && (this.activePlayer.pause(), $(this.activePlayer).remove());
            var t = "j-embed-" + (new Date - 0), n = $('<div style="display:none"><embed id=' + t + ' src="' + e + '" width="0" height="0" ></div>');
            this._self.append(n), this.activePlayer = $("#" + t)[0]
        }, playForH5: function (e) {
            this.activePlayer && this.activePlayer.pause();
            var t = this._self.find(".playbtn"), n = new Audio(e);
            this.activePlayer = n, n.src = e, n.onpause = function () {
                t.removeClass("pause-btn"), t.attr("data-action", "play")
            }, n.onended = function () {
                t.removeClass("pause-btn"), t.attr("data-action", "play")
            }, n.onplaying = function () {
                t.addClass("pause-btn"), t.attr("data-action", "pause")
            }, n.play()
        }, initDom: function () {
            this._input = this._self.find("textarea[data-node=input]"), this._number = this._self.find("div[data-node=number]")
        }, bindInput: function () {
            var e = this;
            this._input.on("keyup", function (t) {
                e.checkNumber()
            }), this._input.on("focus", function (t) {
                e.checkValueForFocus(), e.checkNumber()
            }), this._input.on("blur", function (t) {
                e.checkValueForBlur(), e.checkNumber()
            })
        }, checkValueForFocus: function () {
            var e = this._input.val();
            e === this.defaultParams.tex && this._input.val("")
        }, checkValueForBlur: function () {
            var e = this._input.val();
            e === "" && this._input.val(this.defaultParams.tex)
        }, checkNumber: function () {
            if (!this._number)return;
            var e = this._input.val(), n = t.getLength(e), r = this._limit - n;
            if (r >= 0) {
                var i = r % 2 !== 0 ? (r - r % 2) / 2 : r / 2;
                this._number.html(this.getNumTpl("success").replace(/\{number\}/g, i))
            } else this._input.val(t.setEllipsis(e, this._limit, "")), this._number.html(this.getNumTpl("success").replace(/\{number\}/g, 0))
        }, getNumTpl: function (e) {
            var t = {
                success: '还可以输入<strong class="number">{number}</strong>字',
                error: '已超出<strong class="number number-overflow">{number}</strong>字'
            };
            return t[e]
        }, getParams: function () {
            var e = this._self.find(".speech-input");
            return $.extend(this.playParams, {tex: e.val()})
        }
    }), n
});
var swfobject = function () {
    function C() {
        if (b)return;
        try {
            var e = a.getElementsByTagName("body")[0].appendChild(U("span"));
            e.parentNode.removeChild(e)
        } catch (t) {
            return
        }
        b = !0;
        var n = c.length;
        for (var r = 0; r < n; r++)c[r]()
    }

    function k(e) {
        b ? e() : c[c.length] = e
    }

    function L(t) {
        if (typeof u.addEventListener != e)u.addEventListener("load", t, !1); else if (typeof a.addEventListener != e)a.addEventListener("load", t, !1); else if (typeof u.attachEvent != e)z(u, "onload", t); else if (typeof u.onload == "function") {
            var n = u.onload;
            u.onload = function () {
                n(), t()
            }
        } else u.onload = t
    }

    function A() {
        l ? O() : M()
    }

    function O() {
        var n = a.getElementsByTagName("body")[0], r = U(t);
        r.setAttribute("type", i);
        var s = n.appendChild(r);
        if (s) {
            var o = 0;
            (function () {
                if (typeof s.GetVariable != e) {
                    var t = s.GetVariable("$version");
                    t && (t = t.split(" ")[1].split(","), T.pv = [parseInt(t[0], 10), parseInt(t[1], 10), parseInt(t[2], 10)])
                } else if (o < 10) {
                    o++, setTimeout(arguments.callee, 10);
                    return
                }
                n.removeChild(r), s = null, M()
            })()
        } else M()
    }

    function M() {
        var t = h.length;
        if (t > 0)for (var n = 0; n < t; n++) {
            var r = h[n].id, i = h[n].callbackFn, s = {success: !1, id: r};
            if (T.pv[0] > 0) {
                var o = R(r);
                if (o)if (W(h[n].swfVersion) && !(T.wk && T.wk < 312))V(r, !0), i && (s.success = !0, s.ref = _(r), i(s)); else if (h[n].expressInstall && D()) {
                    var u = {};
                    u.data = h[n].expressInstall, u.width = o.getAttribute("width") || "0", u.height = o.getAttribute("height") || "0", o.getAttribute("class") && (u.styleclass = o.getAttribute("class")), o.getAttribute("align") && (u.align = o.getAttribute("align"));
                    var a = {}, f = o.getElementsByTagName("param"), l = f.length;
                    for (var c = 0; c < l; c++)f[c].getAttribute("name").toLowerCase() != "movie" && (a[f[c].getAttribute("name")] = f[c].getAttribute("value"));
                    P(u, a, r, i)
                } else H(o), i && i(s)
            } else {
                V(r, !0);
                if (i) {
                    var p = _(r);
                    p && typeof p.SetVariable != e && (s.success = !0, s.ref = p), i(s)
                }
            }
        }
    }

    function _(n) {
        var r = null, i = R(n);
        if (i && i.nodeName == "OBJECT")if (typeof i.SetVariable != e)r = i; else {
            var s = i.getElementsByTagName(t)[0];
            s && (r = s)
        }
        return r
    }

    function D() {
        return !w && W("6.0.65") && (T.win || T.mac) && !(T.wk && T.wk < 312)
    }

    function P(t, n, r, i) {
        w = !0, g = i || null, y = {success: !1, id: r};
        var o = R(r);
        if (o) {
            o.nodeName == "OBJECT" ? (v = B(o), m = null) : (v = o, m = r), t.id = s;
            if (typeof t.width == e || !/%$/.test(t.width) && parseInt(t.width, 10) < 310)t.width = "310";
            if (typeof t.height == e || !/%$/.test(t.height) && parseInt(t.height, 10) < 137)t.height = "137";
            a.title = a.title.slice(0, 47) + " - Flash Player Installation";
            var f = T.ie && T.win ? "ActiveX" : "PlugIn", l = "MMredirectURL=" + u.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + f + "&MMdoctitle=" + a.title;
            typeof n.flashvars != e ? n.flashvars += "&" + l : n.flashvars = l;
            if (T.ie && T.win && o.readyState != 4) {
                var c = U("div");
                r += "SWFObjectNew", c.setAttribute("id", r), o.parentNode.insertBefore(c, o), o.style.display = "none", function () {
                    o.readyState == 4 ? o.parentNode.removeChild(o) : setTimeout(arguments.callee, 10)
                }()
            }
            j(t, n, r)
        }
    }

    function H(e) {
        if (T.ie && T.win && e.readyState != 4) {
            var t = U("div");
            e.parentNode.insertBefore(t, e), t.parentNode.replaceChild(B(e), t), e.style.display = "none", function () {
                e.readyState == 4 ? e.parentNode.removeChild(e) : setTimeout(arguments.callee, 10)
            }()
        } else e.parentNode.replaceChild(B(e), e)
    }

    function B(e) {
        var n = U("div");
        if (T.win && T.ie)n.innerHTML = e.innerHTML; else {
            var r = e.getElementsByTagName(t)[0];
            if (r) {
                var i = r.childNodes;
                if (i) {
                    var s = i.length;
                    for (var o = 0; o < s; o++)(i[o].nodeType != 1 || i[o].nodeName != "PARAM") && i[o].nodeType != 8 && n.appendChild(i[o].cloneNode(!0))
                }
            }
        }
        return n
    }

    function j(n, r, s) {
        var o, u = R(s);
        if (T.wk && T.wk < 312)return o;
        if (u) {
            typeof n.id == e && (n.id = s);
            if (T.ie && T.win) {
                var a = "";
                for (var f in n)n[f] != Object.prototype[f] && (f.toLowerCase() == "data" ? r.movie = n[f] : f.toLowerCase() == "styleclass" ? a += ' class="' + n[f] + '"' : f.toLowerCase() != "classid" && (a += " " + f + '="' + n[f] + '"'));
                var l = "";
                for (var c in r)r[c] != Object.prototype[c] && (l += '<param name="' + c + '" value="' + r[c] + '" />');
                u.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + a + ">" + l + "</object>", p[p.length] = n.id, o = R(n.id)
            } else {
                var h = U(t);
                h.setAttribute("type", i);
                for (var d in n)n[d] != Object.prototype[d] && (d.toLowerCase() == "styleclass" ? h.setAttribute("class", n[d]) : d.toLowerCase() != "classid" && h.setAttribute(d, n[d]));
                for (var v in r)r[v] != Object.prototype[v] && v.toLowerCase() != "movie" && F(h, v, r[v]);
                u.parentNode.replaceChild(h, u), o = h
            }
        }
        return o
    }

    function F(e, t, n) {
        var r = U("param");
        r.setAttribute("name", t), r.setAttribute("value", n), e.appendChild(r)
    }

    function I(e) {
        var t = R(e);
        t && t.nodeName == "OBJECT" && (T.ie && T.win ? (t.style.display = "none", function () {
            t.readyState == 4 ? q(e) : setTimeout(arguments.callee, 10)
        }()) : t.parentNode.removeChild(t))
    }

    function q(e) {
        var t = R(e);
        if (t) {
            for (var n in t)typeof t[n] == "function" && (t[n] = null);
            t.parentNode.removeChild(t)
        }
    }

    function R(e) {
        var t = null;
        try {
            t = a.getElementById(e)
        } catch (n) {
        }
        return t
    }

    function U(e) {
        return a.createElement(e)
    }

    function z(e, t, n) {
        e.attachEvent(t, n), d[d.length] = [e, t, n]
    }

    function W(e) {
        var t = T.pv, n = e.split(".");
        return n[0] = parseInt(n[0], 10), n[1] = parseInt(n[1], 10) || 0, n[2] = parseInt(n[2], 10) || 0, t[0] > n[0] || t[0] == n[0] && t[1] > n[1] || t[0] == n[0] && t[1] == n[1] && t[2] >= n[2] ? !0 : !1
    }

    function X(n, r, i, s) {
        if (T.ie && T.mac)return;
        var o = a.getElementsByTagName("head")[0];
        if (!o)return;
        var u = i && typeof i == "string" ? i : "screen";
        s && (E = null, S = null);
        if (!E || S != u) {
            var f = U("style");
            f.setAttribute("type", "text/css"), f.setAttribute("media", u), E = o.appendChild(f), T.ie && T.win && typeof a.styleSheets != e && a.styleSheets.length > 0 && (E = a.styleSheets[a.styleSheets.length - 1]), S = u
        }
        T.ie && T.win ? E && typeof E.addRule == t && E.addRule(n, r) : E && typeof a.createTextNode != e && E.appendChild(a.createTextNode(n + " {" + r + "}"))
    }

    function V(e, t) {
        if (!x)return;
        var n = t ? "visible" : "hidden";
        b && R(e) ? R(e).style.visibility = n : X("#" + e, "visibility:" + n)
    }

    function $(t) {
        var n = /[\\\"<>\.;]/, r = n.exec(t) != null;
        return r && typeof encodeURIComponent != e ? encodeURIComponent(t) : t
    }

    var e = "undefined", t = "object", n = "Shockwave Flash", r = "ShockwaveFlash.ShockwaveFlash", i = "application/x-shockwave-flash", s = "SWFObjectExprInst", o = "onreadystatechange", u = window, a = document, f = navigator, l = !1, c = [A], h = [], p = [], d = [], v, m, g, y, b = !1, w = !1, E, S, x = !0, T = function () {
        var s = typeof a.getElementById != e && typeof a.getElementsByTagName != e && typeof a.createElement != e, o = f.userAgent.toLowerCase(), c = f.platform.toLowerCase(), h = c ? /win/.test(c) : /win/.test(o), p = c ? /mac/.test(c) : /mac/.test(o), d = /webkit/.test(o) ? parseFloat(o.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1, v = !1, m = [0, 0, 0], g = null;
        if (typeof f.plugins != e && typeof f.plugins[n] == t)g = f.plugins[n].description, g && (typeof f.mimeTypes == e || !f.mimeTypes[i] || !!f.mimeTypes[i].enabledPlugin) && (l = !0, v = !1, g = g.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), m[0] = parseInt(g.replace(/^(.*)\..*$/, "$1"), 10), m[1] = parseInt(g.replace(/^.*\.(.*)\s.*$/, "$1"), 10), m[2] = /[a-zA-Z]/.test(g) ? parseInt(g.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0); else if (typeof u.ActiveXObject != e)try {
            var y = new ActiveXObject(r);
            y && (g = y.GetVariable("$version"), g && (v = !0, g = g.split(" ")[1].split(","), m = [parseInt(g[0], 10), parseInt(g[1], 10), parseInt(g[2], 10)]))
        } catch (b) {
        }
        return {w3: s, pv: m, wk: d, ie: v, win: h, mac: p}
    }(), N = function () {
        if (!T.w3)return;
        (typeof a.readyState != e && a.readyState == "complete" || typeof a.readyState == e && (a.getElementsByTagName("body")[0] || a.body)) && C(), b || (typeof a.addEventListener != e && a.addEventListener("DOMContentLoaded", C, !1), T.ie && T.win && (a.attachEvent(o, function () {
            a.readyState == "complete" && (a.detachEvent(o, arguments.callee), C())
        }), u == top && function () {
            if (b)return;
            try {
                a.documentElement.doScroll("left")
            } catch (e) {
                setTimeout(arguments.callee, 0);
                return
            }
            C()
        }()), T.wk && function () {
            if (b)return;
            if (!/loaded|complete/.test(a.readyState)) {
                setTimeout(arguments.callee, 0);
                return
            }
            C()
        }(), L(C))
    }(), J = function () {
        T.ie && T.win && window.attachEvent("onunload", function () {
            var e = d.length;
            for (var t = 0; t < e; t++)d[t][0].detachEvent(d[t][1], d[t][2]);
            var n = p.length;
            for (var r = 0; r < n; r++)I(p[r]);
            for (var i in T)T[i] = null;
            T = null;
            for (var s in swfobject)swfobject[s] = null;
            swfobject = null
        })
    }();
    return {
        registerObject: function (e, t, n, r) {
            if (T.w3 && e && t) {
                var i = {};
                i.id = e, i.swfVersion = t, i.expressInstall = n, i.callbackFn = r, h[h.length] = i, V(e, !1)
            } else r && r({success: !1, id: e})
        }, getObjectById: function (e) {
            if (T.w3)return _(e)
        }, embedSWF: function (n, r, i, s, o, u, a, f, l, c) {
            var h = {success: !1, id: r};
            T.w3 && !(T.wk && T.wk < 312) && n && r && i && s && o ? (V(r, !1), k(function () {
                i += "", s += "";
                var p = {};
                if (l && typeof l === t)for (var d in l)p[d] = l[d];
                p.data = n, p.width = i, p.height = s;
                var v = {};
                if (f && typeof f === t)for (var m in f)v[m] = f[m];
                if (a && typeof a === t)for (var g in a)typeof v.flashvars != e ? v.flashvars += "&" + g + "=" + a[g] : v.flashvars = g + "=" + a[g];
                if (W(o)) {
                    var y = j(p, v, r);
                    p.id == r && V(r, !0), h.success = !0, h.ref = y
                } else {
                    if (u && D()) {
                        p.data = u, P(p, v, r, c);
                        return
                    }
                    V(r, !0)
                }
                c && c(h)
            })) : c && c(h)
        }, switchOffAutoHideShow: function () {
            x = !1
        }, ua: T, getFlashPlayerVersion: function () {
            return {major: T.pv[0], minor: T.pv[1], release: T.pv[2]}
        }, hasFlashPlayerVersion: W, createSWF: function (e, t, n) {
            return T.w3 ? j(e, t, n) : undefined
        }, showExpressInstall: function (e, t, n, r) {
            T.w3 && D() && P(e, t, n, r)
        }, removeSWF: function (e) {
            T.w3 && I(e)
        }, createCSS: function (e, t, n, r) {
            T.w3 && X(e, t, n, r)
        }, addDomLoadEvent: k, addLoadEvent: L, getQueryParamValue: function (e) {
            var t = a.location.search || a.location.hash;
            if (t) {
                /\?/.test(t) && (t = t.split("?")[1]);
                if (e == null)return $(t);
                var n = t.split("&");
                for (var r = 0; r < n.length; r++)if (n[r].substring(0, n[r].indexOf("=")) == e)return $(n[r].substring(n[r].indexOf("=") + 1))
            }
            return ""
        }, expressInstallCallback: function () {
            if (w) {
                var e = R(s);
                e && v && (e.parentNode.replaceChild(v, e), m && (V(m, !0), T.ie && T.win && (v.style.display = "block")), g && g(y)), w = !1
            }
        }
    }
}();
define("common/lib/swfobject/swfobject", function () {
}), function (e) {
    typeof define == "function" && define.amd ? define("jquery.cookie", ["jquery"], e) : typeof exports == "object" ? e(require("jquery")) : e(jQuery)
}(function (e) {
    function n(e) {
        return u.raw ? e : encodeURIComponent(e)
    }

    function r(e) {
        return u.raw ? e : decodeURIComponent(e)
    }

    function i(e) {
        return n(u.json ? JSON.stringify(e) : String(e))
    }

    function s(e) {
        e.indexOf('"') === 0 && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
        try {
            return e = decodeURIComponent(e.replace(t, " ")), u.json ? JSON.parse(e) : e
        } catch (n) {
        }
    }

    function o(t, n) {
        var r = u.raw ? t : s(t);
        return e.isFunction(n) ? n(r) : r
    }

    var t = /\+/g, u = e.cookie = function (t, s, a) {
        if (s !== undefined && !e.isFunction(s)) {
            a = e.extend({}, u.defaults, a);
            if (typeof a.expires == "number") {
                var f = a.expires, l = a.expires = new Date;
                l.setTime(+l + f * 864e5)
            }
            return document.cookie = [n(t), "=", i(s), a.expires ? "; expires=" + a.expires.toUTCString() : "", a.path ? "; path=" + a.path : "", a.domain ? "; domain=" + a.domain : "", a.secure ? "; secure" : ""].join("")
        }
        var c = t ? undefined : {}, h = document.cookie ? document.cookie.split("; ") : [];
        for (var p = 0, d = h.length; p < d; p++) {
            var v = h[p].split("="), m = r(v.shift()), g = v.join("=");
            if (t && t === m) {
                c = o(g, s);
                break
            }
            !t && (g = o(g)) !== undefined && (c[m] = g)
        }
        return c
    };
    u.defaults = {}, e.removeCookie = function (t, n) {
        return e.cookie(t) === undefined ? !1 : (e.cookie(t, "", e.extend({}, n, {expires: -1})), !e.cookie(t))
    }
}), function (e) {
    function c(e, t) {
        var n = document.createElement("div"), r = '_<style type="text/css">';
        return t && (r = "_<style type=\"text/css\" data-for='result'>"), n.innerHTML = r + e + "</style>", n.removeChild(n.firstChild), document.getElementsByTagName("HEAD")[0].appendChild(n.firstChild), n.firstChild
    }

    var t = function () {
        var e = new Blob(['function str2uint8(e){var t=new ArrayBuffer(e.length),n=new Uint8Array(t);for(var r=0;r<e.length;r++)n[r]=e.charCodeAt(r);return n}function init(e){sampleRate=e.sampleRate,outputChannels=e.outputChannels,outputSampleRate=e.outputSampleRate,uid=e.uid,uid||(uid="test_uid")}function record(e){recBuffersL.push(e[0]),outputChannels==2&&recBuffersR.push(e[1])}function exportWAV(e){var t,n=mergeBuffers(recBuffersL);if(outputChannels==2){var r=mergeBuffers(recBuffersR);t=interleave(n,r)}else t=n;var i=encodeWAV(t),s=new Blob([i],{type:e});return s}function getBuffer(){var e=[];return e.push(mergeBuffers(recBuffersL)),outputChannels==2&&e.push(mergeBuffers(recBuffersR)),e}function getSendBuffer(e){var t="-BD**VR+gzgzip",n="\\r\\n",r={pfm:"iOS&1&1&1&1",ver:"1.0",enc:"utf-8",rtn:"json",pdt:"818",app_name:"com.baidu.www.voice",idx:sendIdx++ +"",fun:"1",glb:glb,uid:uid};e&&(r.idx="-"+r.idx);var i=JSON.stringify(r),s=new Zlib.Gzip(str2uint8(i)),o=s.compress();if(sendOffset>=recBuffersL.length&&!e){sendIdx--;return null;}recBuffersL.slice(sendOffset);var u=mergeBuffers(recBuffersL.slice(sendOffset));sendOffset=recBuffersL.length;var a="--"+t,f=new ArrayBuffer(o.byteLength+4+u.length*2+(n.length+n.length+a.length)*3+2),l=new DataView(f),c=0;return c=writeString(l,c,n+a+n),c=writeUint8Array(l,c,o),c=writeString(l,c,n+a+n),l.setUint32(c,1,!0),c+=4,c=writePcm(l,c,u),c=writeString(l,c,n+a+"--"+n),{buffer:f,boundary:t,json:r}}function clear(){recBuffersL=[],recBuffersR=[]}function mergeBuffers(e){var t=0;e.forEach(function(e){t+=e.length});var n=new Float32Array(t),r=0,i;for(i=0;i<e.length;i++)n.set(e[i],r),r+=e[i].length;var s=0,o=sampleRate/outputSampleRate,u=Math.ceil(t*outputSampleRate/sampleRate),a=new Float32Array(u);for(i=0;i<u;i++)a[i]=n[Math.floor(s)],s+=o;return a}function interleave(e,t){var n=e.length+t.length,r=new Float32Array(n),i=0,s=0;while(i<n)r[i++]=e[s],r[i++]=t[s],s++;return r}function floatTo16BitPCM(e,t,n){for(var r=0;r<n.length;r++,t+=2){var i=Math.max(-1,Math.min(1,n[r]));e.setInt16(t,i<0?i*32768:i*32767,!0)}}function writeUint8Array(e,t,n){for(var r=0;r<n.length;r++)e.setUint8(t+r,n[r]);return t+n.length}function writeString(e,t,n){for(var r=0;r<n.length;r++)e.setUint8(t+r,n.charCodeAt(r));return t+n.length}function writePcm(e,t,n){return floatTo16BitPCM(e,t,n),t+n.length*2}function encodeWAV(e){var t=new ArrayBuffer(44+e.length*2),n=new DataView(t);return writeString(n,0,"RIFF"),n.setUint32(4,32+e.length*2,!0),writeString(n,8,"WAVE"),writeString(n,12,"fmt "),n.setUint32(16,16,!0),n.setUint16(20,1,!0),n.setUint16(22,outputChannels,!0),n.setUint32(24,outputSampleRate,!0),n.setUint32(28,outputSampleRate,!0),n.setUint16(32,outputChannels*2,!0),n.setUint16(34,16,!0),writeString(n,36,"data"),n.setUint32(40,e.length*2,!0),floatTo16BitPCM(n,44,e),n}(function(){function r(t,r){var i=t.split("."),s=n;!(i[0]in s)&&s.execScript&&s.execScript("var "+i[0]);for(var o;i.length&&(o=i.shift());)!i.length&&r!==e?s[o]=r:s=s[o]?s[o]:s[o]={}}function s(e,t){this.index="number"==typeof t?t:0,this.f=0,this.buffer=e instanceof(i?Uint8Array:Array)?e:new(i?Uint8Array:Array)(32768);if(2*this.buffer.length<=this.index)throw Error("invalid index");this.buffer.length<=this.index&&o(this)}function o(e){var t=e.buffer,n,r=t.length,s=new(i?Uint8Array:Array)(r<<1);if(i)s.set(t);else for(n=0;n<r;++n)s[n]=t[n];return e.buffer=s}function p(e,t,n){var r,i="number"==typeof t?t:t=0,s="number"==typeof n?n:e.length;r=-1;for(i=s&7;i--;++t)r=r>>>8^v[(r^e[t])&255];for(i=s>>3;i--;t+=8)r=r>>>8^v[(r^e[t])&255],r=r>>>8^v[(r^e[t+1])&255],r=r>>>8^v[(r^e[t+2])&255],r=r>>>8^v[(r^e[t+3])&255],r=r>>>8^v[(r^e[t+4])&255],r=r>>>8^v[(r^e[t+5])&255],r=r>>>8^v[(r^e[t+6])&255],r=r>>>8^v[(r^e[t+7])&255];return(r^4294967295)>>>0}function m(e){this.buffer=new(i?Uint16Array:Array)(2*e),this.length=0}function g(e,t){this.h=y,this.j=0,this.input=i&&e instanceof Array?new Uint8Array(e):e,this.c=0,t&&(t.lazy&&(this.j=t.lazy),"number"==typeof t.compressionType&&(this.h=t.compressionType),t.outputBuffer&&(this.a=i&&t.outputBuffer instanceof Array?new Uint8Array(t.outputBuffer):t.outputBuffer),"number"==typeof t.outputIndex&&(this.c=t.outputIndex)),this.a||(this.a=new(i?Uint8Array:Array)(32768))}function E(e,t){this.length=e,this.k=t}function T(n,r){function s(e,n){var r=e.k,i=[],s=0,o;o=x[e.length],i[s++]=o&65535,i[s++]=o>>16&255,i[s++]=o>>24;var u;switch(t){case 1===r:u=[0,r-1,0];break;case 2===r:u=[1,r-2,0];break;case 3===r:u=[2,r-3,0];break;case 4===r:u=[3,r-4,0];break;case 6>=r:u=[4,r-5,1];break;case 8>=r:u=[5,r-7,1];break;case 12>=r:u=[6,r-9,2];break;case 16>=r:u=[7,r-13,2];break;case 24>=r:u=[8,r-17,3];break;case 32>=r:u=[9,r-25,3];break;case 48>=r:u=[10,r-33,4];break;case 64>=r:u=[11,r-49,4];break;case 96>=r:u=[12,r-65,5];break;case 128>=r:u=[13,r-97,5];break;case 192>=r:u=[14,r-129,6];break;case 256>=r:u=[15,r-193,6];break;case 384>=r:u=[16,r-257,7];break;case 512>=r:u=[17,r-385,7];break;case 768>=r:u=[18,r-513,8];break;case 1024>=r:u=[19,r-769,8];break;case 1536>=r:u=[20,r-1025,9];break;case 2048>=r:u=[21,r-1537,9];break;case 3072>=r:u=[22,r-2049,10];break;case 4096>=r:u=[23,r-3073,10];break;case 6144>=r:u=[24,r-4097,11];break;case 8192>=r:u=[25,r-6145,11];break;case 12288>=r:u=[26,r-8193,12];break;case 16384>=r:u=[27,r-12289,12];break;case 24576>=r:u=[28,r-16385,13];break;case 32768>=r:u=[29,r-24577,13];break;default:throw"invalid distance"}o=u,i[s++]=o[0],i[s++]=o[1],i[s++]=o[2];var a,f;a=0;for(f=i.length;a<f;++a)v[m++]=i[a];y[i[0]]++,b[i[3]]++,g=e.length+n-1,d=null}var o,u,a,f,l,c={},h,p,d,v=i?new Uint16Array(2*r.length):[],m=0,g=0,y=new(i?Uint32Array:Array)(286),b=new(i?Uint32Array:Array)(30),w=n.j,E;if(!i){for(a=0;285>=a;)y[a++]=0;for(a=0;29>=a;)b[a++]=0}y[256]=1,o=0;for(u=r.length;o<u;++o){a=l=0;for(f=3;a<f&&o+a!==u;++a)l=l<<8|r[o+a];c[l]===e&&(c[l]=[]),h=c[l];if(!(0<g--)){for(;0<h.length&&32768<o-h[0];)h.shift();if(o+3>=u){d&&s(d,-1),a=0;for(f=u-o;a<f;++a)E=r[o+a],v[m++]=E,++y[E];break}0<h.length?(p=N(r,o,h),d?d.length<p.length?(E=r[o-1],v[m++]=E,++y[E],s(p,0)):s(d,-1):p.length<w?d=p:s(p,0)):d?s(d,-1):(E=r[o],v[m++]=E,++y[E])}h.push(o)}return v[m++]=256,y[256]++,n.n=y,n.m=b,i?v.subarray(0,m):v}function N(e,t,n){var r,i,s=0,o,u,a,f,l=e.length;u=0,f=n.length;e:for(;u<f;u++){r=n[f-u-1],o=3;if(3<s){for(a=s;3<a;a--)if(e[r+a-1]!==e[t+a-1])continue e;o=s}for(;258>o&&t+o<l&&e[r+o]===e[t+o];)++o;o>s&&(i=r,s=o);if(258===o)break}return new E(s,t-i)}function C(e,t){var n=e.length,r=new m(572),s=new(i?Uint8Array:Array)(n),o,u,a,f,l;if(!i)for(f=0;f<n;f++)s[f]=0;for(f=0;f<n;++f)0<e[f]&&r.push(f,e[f]);o=Array(r.length/2),u=new(i?Uint32Array:Array)(r.length/2);if(1===o.length)return s[r.pop().index]=1,s;f=0;for(l=r.length/2;f<l;++f)o[f]=r.pop(),u[f]=o[f].value;a=k(u,u.length,t),f=0;for(l=o.length;f<l;++f)s[o[f].index]=a[f];return s}function k(e,t,n){function r(e){var n=f[e][l[e]];n===t?(r(e+1),r(e+1)):--u[n],++l[e]}var s=new(i?Uint16Array:Array)(n),o=new(i?Uint8Array:Array)(n),u=new(i?Uint8Array:Array)(t),a=Array(n),f=Array(n),l=Array(n),c=(1<<n)-t,h=1<<n-1,p,d,v,m,g;s[n-1]=t;for(d=0;d<n;++d)c<h?o[d]=0:(o[d]=1,c-=h),c<<=1,s[n-2-d]=(s[n-1-d]/2|0)+t;s[0]=o[0],a[0]=Array(s[0]),f[0]=Array(s[0]);for(d=1;d<n;++d)s[d]>2*s[d-1]+o[d]&&(s[d]=2*s[d-1]+o[d]),a[d]=Array(s[d]),f[d]=Array(s[d]);for(p=0;p<t;++p)u[p]=n;for(v=0;v<s[n-1];++v)a[n-1][v]=e[v],f[n-1][v]=v;for(p=0;p<n;++p)l[p]=0;1===o[n-1]&&(--u[0],++l[n-1]);for(d=n-2;0<=d;--d){m=p=0,g=l[d+1];for(v=0;v<s[d];v++)m=a[d+1][g]+a[d+1][g+1],m>e[p]?(a[d][v]=m,f[d][v]=t,g+=2):(a[d][v]=e[p],f[d][v]=p,++p);l[d]=0,1===o[d]&&r(d)}return u}function L(e){var t=new(i?Uint16Array:Array)(e.length),n=[],r=[],s=0,o,u,a,f;o=0;for(u=e.length;o<u;o++)n[e[o]]=(n[e[o]]|0)+1;o=1;for(u=16;o<=u;o++)r[o]=s,s+=n[o]|0,s<<=1;o=0;for(u=e.length;o<u;o++){s=r[e[o]],r[e[o]]+=1,a=t[o]=0;for(f=e[o];a<f;a++)t[o]=t[o]<<1|s&1,s>>>=1}return t}function A(e,t){this.input=e,this.c=this.i=0,this.d={},t&&(t.flags&&(this.d=t.flags),"string"==typeof t.filename&&(this.filename=t.filename),"string"==typeof t.comment&&(this.l=t.comment),t.deflateOptions&&(this.e=t.deflateOptions)),this.e||(this.e={})}var e=void 0,t=!0,n=this,i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView;s.prototype.b=function(e,t,n){var r=this.buffer,i=this.index,s=this.f,u=r[i],a;n&&1<t&&(e=8<t?(h[e&255]<<24|h[e>>>8&255]<<16|h[e>>>16&255]<<8|h[e>>>24&255])>>32-t:h[e]>>8-t);if(8>t+s)u=u<<t|e,s+=t;else for(a=0;a<t;++a)u=u<<1|e>>t-a-1&1,8===++s&&(s=0,r[i++]=h[u],u=0,i===r.length&&(r=o(this)));r[i]=u,this.buffer=r,this.f=s,this.index=i},s.prototype.finish=function(){var e=this.buffer,t=this.index,n;return 0<this.f&&(e[t]<<=8-this.f,e[t]=h[e[t]],t++),i?n=e.subarray(0,t):(e.length=t,n=e),n};var u=new(i?Uint8Array:Array)(256),a;for(a=0;256>a;++a){for(var f=a,l=f,c=7,f=f>>>1;f;f>>>=1)l<<=1,l|=f&1,--c;u[a]=(l<<c&255)>>>0}var h=u,d=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],v=i?new Uint32Array(d):d;m.prototype.getParent=function(e){return 2*((e-2)/4|0)},m.prototype.push=function(e,t){var n,r,i=this.buffer,s;n=this.length,i[this.length++]=t;for(i[this.length++]=e;0<n;){if(r=this.getParent(n),!(i[n]>i[r]))break;s=i[n],i[n]=i[r],i[r]=s,s=i[n+1],i[n+1]=i[r+1],i[r+1]=s,n=r}return this.length},m.prototype.pop=function(){var e,t,n=this.buffer,r,i,s;t=n[0],e=n[1],this.length-=2,n[0]=n[this.length],n[1]=n[this.length+1];for(s=0;;){i=2*s+2;if(i>=this.length)break;i+2<this.length&&n[i+2]>n[i]&&(i+=2);if(!(n[i]>n[s]))break;r=n[s],n[s]=n[i],n[i]=r,r=n[s+1],n[s+1]=n[i+1],n[i+1]=r,s=i}return{index:e,value:t,length:this.length}};var y=2,b=[],w;for(w=0;288>w;w++)switch(t){case 143>=w:b.push([w+48,8]);break;case 255>=w:b.push([w-144+400,9]);break;case 279>=w:b.push([w-256+0,7]);break;case 287>=w:b.push([w-280+192,8]);break;default:throw"invalid literal: "+w}g.prototype.g=function(){var n,r,o,u,a=this.input;switch(this.h){case 0:o=0;for(u=a.length;o<u;){r=i?a.subarray(o,o+65535):a.slice(o,o+65535),o+=r.length;var f=r,l=o===u,c=e,h=e,p=e,d=e,v=e,m=this.a,g=this.c;if(i){for(m=new Uint8Array(this.a.buffer);m.length<=g+f.length+5;)m=new Uint8Array(m.length<<1);m.set(this.a)}c=l?1:0,m[g++]=c|0,h=f.length,p=~h+65536&65535,m[g++]=h&255,m[g++]=h>>>8&255,m[g++]=p&255,m[g++]=p>>>8&255;if(i)m.set(f,g),g+=f.length,m=m.subarray(0,g);else{d=0;for(v=f.length;d<v;++d)m[g++]=f[d];m.length=g}this.c=g,this.a=m}break;case 1:var w=new s(i?new Uint8Array(this.a.buffer):this.a,this.c);w.b(1,1,t),w.b(1,2,t);var E=T(this,a),S,x,N;S=0;for(x=E.length;S<x;S++)if(N=E[S],s.prototype.b.apply(w,b[N]),256<N)w.b(E[++S],E[++S],t),w.b(E[++S],5),w.b(E[++S],E[++S],t);else if(256===N)break;this.a=w.finish(),this.c=this.a.length;break;case y:var k=new s(i?new Uint8Array(this.a.buffer):this.a,this.c),A,O,M,_,D,P=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],H,B,j,I,q,R=Array(19),U,z,W,X,$;A=y,k.b(1,1,t),k.b(A,2,t),O=T(this,a),H=C(this.n,15),B=L(H),j=C(this.m,7),I=L(j);for(M=286;257<M&&0===H[M-1];M--);for(_=30;1<_&&0===j[_-1];_--);var J=M,K=_,Q=new(i?Uint32Array:Array)(J+K),G,Y,Z,et,tt=new(i?Uint32Array:Array)(316),nt,rt,it=new(i?Uint8Array:Array)(19);for(G=Y=0;G<J;G++)Q[Y++]=H[G];for(G=0;G<K;G++)Q[Y++]=j[G];if(!i){G=0;for(et=it.length;G<et;++G)it[G]=0}G=nt=0;for(et=Q.length;G<et;G+=Y){for(Y=1;G+Y<et&&Q[G+Y]===Q[G];++Y);Z=Y;if(0===Q[G])if(3>Z)for(;0<Z--;)tt[nt++]=0,it[0]++;else for(;0<Z;)rt=138>Z?Z:138,rt>Z-3&&rt<Z&&(rt=Z-3),10>=rt?(tt[nt++]=17,tt[nt++]=rt-3,it[17]++):(tt[nt++]=18,tt[nt++]=rt-11,it[18]++),Z-=rt;else if(tt[nt++]=Q[G],it[Q[G]]++,Z--,3>Z)for(;0<Z--;)tt[nt++]=Q[G],it[Q[G]]++;else for(;0<Z;)rt=6>Z?Z:6,rt>Z-3&&rt<Z&&(rt=Z-3),tt[nt++]=16,tt[nt++]=rt-3,it[16]++,Z-=rt}n=i?tt.subarray(0,nt):tt.slice(0,nt),q=C(it,7);for(X=0;19>X;X++)R[X]=q[P[X]];for(D=19;4<D&&0===R[D-1];D--);U=L(q),k.b(M-257,5,t),k.b(_-1,5,t),k.b(D-4,4,t);for(X=0;X<D;X++)k.b(R[X],3,t);X=0;for($=n.length;X<$;X++)if(z=n[X],k.b(U[z],q[z],t),16<=z){X++;switch(z){case 16:W=2;break;case 17:W=3;break;case 18:W=7;break;default:throw"invalid code: "+z}k.b(n[X],W,t)}var st=[B,H],ot=[I,j],ut,at,ft,lt,ct,ht,pt,dt;ct=st[0],ht=st[1],pt=ot[0],dt=ot[1],ut=0;for(at=O.length;ut<at;++ut)if(ft=O[ut],k.b(ct[ft],ht[ft],t),256<ft)k.b(O[++ut],O[++ut],t),lt=O[++ut],k.b(pt[lt],dt[lt],t),k.b(O[++ut],O[++ut],t);else if(256===ft)break;this.a=k.finish(),this.c=this.a.length;break;default:throw"invalid compression type"}return this.a};var S=function(){function e(e){switch(t){case 3===e:return[257,e-3,0];case 4===e:return[258,e-4,0];case 5===e:return[259,e-5,0];case 6===e:return[260,e-6,0];case 7===e:return[261,e-7,0];case 8===e:return[262,e-8,0];case 9===e:return[263,e-9,0];case 10===e:return[264,e-10,0];case 12>=e:return[265,e-11,1];case 14>=e:return[266,e-13,1];case 16>=e:return[267,e-15,1];case 18>=e:return[268,e-17,1];case 22>=e:return[269,e-19,2];case 26>=e:return[270,e-23,2];case 30>=e:return[271,e-27,2];case 34>=e:return[272,e-31,2];case 42>=e:return[273,e-35,3];case 50>=e:return[274,e-43,3];case 58>=e:return[275,e-51,3];case 66>=e:return[276,e-59,3];case 82>=e:return[277,e-67,4];case 98>=e:return[278,e-83,4];case 114>=e:return[279,e-99,4];case 130>=e:return[280,e-115,4];case 162>=e:return[281,e-131,5];case 194>=e:return[282,e-163,5];case 226>=e:return[283,e-195,5];case 257>=e:return[284,e-227,5];case 258===e:return[285,e-258,0];default:throw"invalid length: "+e}}var n=[],r,i;for(r=3;258>=r;r++)i=e(r),n[r]=i[2]<<24|i[1]<<16|i[0];return n}(),x=i?new Uint32Array(S):S;A.prototype.g=function(){var t,n,r,s,o,u,a,f,l=new(i?Uint8Array:Array)(32768),c=0,h=this.input,d=this.i,v=this.filename,m=this.l;l[c++]=31,l[c++]=139,l[c++]=8,t=0,this.d.fname&&(t|=_),this.d.fcomment&&(t|=D),this.d.fhcrc&&(t|=M),l[c++]=t,n=(Date.now?Date.now():+(new Date))/1e3|0,l[c++]=n&255,l[c++]=n>>>8&255,l[c++]=n>>>16&255,l[c++]=n>>>24&255,l[c++]=0,l[c++]=O;if(this.d.fname!==e){a=0;for(f=v.length;a<f;++a)u=v.charCodeAt(a),255<u&&(l[c++]=u>>>8&255),l[c++]=u&255;l[c++]=0}if(this.d.comment){a=0;for(f=m.length;a<f;++a)u=m.charCodeAt(a),255<u&&(l[c++]=u>>>8&255),l[c++]=u&255;l[c++]=0}return this.d.fhcrc&&(r=p(l,0,c)&65535,l[c++]=r&255,l[c++]=r>>>8&255),this.e.outputBuffer=l,this.e.outputIndex=c,o=new g(h,this.e),l=o.g(),c=o.c,i&&(c+8>l.buffer.byteLength?(this.a=new Uint8Array(c+8),this.a.set(new Uint8Array(l.buffer)),l=this.a):l=new Uint8Array(l.buffer)),s=p(h,e,e),l[c++]=s&255,l[c++]=s>>>8&255,l[c++]=s>>>16&255,l[c++]=s>>>24&255,f=h.length,l[c++]=f&255,l[c++]=f>>>8&255,l[c++]=f>>>16&255,l[c++]=f>>>24&255,this.i=d,i&&c<l.length&&(this.a=l=l.subarray(0,c)),l};var O=255,M=2,_=8,D=16;r("Zlib.Gzip",A),r("Zlib.Gzip.prototype.compress",A.prototype.g)}).call(this);var createUUID=function(e,t){return function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(e,t).toUpperCase()}}(/[xy]/g,function(e){var t=Math.random()*16|0,n=e=="x"?t:t&3|8;return n.toString(16)}),recBuffersL=[],recBuffersR=[],outputChannels,outputSampleRate,sendOffset=0,glb=createUUID(),sendIdx=1,uid="",sampleRate;this.onmessage=function(e){var t;switch(e.data.command){case"reinit":recBuffersL=[],recBuffersR=[],sendOffset=0,sendIdx=1,glb=createUUID();break;case"init":init(e.data.config);break;case"record":record(e.data.buffer);break;case"exportWAV":t=exportWAV(e.data.type),this.postMessage({data:t,eventId:e.data.eventId});break;case"getBuffer":t=getBuffer(),this.postMessage({data:t,eventId:e.data.eventId});break;case"getSendBuffer":t=getSendBuffer(),this.postMessage({data:t,eventId:e.data.eventId});break;case"getLastSendBuffer":t=getSendBuffer(!0),this.postMessage({data:t,eventId:e.data.eventId});break;case"clear":clear()}};'], {type: "text/javascript"});
        return URL.createObjectURL(e)
    }, n, r, i = function (e, n) {
        function c(e, t) {
            var n = parseInt(Math.random() * 1e5) + "_" + (new Date).getTime();
            e && (e.eventId = n), f.postMessage(e), t && (l[n] = t)
        }

        function w(e, t) {
            if (!t && m.length > 4)return;
            e.getSendBuffer(function (r) {
                if (!r)return;
                b = e.glb = r.json.glb;
                var i = $.ajax({
                    url: n.url,
                    cache: !1,
                    contentType: "Content-Type: multipart/form-data; boundary=" + r.boundary,
                    dataType: "json",
                    data: r.buffer,
                    processData: !1,
                    type: "post"
                });
                m.push(i), i.always(function (n) {
                    m = $.grep(m, function (e) {
                        return i !== e
                    });
                    if (n && n.result && n.result.err_no != 0) {
                        $.each(m, function (e, t) {
                            t.abort()
                        }), m = [], d.fail.fire(n), h = !1;
                        return
                    }
                    n && n.content && n.content.item && (y = n, d.result.fire(n)), (n && n.result && (n.result.res_type == 3 || n.result.res_type == 5) || !n.result) && e.stop(!0);
                    if (t || n && n.result && n.result.idx < 0)$.each(m, function (e, t) {
                        t.abort()
                    }), m = [], y ? d.finish.fire(y) : d.fail.fire(n), h = !1, clearInterval(p)
                })
            }, t)
        }

        if (e.ended)return !1;
        r || (r = this.context = new AudioContext);
        var i = this.source = r.createMediaStreamSource(e), s = $.extend({timeout: 5e3}, n);
        s.eq;
        var o = s.bufferLen || 4096;
        this.context = i.context;
        var u = 1, a = 1;
        this.node = this.context.createScriptProcessor(o, u, a);
        var f = new Worker(s.workerPath || t());
        f.postMessage({
            command: "init",
            config: {
                outputChannels: a,
                outputSampleRate: 8e3,
                uid: $.cookie("BAIDUID"),
                sampleRate: this.context.sampleRate
            }
        });
        var l = {};
        f.onmessage = function (e) {
            e.data && e.data.eventId && typeof l[e.data.eventId] == "function" && (l[e.data.eventId](e.data.data), l[e.data.eventId] = null)
        };
        var h = !1;
        this.node.onaudioprocess = function (e) {
            if (!h)return;
            var t = [], n;
            for (n = 0; n < a; n++)t.push(e.inputBuffer.getChannelData(n));
            c({command: "record", buffer: t}), d.audioprocess.fire(e)
        }, this.configure = function (e) {
            for (var t in e)e.hasOwnProperty(t) && (s[t] = e[t])
        }, this.reinit = function () {
            f.postMessage({command: "reinit"}), y = null
        };
        var p;
        this.start = function () {
            if (h)return;
            this.reinit(), d.start.fire(), w(this), h = !0, p = setInterval(function () {
                w(v)
            }, 100)
        };
        var d = {}, v = this;
        $.each(["audioprocess", "stop", "start", "finish", "stop", "result", "fail", "noUserMedia"], function (e, t) {
            d[t] = $.Callbacks(), v["on" + t] = function (e) {
                d[t].add(e)
            }
        }), this.removeEventListener = function (e, t) {
            typeof t == "undefined" ? d[e].empty() : d[e].remove(t)
        }, e && e.addEventListener && e.addEventListener("ended", function () {
            d.noUserMedia.fire(), e.removeEventListener(arguments.callee)
        }), this.stop = function (e) {
            h && (e ? ($.each(m, function (e, t) {
                t.abort()
            }), m = [], y ? d.finish.fire(y) : d.fail.fire()) : w(this, !0), d.stop.fire(), g && clearTimeout(g)), clearInterval(p), h = !1
        }, this.clear = function () {
            c({command: "clear"}, cb)
        }, this.getBuffer = function (e) {
            c({command: "getBuffer"}, e)
        }, this.getSendBuffer = function (e, t) {
            var n = t ? "getLastSendBuffer" : "getSendBuffer";
            c({command: n}, e)
        }, this.exportWAV = function (e, t) {
            c({command: "exportWAV", type: t}, e)
        }, i.connect(this.node), this.node.connect(this.context.destination);
        var m = [], g, y, b = this.glb = ""
    };
    e.URL = e.URL || e.webkitURL, navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia, e.AudioContext = e.AudioContext || e.webkitAudioContext, i.support = function () {
        return !navigator.getUserMedia || !e.URL ? !1 : e.AudioContext ? e.Worker ? !0 : !1 : !1
    };
    var s, o = !1, u = $("body"), a = function () {
        var e, t, n, r, i, s, o;
        return function (u) {
            function f() {
                s.show(), u.removeEventListener("audioprocess"), u.onaudioprocess(function (e) {
                    var t = e.inputBuffer.getChannelData(0), n = Math.max.apply(Math, t), s = (1 - n) * (1 - n) * 56;
                    r.height(s);
                    var o = n * 100;
                    i.css({
                        width: o + 100 + "px",
                        height: o + 100 + "px",
                        "border-radius": o + 100 + "px",
                        margin: 91 - o / 2 + "px 0 0 -" + (o / 2 + 50) + "px"
                    })
                })
            }

            function l() {
                this.removeEventListener("audioprocess"), i.get(0).style.cssText = "", r.get(0).style.cssText = "", s.hide()
            }

            if (!e) {
                var a = ['<div class="default-tip">点击麦克风，开始说话</div>', '<div class="result"></div>', '<div class="voice_inner_html5">', '<div class="voice-btn-text">请尽量使用普通话<br />连接外置麦克风效果会更好哦</div>', '<img class="voice-btn" src="' + $CONFIG["paths.static"] + 'home/img/mic_act.png">', '<div class="box">', '<div class="box_inner"></div>', "</div>", '<div class="round2"></div>', '<div class="round1"></div>', '<div class="round3"></div>', "</div>"].join("");
                e = $(a), t = $(".voice-btn", e), r = $(".box_inner", e), i = $(".round3", e), o = $(".voice-btn-text", e), s = $(".round2,.round1", e), s.hide()
            }
            t.on("click", function () {
                var e = t.attr("data-type");
                e === "open" ? (l(u), u.stop(), t.attr("data-type", "stop")) : (u.start(), f(), t.attr("data-type", "open"))
            }), u.openUI = function () {
                e.appendTo($("#eui-main-body .try .trybox .actionbox.asr")), n = $("#eui-main-body .try .trybox .actionbox.asr .default-tip"), o.show(), n.removeClass("waiting")
            }, u.onnoUserMedia(function () {
                u.stop(!0)
            }), u.onfinish(function () {
                n.removeClass("waiting"), l(u), o.show(), t.attr("data-type", "stop")
            }), u.onresult(function (e) {
                n.html(e.content.item[0])
            }), u.onstart(function () {
                o.hide(), n.html("请说话"), n.addClass("waiting")
            }), u.onfail(function (e) {
                var r = "识别失败，请点击下面按钮后再说一次";
                e && e.result && e.result.err_no == "-3005" && (r = "没听清楚，请点击下面按钮后再说一次"), n.html(r), o.show(), n.removeClass("waiting"), l(u), t.attr("data-type", "stop")
            })
        }
    }(), f = !1, l;
    i.init = function (t) {
        var r = $.Deferred();
        if (n) {
            var s = new i(n, t);
            a(s), r.resolve(s)
        } else navigator.getUserMedia({audio: !0}, function (s) {
            n = s, f || (f = !0, $(e).on("focus", function () {
                l && (clearTimeout(l), l = !1)
            }));
            var o = new i(n, t);
            a(o), r.resolve(o)
        }, function () {
            r.reject()
        });
        return r
    }, i.forceDownload = function (t, n) {
        var r = URL.createObjectURL(t), i = e.document.createElement("a");
        i.href = r, i.download = n || "output.wav";
        var s = document.createEvent("Event");
        s.initEvent("click", !0, !0), i.dispatchEvent(s)
    }, i.addStartBtn = function (e) {
        $('<span class="ipt_rec"></span>').prependTo($("#kw").parent()), e = e || ".ipt_rec{z-index:1;display:none;position:absolute;right:0;height:32px;width:30px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAMAAAANxBKoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1QzhBRTc4QUQxQURFNDExOThEMzhEMjQzRjc4OTk1NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyMUNGNTJENUIwM0UxMUU0QUE5Q0I1NUY4NEU2NEE3QyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyMUNGNTJENEIwM0UxMUU0QUE5Q0I1NUY4NEU2NEE3QyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYxOEFFNzhBRDFBREU0MTE5OEQzOEQyNDNGNzg5OTU1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVDOEFFNzhBRDFBREU0MTE5OEQzOEQyNDNGNzg5OTU1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7GDGFwAAAIRQTFRFsbGx09PTs7Oznp6e+Pj4ysrK9/f34ODgqKio+/v7m5ub8fHxpaWlr6+vnZ2dpqam4eHhtbW17+/vt7e36Ojo1NTU2dnZ+fn5qamp6urq4+PjxsbGoaGhrq6uoqKiu7u78PDwz8/Purq6/f39+vr6nJycycnJ0NDQ4uLi0tLSmZmZ// // u30gbgAAAN1JREFUeNrs1dcOgjAUBuCW0lL2RnHv8fv+76c4IkQLNfHCRM4Fp00+bs4AcvokyP/qyGDMsDQ1xzW4lo7gUNOkDiwdbYBWaQlDRzOYVTLBdDTQzL3+DU3IqyakXTc7r9ZDlM+p2l+nqsRQpefIL0+rPrE5VipNMa1tw646+ziqtAhwuG1aENw2bYStUFaQwxON10OM1fW2JfzB8zrwITct3XFnCLPHJQsxcVt7mUggLty1vShiQCYdnbc5wz0Yt7vnRNDUA7yUCt0v25uJ+nlNHjUh39f9P+0jfRZgAC77RDy7MTXTAAAAAElFTkSuQmCC) no-repeat center;background-size:25px 25px;background-position:0 50%;cursor:pointer}.ipt_rec:hover{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAMAAAANxBKoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1QzhBRTc4QUQxQURFNDExOThEMzhEMjQzRjc4OTk1NSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxNjY1MjJDOUIwM0UxMUU0OTVBNEJDRTlDQTdDMTA3QyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNjY1MjJDOEIwM0UxMUU0OTVBNEJDRTlDQTdDMTA3QyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjYxOEFFNzhBRDFBREU0MTE5OEQzOEQyNDNGNzg5OTU1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVDOEFFNzhBRDFBREU0MTE5OEQzOEQyNDNGNzg5OTU1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+4sUn+wAAAL1QTFRFXp// YqH/pMn/8Pb/N4f/v9n/7vX/MYT/wNn/Nof/S5P/XZ7/9vr/8ff/o8j/kb3/TZX/RI// z+L/3+z/7/b/4e3/kr7/R5H/NYb/aqb/k77/Wpz/LYH/ZqT/8vf/ncT/Poz/WJv/ncX/osj/4O3/MoT/M4X/1OX/RpD/sdH/+Pv/irn/car/0+X/SZL/+/3/S5T/cqv/pcn/9fn/stH/psr/vtj/w9v/PYv/WZz/yN7/4+7/kL3/LIH// // /484UWgAAAPFJREFUeNrslccOwjAQRO00SAihJ9TQe+91+P/PIgGiEIHBSByQYA/eXev5sjO2yfGdIL9Lh6mqUpmTzuMcMS46jJAgRoUQZB6awnBTGZSHliC6SYTEQwPB/Ke/gybkniaESUcCyqv+3iM6jqHvqtrZVW3EWfQUM2eVHcdGPccuMWDRBqo3t+Hg1lvUWbTSwvpy07JZunKrHZoKc4IxdJTA8RH67Hn3JijYfmsXoM2fqJOpwEp6TdLCJvNUy5SGYqm7H+uNRakILfVCed2UcA3J1F/7JC3kEkAiJ6R5X7YHjvp6mngzIW/Rkf8v9XH6JMAA4NrUl+9owZwAAAAASUVORK5CYII=)}", c(e, "forResult")
    }, i.addStyle = function () {
        i.addStartBtn();
        var e = "";
        c(e, "forResult")
    }, i.addStyleEle = c, e.Recorder = i
}(window), (!Recorder.support() || location.href.match(/voice_flash=1/)) && function () {
    var e = Recorder.addStartBtn, t = Recorder.removeMask, n = Recorder.addStyleEle;
    (function () {
        function h(e) {
            var t = [];
            for (var n in e)t.push('"' + n + '":' + '"' + e[n] + '"');
            return "{" + t.join(",") + "}"
        }

        var r = "11.1.0", i = "playerProductInstall.swf", s = {}, o = {};
        o.quality = "high", o.bgcolor = "#ffffff", o.allowscriptaccess = "always", o.allowfullscreen = "false";
        var u = {};
        u.id = "flash_recorder", u.name = "flash_recorder", u.align = "middle";
        var a = !1, f = function (e) {
            var t = this, n = {
                timeout: 5e3,
                BlueMicoUrl: window.$CONFIG["paths.static"] + "common/widget/voice/img/start_btn_flash.png",
                GrayMicoUrl: window.$CONFIG["paths.static"] + "common/widget/voice/img/start_btn_disabled_flash.png",
                swfUrl: window.$CONFIG["paths.static"] + "common/widget/voice/flash_recorder.swf"
            };
            $.extend(t, n, e), this.callbacks = {}, $.each(["stop", "start", "finish", "result", "fail"], function (e, n) {
                t.callbacks[n] = $.Callbacks(), t["on" + n] = function (e) {
                    t.callbacks[n].add(e)
                }
            })
        };
        f.addStyle = function () {
            var t = ".ipt_rec{z-index:1;display:none;position:absolute;right:0;height:32px;width:30px;background:url(" + window.$CONFIG["paths.static"] + "preview/img/mic_flash.png" + ") no-repeat;background-position:-20px 4px;background-color:#fff;cursor:pointer;}.ipt_rec:hover{background-position:-20px -24px;}";
            e(t);
            var r = "";
            n(r, "forResult")
        };
        var l = function () {
            var e, n, f;
            return function (f) {
                if (!e) {
                    var l = ['<div class="default-tip">点击麦克风，开始说话</div>', '<div class="voice_inner">', '<div class="voice-btn-text">请尽量使用普通话<br />连接外置麦克风效果会更好哦</div>', '<div id="voice_flashContent"></div>', "</div>"].join("");
                    $(l).appendTo("#eui-main-body .try .trybox .actionbox.asr"), n = $("#eui-main-body .try .trybox .actionbox.asr .default-tip"), btnText = $("#eui-main-body .try .trybox .actionbox.asr .voice-btn-text"), n.html(""), swfobject.embedSWF(f.swfUrl, "voice_flashContent", "300", "300", r, i, s, o, u, function (e) {
                        f.swf = e.ref
                    }), $(".dialog-close", e).click(function () {
                        a || f.stop(!0), f.closeUI(), t()
                    })
                }
                f.closeUI = function () {
                    e.css("margin-top", "-32767px"), t(), f.stop()
                }, f.openUI = function () {
                    e.css("margin-top", ""), btnText.show()
                }, f.onstop(function () {
                    n.removeClass("waiting")
                }), f.onfinish(function () {
                }), f.onresult(function (e) {
                    n.html(e.content.item[0])
                }), f.onstart(function () {
                    btnText.hide(), n.addClass("waiting"), n.html("请说话")
                }), f.onfail(function (e) {
                    var t = "识别失败，请点击下面按钮后再说一次";
                    e && e.result && e.result.err_no == "-3005" && (t = "没听清楚，请点击下面按钮后再说一次"), n.removeClass("waiting"), n.html(t)
                }), c.defer.done(function () {
                    f.start(), f.stop()
                })
            }
        }();
        f.support = function () {
            return swfobject.hasFlashPlayerVersion(r)
        }, f.flash_loaded = function () {
            c.defer.resolve(c.obj)
        }, f.flash_noMicrophone = function () {
            c.obj.BlueMicoUrl = c.obj.GrayMicoUrl, c.obj.config(), a = !0, c.defer.reject()
        }, f.recorder_enable = function () {
        }, f.recorder_disabled = function () {
        }, $.each(["start", "stop", "finish", "result", "fail"], function (e, t) {
            f[t] = function (e) {
                if (!c)throw new Error(t + " be called before recorder initial");
                var n = c.obj;
                e = e && $.parseJSON(e), n.callbacks[t].fire(e)
            }
        });
        var c;
        f.init = function (e) {
            var t = $.Deferred(), n = !1;
            return c && (n = !0), c = c || {}, c.defer = t, c.obj = c.obj || new f(e), l(c.obj), n && t.resolve(c.obj), t
        }, $.extend(f.prototype, {
            clear: function () {
                var e = this;
                for (var t in e.callbacks)e.callbacks[t].empty()
            }, config: function () {
                var e = this;
                e.configed || (e.swf.config(h({
                    timeout: e.timeout,
                    server: e.url,
                    BlueMicoUrl: e.BlueMicoUrl,
                    GrayMicoUrl: e.GrayMicoUrl
                })), e.configed = !0)
            }, start: function () {
                var e = this;
                e.config(), e.swf.startRecord()
            }, stop: function () {
                this.swf.stopRecord()
            }, close: function () {
                this.swf.closeRecord()
            }
        }), window.Recorder = f
    })()
}(window), typeof define == "function" && define("Recorder", [], function () {
    return window.Recorder
}), define("common/widget/voice/voiceRecorder", ["require", "common/lib/swfobject/swfobject", "jquery.cookie", "Recorder"], function (e) {
    function n() {
        this.init()
    }

    e("common/lib/swfobject/swfobject"), e("jquery.cookie");
    var t = e("Recorder");
    return $.extend(n.prototype, {
        init: function () {
            if (!t || !t.support())return;
            window.__supportvoice = !0;
            var e = t.init({url: "http://vse.baidu.com/echo.fcgi"});
            e.done(function (e) {
                e.openUI()
            }).fail(function () {
                alert("不能获得麦克风的权限")
            })
        }
    }), n
}), require(["common/widget/slide/slide_focus", "common/widget/slide/slide_focus_simple", "common/widget/voice/voiceSpeech", "common/widget/voice/voiceRecorder"], function (e, t, n, r) {
    (function () {
        var t = $("#js-focus-play-01 .main-focus-item-01 .m"), n = 300;
        t.delay(n).fadeIn(400, function () {
            (new e({
                pic: $("#js-focus-play-01 .pic-txt"),
                btnL: $("#js-focus-play-01 .btn-l"),
                btnR: $("#js-focus-play-01 .btn-r"),
                nav: $("#js-focus-play-01 .img-nav li"),
                s: 3e3,
                callback: function (e, t) {
                    t.find(".m").fadeOut(), e.find(".pic").css({display: "none"}).stop(!0, !0).fadeIn(), e.find(".m").delay(n).fadeIn("slow")
                }
            })).init()
        })
    })(), (new t({
        pic: $(".foucs-02 .foucs-02-pic"),
        nav: $(".foucs-02 .foucs-02-nav li")
    })).init(), (new n($("#eui-main-body .try .trybox .tts"))).init(), $("#eui-main-body .try .trybox .trybtn .asr").on("click", function () {
        $(this).addClass("s"), $(this).next().removeClass("s"), $("#eui-main-body .try .trybox .actionbox.asr").show(), $("#eui-main-body .try .trybox .actionbox.tts").hide(), new r
    }), $("#eui-main-body .try .trybox .trybtn .tts").on("click", function () {
        $(this).addClass("s"), $(this).prev().removeClass("s"), $("#eui-main-body .try .trybox .actionbox.tts").show(), $("#eui-main-body .try .trybox .actionbox.asr").hide()
    })
}), define("home/index", function () {
});