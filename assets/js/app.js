//霑ｽ蜉�縺昴���
var std = L.tileLayer(
    "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
    {
        attribution:
            "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>蝨ｰ逅�劼繧ｿ繧､繝ｫ�域ｨ呎ｺ門慍蝗ｳ��</a>",
        maxNativeZoom: 18,
        maxZoom: 18,
        opacity: 1,
    }
);
var pale = L.tileLayer(
    "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
    {
        attribution:
            "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>蝨ｰ逅�劼繧ｿ繧､繝ｫ�域ｷ｡濶ｲ蝨ｰ蝗ｳ��</a>",
        maxNativeZoom: 18,
        maxZoom: 18,
        opacity: 1,
    }
);
var blank = L.tileLayer(
    "https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png",
    {
        attribution:
            "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>蝨ｰ逅�劼繧ｿ繧､繝ｫ�育區蝨ｰ蝗ｳ��</a>",
        maxNativeZoom: 18,
        maxZoom: 18,
        opacity: 1,
    }
);
var english = L.tileLayer(
    "https://cyberjapandata.gsi.go.jp/xyz/english/{z}/{x}/{y}.png",
    {
        attribution:
            "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>蝨ｰ逅�劼繧ｿ繧､繝ｫ��English��</a>",
        maxNativeZoom: 18,
        maxZoom: 18,
        opacity: 1,
    }
);

var baseLayers = {
    "蝨ｰ逅�劼繧ｿ繧､繝ｫ�域ｨ呎ｺ門慍蝗ｳ��": std,
    "蝨ｰ逅�劼繧ｿ繧､繝ｫ�域ｷ｡濶ｲ蝨ｰ蝗ｳ��": pale,
    "蝨ｰ逅�劼繧ｿ繧､繝ｫ�育區蝨ｰ蝗ｳ��": blank,
    "蝨ｰ逅�劼繧ｿ繧､繝ｫ��English��": english,
};
//縺薙％縺ｾ縺ｧ

var MapManager = (function () {
        function r(t) {
            void 0 === t && (t = "map"),
                (this.func_graph_coordinate_click = function (t) {}),
                (this.func_graph_baseline_click = function (t) {}),
                (this.func_vector_calculation = function (t) {
                    return {
                        value: t,
                        color: "red",
                    };
                }),
                (this.AREA = {
                    Overview: [32.8803439, 138.3523302, 4],
                    Hokkaido: [43.504737, 144.173584, 7],
                    Tohoku: [39.2858809, 139.8613579, 7],
                    Kanto_Chubu: [36.0502636, 137.3554005, 7],
                    Kinki_Chugoku_Shikoku: [34.7458527, 132.722616, 7],
                    Kyusyu: [32.5586318, 129.9499364, 7],
                    Okinawa: [26.583644, 127.220262, 7],
                }),
                (this.drawVecThreshold = 0),
                (this.has_stations = !1),
                this._fetch_stations(),
                //     this.map=L.map(t),L.tileLayer(r.is_en?r.MAP_URL_EN:r.MAP_URL,{
                //     	 attribution:r.is_en?"<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>GSI Tile</a>":
                //     "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>蝨ｰ逅�劼繧ｿ繧､繝ｫ</a>"}).addTo(this.map),
                //霑ｽ蜉�縺昴���
                (this.map = L.map(t, {
                    layers: r.is_en ? english : pale,
                })),
                r.is_en
                    ? L.control
                          .layers(
                              {
                                  std: std,
                                  pale: pale,
                                  blank: blank,
                                  english: english,
                              },
                              null,
                              {
                                  position: "bottomleft",
                              }
                          )
                          .addTo(this.map)
                    : L.control
                          .layers(
                              {
                                  std: std,
                                  pale: pale,
                                  blank: blank,
                                  English: english,
                              },
                              null,
                              {
                                  position: "bottomleft",
                              }
                          )
                          .addTo(this.map),
                //縺薙％縺ｾ縺ｧ
                this._init_info();
        }
        return (
            (r.prototype.set_zoom_action = function (t) {
                this.map.on("zoomend", t);
            }),
            (r.prototype.change_location = function (t) {
                var e = this.AREA[t];
                this.map.setView([e[0], e[1]], e[2]);
            }),
            (r.prototype.mark_vector = function (r, t) {
                var s = this;
                void 0 === r && (r = !1), void 0 === t && (t = null);
                var _ = this.drawVecThreshold * this.drawVecThreshold;
                Util.ajax_vectors(t, this.base_station_code, r).done(function (
                    t
                ) {
                    s._set_info_html([t.start_date, t.end_date]),
                        t.vectors.forEach(function (t) {
                            var e = s.stations.get(t[0]);
                            if (e && (!r || e[4] == r)) {
                                var a = [parseFloat(e[2]), parseFloat(e[3])];
                                if (e[0] == s.base_station_code)
                                    (s.base_station_code = e[0]),
                                        s._marke_station_for_vecotr_base(a),
                                        s._marke_station_for_vecotr(
                                            t,
                                            a,
                                            e[1],
                                            "B"
                                        );
                                else {
                                    var n = parseFloat(t[1]),
                                        o = parseFloat(t[2]),
                                        i = parseFloat(t[3]);
                                    _ < n * n + o * o + i * i &&
                                        s._draw_svg_vector(
                                            a,
                                            s.func_vector_calculation([n, o, i])
                                        ),
                                        s._marke_station_for_vecotr(
                                            t,
                                            a,
                                            e[1],
                                            "R"
                                        );
                                }
                            }
                        });
                });
            }),
            (r.prototype.mark_graph_coordinate = function (a) {
                var n = this;
                void 0 === a && (a = !1),
                    this.stations.forEach(function (t, e) {
                        if (!(t[0] && t[1] && t[2] && t[3])) return !0;
                        (a && t[4] != a) ||
                            n._marke_station(
                                t[0],
                                [parseFloat(t[2]), parseFloat(t[3])],
                                t[1],
                                n.func_graph_coordinate_click
                            );
                    });
            }),
            (r.prototype.mark_graph_baseline = function (a) {
                var n = this;
                void 0 === a && (a = !1),
                    this.stations.forEach(function (t, e) {
                        if (!(t[0] && t[1] && t[2] && t[3])) return !0;
                        (a && t[4] != a) ||
                            n._marke_station(
                                t[0],
                                [parseFloat(t[2]), parseFloat(t[3])],
                                t[1],
                                n.func_graph_baseline_click
                            );
                    });
            }),
            (r.prototype.get_current_zoom = function () {
                return this.map._zoom;
            }),
            (r.prototype.reset_layer = function () {
                for (var t in this.map._layers)
                    null == this.map._layers[t]._url &&
                        this.map.removeLayer(this.map._layers[t]);
                this.info_small.remove();
            }),
            (r.prototype.set_func_vector_calculation = function (t) {
                this.func_vector_calculation = t;
            }),
            (r.prototype.set_func_graph_coordinate_click = function (t) {
                this.func_graph_coordinate_click = t;
            }),
            (r.prototype.set_func_graph_baseline_click = function (t) {
                this.func_graph_baseline_click = t;
            }),
            (r.prototype.set_mode_change_base_station_flg = function (t) {
                this.mode_change_base_station_flg = t;
            }),
            (r.prototype.change_mark_vector_base_station = function () {
                this.mark_vector_base_station(this.target_base_station_code);
            }),
            (r.prototype.mark_vector_base_station = function (a) {
                var n = this;
                this.stations.forEach(function (t, e) {
                    return (
                        !(t[0] && t[1] && t[2] && t[3]) ||
                        (a == t[0]
                            ? ((n.base_station_code = a),
                              n._marke_station_for_vecotr_base([
                                  parseFloat(t[2]),
                                  parseFloat(t[3]),
                              ]),
                              !1)
                            : void 0)
                    );
                });
            }),
            (r.prototype.mark_taget_vector_base_station = function (a) {
                var n = this;
                this.stations.forEach(function (t, e) {
                    return (
                        !(t[0] && t[1] && t[2] && t[3]) ||
                        (a == t[0]
                            ? (n._marke_target_station(
                                  [parseFloat(t[2]), parseFloat(t[3])],
                                  a
                              ),
                              !1)
                            : void 0)
                    );
                });
            }),
            (r.prototype.set_base_station_code = function (t) {
                this.base_station_code = t;
            }),
            (r.prototype.get_base_station_code = function () {
                return this.base_station_code;
            }),
            (r.prototype.remove_target_vector_base_station = function () {
                this.target_base_station_marker &&
                    ((this.target_base_station_code = null),
                    this.map.removeLayer(this.target_base_station_marker));
            }),
            (r.prototype.mark_icon_with_red = function (a, n) {
                var o = this;
                this.stations.forEach(function (t, e) {
                    return (
                        !(t[0] && t[1] && t[2] && t[3]) ||
                        (a == t[0]
                            ? (n(
                                  o._marke_station_sypmle(
                                      t[0],
                                      t[1],
                                      [parseFloat(t[2]), parseFloat(t[3])],
                                      o.func_graph_baseline_click
                                  )
                              ),
                              !1)
                            : void 0)
                    );
                });
            }),
            (r.prototype.draw_line = function (a, n, t) {
                var o, i;
                this.stations.forEach(function (t, e) {
                    if (!(t[0] && t[1] && t[2] && t[3])) return !0;
                    a == t[0] && (o = [parseFloat(t[2]), parseFloat(t[3])]),
                        n == t[0] && (i = [parseFloat(t[2]), parseFloat(t[3])]);
                }),
                    t(this._draw_line(o, i));
            }),
            (r.prototype.remove_layer = function (t) {
                return this.map.removeLayer(t);
            }),
            (r.prototype._fetch_stations = function () {
                var e = this;
                Util.ajax_stations()
                    .done(function (t) {
                        (e.stations = new Map()),
                            t.forEach(function (t) {
                                e.stations.set(t.id, [
                                    t.id,
                                    t[r.is_en ? "name_en" : "name"],
                                    t.b,
                                    t.l,
                                    t.is_primary,
                                ]);
                            }),
                            (e.has_stations = !0);
                    })
                    .fail(function (t, e, a) {
                        console.log(t, e, a);
                    });
            }),
            (r.prototype._set_info_html = function (t) {
                this._init_info();
                var e = this.stations.get(this.base_station_code);
                this.info_small._div.innerHTML = r.is_en
                    ? "\n            <h2>Duration</h2>\n            <p>From縲" +
                      t[0] +
                      "</p>\n            <p>To縲" +
                      t[1] +
                      '</p>\n            <p>Fixed Station��<span id="_base-station-square">笆｡</span>�会ｼ�' +
                      e[1] +
                      '</p>\n            <p>1cm <span id="_vetor_line"></span></p>'
                    : "\n            <h2>谺｡縺ｮ�呈悄髢薙�蟷ｳ蝮�､繧呈ｯ碑ｼ�</h2>\n            <p>蟋九" +
                      t[0] +
                      "</p>\n            <p>邨ゅ" +
                      t[1] +
                      '</p>\n            <p>蝗ｺ螳夊ｦｳ貂ｬ螻��<span id="_base-station-square">笆｡</span>蜊ｰ�会ｼ�' +
                      e[1] +
                      '</p>\n            <p>1cm <span id="_vetor_line"></span></p>';
            }),
            (r.prototype._marke_station_for_vecotr = function (t, e, a, n) {
                var o = this,
                    i = "./leaflet/images/circle_red.png";
                "B" == n
                    ? (i = "./leaflet/images/circle_blue.png")
                    : "R" == n && (i = "./leaflet/images/circle_red.png");
                var r = {
                        icon: L.icon({
                            iconUrl: i,
                            iconSize: [5, 5],
                            iconAnchor: [2.5, 2.5],
                            popupAnchor: [0, 0],
                            shadowUrl: i,
                            shadowSize: [0, 0],
                            shadowAnchor: [0, 0],
                        }),
                        title: a,
                        alt: t[0],
                        zIndexOffset: 1e3,
                        riseOnHover: !0,
                    },
                    s = L.marker(e, r);
                s.addTo(this.map),
                    s.bindPopup(
                        this._popup_str_4vector_horizontal(
                            t[1],
                            t[2],
                            t[3],
                            a,
                            t[0]
                        )
                    ),
                    s.on("mouseover", function (t) {
                        this.openPopup();
                    }),
                    s.on("mouseout", function (t) {
                        this.closePopup();
                    }),
                    s.on("click", function (t) {
                        o.mode_change_base_station_flg &&
                            o._marke_target_station(e, t.target.options.alt);
                    });
            }),
            (r.prototype._marke_station_for_vecotr_base = function (t) {
                var e = {
                    icon: L.icon({
                        iconUrl: "./leaflet/images/square_blue.png",
                        iconSize: [16, 16],
                        iconAnchor: [8, 8],
                        popupAnchor: [0, 0],
                        shadowUrl: "./leaflet/images/square_blue.png",
                        shadowSize: [0, 0],
                        shadowAnchor: [0, 0],
                    }),
                };
                this.base_station_marker &&
                    this.map.removeLayer(this.base_station_marker),
                    (this.base_station_marker = L.marker(t, e)),
                    this.base_station_marker.addTo(this.map);
            }),
            (r.prototype._marke_station = function (t, e, a, n) {
                var o = L.marker(e, {
                    icon: L.icon({
                        iconUrl: "./leaflet/images/marker-icon.png",
                        iconSize: [10, 20],
                        iconAnchor: [6, 19],
                        popupAnchor: [-3, -20],
                        shadowUrl: "./leaflet/images/marker-shadow.png",
                        shadowSize: [18, 20],
                        shadowAnchor: [4, 19],
                    }),
                    title: a,
                    alt: t,
                    riseOnHover: !0,
                });
                o.addTo(this.map),
                    o.bindPopup(a + "(" + t + ")"),
                    o.on("mouseover", function (t) {
                        this.openPopup();
                    }),
                    o.on("mouseout", function (t) {
                        this.closePopup();
                    }),
                    o.on("click", function (t) {
                        n(t);
                    });
            }),
            (r.prototype._init_info = function () {
                var e = this;
                if (this.info_small) {
                    var t = document.getElementsByClassName("_info");
                    0 < t.length && t[0].parentNode.removeChild(t[0]);
                }
                (this.info_small = L.control()),
                    (this.info_small.onAdd = function (t) {
                        return (
                            (e.info_small._div = L.DomUtil.create(
                                "div",
                                "_info"
                            )),
                            e.info_small._div
                        );
                    }),
                    this.info_small.addTo(this.map);
            }),
            (r.prototype._marke_target_station = function (t, e) {
                this.remove_target_vector_base_station(),
                    (this.target_base_station_marker = L.marker(t, {
                        icon: L.icon({
                            iconUrl: "./leaflet/images/square_orange.png",
                            iconSize: [16, 16],
                            iconAnchor: [8, 8],
                            popupAnchor: [0, 0],
                            shadowUrl: "./leaflet/images/square_orange.png",
                            shadowSize: [0, 0],
                            shadowAnchor: [0, 0],
                        }),
                    })),
                    this.target_base_station_marker.addTo(this.map),
                    (this.target_base_station_code = e);
            }),
            (r.prototype._marke_station_sypmle = function (t, e, a, n) {
                var o = L.marker(a, {
                    icon: L.icon({
                        iconUrl: "./leaflet/images/marker_red.png",
                        iconSize: [10, 20],
                        iconAnchor: [6, 19],
                        popupAnchor: [-3, -20],
                        shadowUrl: "./leaflet/images/marker-shadow.png",
                        shadowSize: [18, 20],
                        shadowAnchor: [4, 19],
                    }),
                    title: e,
                    alt: t,
                    riseOnHover: !0,
                });
                return (
                    o.addTo(this.map),
                    o.bindPopup(e + "(" + t + ")"),
                    o.on("mouseover", function (t) {
                        this.openPopup();
                    }),
                    o.on("mouseout", function (t) {
                        this.closePopup();
                    }),
                    o.on("click", function (t) {
                        n(t);
                    }),
                    o
                );
            }),
            (r.prototype._draw_line = function (t, e) {
                var a = L.polyline([t, e], {
                    color: "#f00",
                    weight: 4,
                    opacity: 1,
                });
                return a.addTo(this.map), a;
            }),
            (r.prototype._draw_svg_vector = function (t, e) {
                var a = e.value[0],
                    n = e.value[1],
                    o = a < 0 ? -a : a,
                    i = n < 0 ? -n : n;
                (o += 30),
                    (i += 30),
                    L.marker(t, {
                        icon: L.icon({
                            iconUrl: Util.svg_draw_vector_arrow_url(
                                a,
                                o,
                                n,
                                i,
                                e.color
                            ),
                            iconSize: [o, i],
                            iconAnchor: [
                                a < 0 ? o - 15 : 15,
                                0 < n ? i - 15 : 15,
                            ],
                        }),
                        zIndexOffset: 0,
                        riseOffset: 0,
                    }).addTo(this.map);
            }),
            (r.prototype._popup_str_4vector_horizontal = function (
                t,
                e,
                a,
                n,
                o
            ) {
                var i = this.func_vector_calculation([t, e, a]);
                return "vertical" == i.type
                    ? n +
                          "(" +
                          o +
                          ")<br>\n            繝ｻ" +
                          (r.is_en ? "Ellipsoid height" : "讌募�菴馴ｫ�") +
                          "��" +
                          Util.floor(100 * a, 100) +
                          "cm"
                    : "horizontal" == i.type
                    ? n +
                      "(" +
                      o +
                      ")<br>\n            繝ｻ" +
                      (r.is_en ? "East West" : "譚ｱ隘ｿ") +
                      "��" +
                      Util.floor(100 * t, 100) +
                      "cm<br>\n            繝ｻ" +
                      (r.is_en ? "South North" : "蜊怜圏") +
                      ":" +
                      Util.floor(100 * e, 100) +
                      "cm"
                    : n + "(" + o + ")";
            }),
            (r.is_en = !1),
            (r.MAP_URL =
                "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"),
            (r.MAP_URL_EN =
                "https://cyberjapandata.gsi.go.jp/xyz/english/{z}/{x}/{y}.png"),
            r
        );
    })(),
    ChartsManager = (function () {
        function klass() {}
        return (
            (klass.create_charts_for_coordinate = function (data, elm, params) {
                var arrayForChartEW = [],
                    arrayForChartNS = [],
                    arrayForChartH = [],
                    rawValues = [];
                data.forEach(function (d) {
                    var time = new Date(d.date),
                        cmFactor = 100;
                    arrayForChartEW.push([
                        time,
                        parseFloat(d.dew) * cmFactor,
                        Util.floor(parseFloat(d.dew) * cmFactor, 100) + "cm",
                    ]);
                    arrayForChartNS.push([
                        time,
                        parseFloat(d.dns) * cmFactor,
                        Util.floor(parseFloat(d.dns) * cmFactor, 100) + "cm",
                    ]);
                    arrayForChartH.push([
                        time,
                        parseFloat(d.dh) * cmFactor,
                        Util.floor(parseFloat(d.dh) * cmFactor, 100) + "cm",
                    ]);
                    rawValues.push(parseFloat(d.dew) * cmFactor);
                    rawValues.push(parseFloat(d.dns) * cmFactor);
                    rawValues.push(parseFloat(d.dh) * cmFactor);
                });
                var absValues = rawValues.map((v) =>
                    v === -999900 ? 0 : Math.abs(v)
                );
                var autoRange = 1.1 * klass._get_max(absValues);
                var chartDefs = [
                    {
                        type: "date",
                        title: "term",
                    },
                    {
                        type: "number",
                        title: "cm",
                    },
                    {
                        type: "string",
                        role: "tooltip",
                    },
                ];
                var chartOptions = {
                    chartArea: {
                        backgroundColor: {
                            stroke: "#000",
                            strokeWidth: 0.5,
                        },
                    },
                    hAxis: {
                        format: "yyyy/M/d",
                        title: "",
                        viewWindow: {
                            min: params.from,
                            max: params.end,
                        },
                    },
                    vAxis: {
                        title: "\n\n\n\ncm",
                        gridlines: {
                            count: 10,
                        },
                        viewWindow: {
                            min:
                                -1 *
                                parseFloat(
                                    params.range ? params.range : autoRange
                                ),
                            max: parseFloat(
                                params.range ? params.range : autoRange
                            ),
                        },
                    },
                    series: [
                        {
                            color: "red",
                            pointSize: 1,
                        },
                    ],
                    legend: "none",
                };

                $(elm).html("");

                $("<div></div>", {
                    class: "charts",
                }).appendTo(elm);
                chartOptions.title =
                    (klass.is_en ? "East West" : "譚ｱ隘ｿ") + ":" + params.name;
                klass.factory(
                    $(".charts")[0],
                    chartDefs,
                    arrayForChartEW,
                    $.extend({}, chartOptions)
                );

                $("<div></div>", {
                    class: "charts",
                }).appendTo(elm);
                chartOptions.title =
                    (klass.is_en ? "South North" : "蜊怜圏") + ":" + params.name;
                klass.factory(
                    $(".charts")[1],
                    chartDefs,
                    arrayForChartNS,
                    $.extend({}, chartOptions)
                );

                $("<div></div>", {
                    class: "charts",
                }).appendTo(elm);
                chartOptions.title =
                    (klass.is_en ? "Ellipsoid height" : "讌募�菴馴ｫ�") +
                    ":" +
                    params.name;
                klass.factory(
                    $(".charts")[2],
                    chartDefs,
                    arrayForChartH,
                    $.extend({}, chartOptions)
                );
            }),
            (klass.create_charts_for_baseline = function (data, elm, params) {
                var arrayForChartBL = [],
                    arrayForChartEW = [],
                    arrayForChartNS = [],
                    arrayForChartH = [],
                    rawValues = [];
                data.forEach(function (d) {
                    var time = new Date(d[0]);
                    var cmFactor = 100;
                    arrayForChartBL.push([
                        time,
                        parseFloat(d[1]) * cmFactor,
                        Util.floor(parseFloat(d[1]) * cmFactor, 100) + "cm",
                    ]);
                    arrayForChartEW.push([
                        time,
                        parseFloat(d[2]) * cmFactor,
                        Util.floor(parseFloat(d[2]) * cmFactor, 100) + "cm",
                    ]);
                    arrayForChartNS.push([
                        time,
                        parseFloat(d[3]) * cmFactor,
                        Util.floor(parseFloat(d[3]) * cmFactor, 100) + "cm",
                    ]);
                    arrayForChartH.push([
                        time,
                        parseFloat(d[4]) * cmFactor,
                        Util.floor(parseFloat(d[4]) * cmFactor, 100) + "cm",
                    ]);
                    rawValues.push(parseFloat(d[1]) * cmFactor);
                    rawValues.push(parseFloat(d[2]) * cmFactor);
                    rawValues.push(parseFloat(d[3]) * cmFactor);
                    rawValues.push(parseFloat(d[4]) * cmFactor);
                });
                var absValues = rawValues.map((v) =>
                    v === -999900 ? 0 : Math.abs(v)
                );
                var autoRange = 1.1 * klass._get_max(absValues);
                var chartDefs = [
                    {
                        type: "date",
                        title: "term",
                    },
                    {
                        type: "number",
                        title: "cm",
                    },
                    {
                        type: "string",
                        role: "tooltip",
                    },
                ];
                var chartOptions = {
                    chartArea: {
                        backgroundColor: {
                            stroke: "#000",
                            strokeWidth: 0.75,
                        },
                    },
                    hAxis: {
                        format: "yyyy/M/d",
                        title: "",
                        viewWindow: {
                            min: params.from,
                            max: params.end,
                        },
                    },
                    vAxis: {
                        title: "\n\n\n\ncm",
                        gridlines: {
                            count: 10,
                        },
                        viewWindow: {
                            min:
                                -1 *
                                parseFloat(
                                    params.range ? params.range : autoRange
                                ),
                            max: parseFloat(
                                params.range ? params.range : autoRange
                            ),
                        },
                    },
                    series: [
                        {
                            color: "red",
                            pointSize: 1,
                        },
                    ],
                    legend: "none",
                };

                $(elm).html("");

                $("<div></div>", {
                    class: "charts",
                }).appendTo(elm);
                chartOptions.title =
                    (klass.is_en ? "Oblique distance" : "譁懆ｷ晞屬") +
                    ":" +
                    params.name;
                klass.factory(
                    $(".charts")[0],
                    chartDefs,
                    arrayForChartBL,
                    $.extend({}, chartOptions)
                );

                $("<div></div>", {
                    class: "charts",
                }).appendTo(elm);
                chartOptions.title =
                    (klass.is_en ? "East West" : "譚ｱ隘ｿ") + ":" + params.name;
                klass.factory(
                    $(".charts")[1],
                    chartDefs,
                    arrayForChartEW,
                    $.extend({}, chartOptions)
                );

                $("<div></div>", {
                    class: "charts",
                }).appendTo(elm);
                chartOptions.title =
                    (klass.is_en ? "South North" : "蜊怜圏") + ":" + params.name;
                klass.factory(
                    $(".charts")[2],
                    chartDefs,
                    arrayForChartNS,
                    $.extend({}, chartOptions)
                );

                $("<div></div>", {
                    class: "charts",
                }).appendTo(elm);
                chartOptions.title =
                    (klass.is_en ? "Relative height" : "豈秘ｫ�") +
                    ":" +
                    params.name;
                klass.factory(
                    $(".charts")[3],
                    chartDefs,
                    arrayForChartH,
                    $.extend({}, chartOptions)
                );
            }),
            (klass.factory = function (
                elm,
                chartDefs,
                arrayForChart,
                chartOptions
            ) {
                klass.init(),
                    google.charts.setOnLoadCallback(function () {
                        var a = new google.visualization.DataTable();
                        chartDefs.forEach(function (t, e) {
                            "role" in t && "tooltip" == t.role
                                ? a.addColumn(t)
                                : a.addColumn(t.type, t.title);
                        }),
                            a.addRows(arrayForChart),
                            new google.visualization.ScatterChart(elm).draw(
                                a,
                                chartOptions
                            );
                    });
            }),
            (klass.init = function () {
                klass.is_init ||
                    (google.charts.load("current", {
                        packages: ["corechart"],
                    }),
                    (klass.is_init = !0));
            }),
            (klass._get_max = function (t) {
                var e = 0;
                return (
                    t.forEach(function (t) {
                        e < t && (e = t);
                    }),
                    e
                );
            }),
            (klass.is_init = !1),
            (klass.is_en = !1),
            klass
        );
    })(),
    Util = (function () {
        function _() {}
        return (
            (_.format_date_str = function (t) {
                var e = t.getFullYear(),
                    a = t.getMonth() + 1,
                    n = t.getDate(),
                    o = a.toString(),
                    i = n.toString();
                return (
                    a < 10 && (o = "0" + a),
                    n < 10 && (i = "0" + n),
                    e + "/" + o + "/" + i
                );
            }),
            (_.get_date_by_term = function (t) {
                var e = new Date(),
                    a = new Date();
                return (
                    "10years" == t && a.setFullYear(e.getFullYear() - 10),
                    "5years" == t && a.setFullYear(e.getFullYear() - 5),
                    "year" == t && a.setFullYear(e.getFullYear() - 1),
                    "month" == t && a.setMonth(e.getMonth() - 1),
                    [a, e]
                );
            }),
            (_.ajax_stations = function (t) {
                return (
                    void 0 === t && (t = !1),
                    $.ajax({
                        type: "GET",
                        // url: "https://mekira.gsi.go.jp/api/getObservationStations",
                        url: _.AJAX_BASE_URL + "assets/api/getObservationStations.json",
                        dataType: "json",
                        cache: !0,
                        data: {
                            decimated: t ? 1 : 0,
                        },
                    })
                );
            }),
            (_.ajax_vectors = function (t, e, a) {
                return $.ajax({
                    type: "GET",
                    url:
                        _.AJAX_BASE_URL +
                        "assets/api/getCoordinateTransformationVectors.json",
                    dataType: "json",
                    cache: !0,
                    data: {
                        term: t,
                        decimated: a ? 1 : 0,
                        fixedStationId: e,
                    },
                });
            }),
            (_.ajax_coordinate = function (t, e) {
                return $.ajax({
                    type: "GET",
                    url:
                        _.AJAX_BASE_URL +
                        "assets/api/getVectorsCoordinateTransformations.json",
                    dataType: "json",
                    cache: !0,
                    data: {
                        stationIds: t,
                        term: e,
                    },
                });
            }),
            (_.ajax_baseline = function (t, e) {
                return $.ajax({
                    type: "GET",
                    url: _.AJAX_BASE_URL + "/assets/api/getBaselineChanges.json",
                    dataType: "json",
                    cache: !0,
                    data: {
                        stationIds: t,
                        term: e,
                    },
                });
            }),
            (_.ajax_comment = function (t, e) {
                return $.ajax({
                    type: "GET",
                    url: _.AJAX_BASE_URL + "/assets/api/getComments.json",
                    dataType: "json",
                    cache: !0,
                    data: {
                        area: t,
                        term: e,
                    },
                });
            }),
            (_.dl_vectors = function (t, e) {
                var a = new Map(),
                    n =
                        _.AJAX_BASE_URL +
                        "/projectf3/downloadCoordinateTransformationVectors.json";
                a.set("term", t),
                    a.set("fixedStationId", e),
                    _._download(n + "?" + _._format_get_query(a), "");
            }),
            (_.dl_kml = function (t, e, a, n, o) {
                var i = new Map(),
                    r =
                        _.AJAX_BASE_URL +
                        "/projectf3/downloadKmlCoordinateTransformationVectors.json";
                i.set("term", t),
                    i.set("fixedStationId", e),
                    i.set("location", a),
                    i.set("decimated", n),
                    i.set("directionType", o),
                    _._download(r + "?" + _._format_get_query(i), "");
            }),
            (_.dl_coordinate = function (t, e) {
                var a = new Map(),
                    n =
                        _.AJAX_BASE_URL +
                        "/projectf3/downloadVectorsCoordinateTransformations";
                a.set("term", t),
                    a.set("stationIds", e),
                    _._download(n + "?" + _._format_get_query(a), "");
            }),
            (_.dl_baseline = function (t, e) {
                var a = new Map(),
                    n = _.AJAX_BASE_URL + "/projectf3/downloadBaselineChanges";
                a.set("term", t),
                    a.set("stationIds", e),
                    _._download(n + "?" + _._format_get_query(a), "");
            }),
            (_.delate_loading = function () {
                $("#loading").hide();
            }),
            (_.show_loading = function () {
                $("#loading").show();
            }),
            (_.get_url_query = function () {
                var o = {};
                return (
                    location.search
                        .substring(1)
                        .split("&")
                        .forEach(function (t) {
                            var e = t.search(/=/);
                            if (-1 !== e) {
                                var a = t.slice(0, e),
                                    n = t.slice(e + 1);
                                "" !== a && (o[a] = decodeURIComponent(n));
                            }
                        }),
                    o
                );
            }),
            (_.svg_draw_vector_arrow_url = function (t, e, a, n, o) {
                var i = t < 0 ? (e + t) / 2 : (e - t) / 2,
                    r = (a = -a) < 0 ? (n + a) / 2 : (n - a) / 2,
                    s = _._svg_common_template(
                        '<defs>\n            <marker id="arrow" markerUnits="strokeWidth" preserveAspectRatio="none" markerWidth="5" markerHeight="5" viewBox="0 0 10 10" refX="5" refY="5" orient="auto">\n                <polygon points="0,0 5,5 0,10 10,5" fill="' +
                            o +
                            '"/>\n            </marker>\n        </defs>\n        <g stroke="' +
                            o +
                            '">\n            <line x1="' +
                            (t < 0 ? e - i : i) +
                            '" y1="' +
                            (a < 0 ? n - r : r) +
                            '" x2="' +
                            (t < 0 ? e - i + t : i + t) +
                            '" y2="' +
                            (a < 0 ? n - r + a : r + a) +
                            '" \n            stroke-width="2" marker-end="url(#arrow)"/>\n        </g>',
                        e,
                        n
                    );
                return "data:image/svg+xml;base64," + btoa(s);
            }),
            (_._svg_common_template = function (t, e, a) {
                return (
                    '\n        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n        <svg width="' +
                    e +
                    '" height="' +
                    a +
                    '"\n         xmlns="http://www.w3.org/2000/svg"\n         xmlns:xlink="http://www.w3.org/1999/xlink">\n         ' +
                    t +
                    "\n        </svg>"
                );
            }),
            (_._download = function (t, e) {
                var a = document.createElement("a");
                document.body.appendChild(a),
                    (a.href = t),
                    (a.download = e),
                    a.click(),
                    document.body.removeChild(a);
            }),
            (_._format_get_query = function (t) {
                var a = [];
                return (
                    t.forEach(function (t, e) {
                        a.push(
                            encodeURIComponent(e) + "=" + encodeURIComponent(t)
                        );
                    }),
                    a.join("&")
                );
            }),
            (_.floor = function (t, e) {
                return Math.floor(t * e) / e;
            }),
            (_.open_window = function (t, e, a) {
                void 0 === e && (e = 800),
                    void 0 === a && (a = 500),
                    window.open(
                        t,
                        "",
                        "width=" +
                            e +
                            ", height=" +
                            a +
                            ", menubar=no, toolbar=no, scrollbars=yes"
                    );
            }),
            (_.AJAX_BASE_URL = ""),
            (_.is_en = !1),
            _
        );
    })(),
    AppChart = (function () {
        function t(t, e, a) {
            void 0 === a && (a = !1),
                a && (ChartsManager.is_en = !0),
                (this.chart_dom = t),
                (this.codes = e.codes.split(",")),
                (this.type = e.type),
                (this.term = e.term),
                this._disp_title(a);
        }
        return (
            (t.prototype.init = function () {
                var e = this;
                (this.stations = new Map()),
                    Util.ajax_stations()
                        .done(function (t) {
                            t.forEach(function (t) {
                                e.stations.set(t.id, [
                                    t.id,
                                    t[ChartsManager.is_en ? "name_en" : "name"],
                                ]);
                            }),
                                "coordinate" == e.type && e._init_coordinate(),
                                "baseline" == e.type && e._init_baseline(),
                                $("[name=code]").change(),
                                Util.delate_loading();
                        })
                        .fail(function (t, e, a) {
                            console.log(t, e, a);
                        });
            }),
            (t.prototype._init_coordinate = function () {
                this._create_codes_form_4coordinate(),
                    this._attache_coordinate_contoller();
            }),
            (t.prototype._init_baseline = function () {
                this._create_codes_form_4baseline(),
                    this._attache_baseline_contoller();
            }),
            (t.prototype._attache_coordinate_contoller = function () {
                var t = this;
                $("[name=code],[name=range]").on("change", function () {
                    t._create_coordinate_charts();
                });
                $(".dl_btn").on("click", function () {
                    Util.dl_coordinate(t.term, $(this).data("code"));
                });
                $("#zip_download").on("click", function () {
                    Util.dl_coordinate(t.term, t.codes.join(","));
                });
                $("#change_term_btn").on("click", function () {
                    t._create_coordinate_charts(!1);
                });
                $("#reset_term_btn").on("click", function () {
                    t._create_coordinate_charts();
                });
            }),
            (t.prototype._attache_baseline_contoller = function () {
                var t = this;
                $("[name=code],[name=range]").on("change", function () {
                    t._create_baseline_charts();
                });
                $(".dl_btn").on("click", function () {
                    Util.dl_baseline(t.term, $(this).data("code"));
                });
                $("#zip_download").on("click", function () {
                    Util.dl_baseline(t.term, t.codes.join(","));
                });
                $("#change_term_btn").on("click", function () {
                    t._create_baseline_charts(!1);
                });
                $("#reset_term_btn").on("click", function () {
                    t._create_baseline_charts();
                });
            }),
            (t.prototype._get_param_4chart = function () {
                return {
                    code: $("[name=code]").val(),
                    from: new Date($("[name=from]").val().toString()),
                    end: new Date($("[name=end]").val().toString()),
                    range: $("[name=range]").val(),
                    name: $("select[name=code] option:selected").text(),
                    term: this.term,
                };
            }),
            (t.prototype._create_codes_form_4coordinate = function () {
                var a = this;
                var btns = $(".btns");
                $('select[name="code"]').attr("size", this.codes.length);
                if (this.codes.length < 2) {
                    $("button#zip_download").hide();
                }

                this.codes.forEach(function (t, i) {
                    var e = a.stations.get(t);
                    var selected = i === 0 ? 'selected="selected"' : "";
                    $('select[name="code"]').append(
                        "<option " +
                            selected +
                            ' value="' +
                            t +
                            '">' +
                            e[1] +
                            "(" +
                            t +
                            ")</option>"
                    );
                    $("<button></button>", {
                        type: "button",
                    })
                        .addClass("dl_btn")
                        .text(ChartsManager.is_en ? "Download" : "繝繧ｦ繝ｳ繝ｭ繝ｼ繝�")
                        .data("code", t)
                        .appendTo(btns);
                });
            }),
            (t.prototype._create_codes_form_4baseline = function () {
                var o = this;
                var btns = $(".btns");
                $('select[name="code"]').attr("size", this.codes.length);
                if (this.codes.length < 2) {
                    $("button#zip_download").hide();
                }

                this.codes.forEach(function (t, i) {
                    var e = t.split("-");
                    if (2 == e.length) {
                        var a = o.stations.get(e[0]),
                            n = o.stations.get(e[1]);
                        var selected = i === 0 ? 'selected="selected"' : "";
                        $('select[name="code"]').append(
                            "<option " +
                                selected +
                                ' value="' +
                                t +
                                '">' +
                                a[1] +
                                "(" +
                                e[0] +
                                ") --- " +
                                n[1] +
                                "(" +
                                e[1] +
                                ")</option>"
                        );
                        $("<button></button>", {
                            type: "button",
                        })
                            .addClass("dl_btn")
                            .text(
                                ChartsManager.is_en
                                    ? "Download"
                                    : "繝繧ｦ繝ｳ繝ｭ繝ｼ繝�"
                            )
                            .data("code", t)
                            .appendTo(btns);
                    }
                });
            }),
            (t.prototype._create_coordinate_charts = function (isCreate) {
                var that = this;
                void 0 === isCreate && (isCreate = !0);
                var chartParams = this._get_param_4chart();
                Util.show_loading(),
                    Util.ajax_coordinate(
                        chartParams.code,
                        chartParams.term
                    ).then(function (json) {
                        if (isCreate) {
                            var terms = that._build_term_str(
                                json[0].observations,
                                "date"
                            );
                            that._init_term(terms),
                                (chartParams.from = new Date(terms[0])),
                                (chartParams.end = new Date(terms[1]));
                        }
                        ChartsManager.create_charts_for_coordinate(
                            json[0].observations,
                            that.chart_dom,
                            chartParams
                        ),
                            Util.delate_loading();
                    });
            }),
            (t.prototype._create_baseline_charts = function (isCreate) {
                var that = this;
                void 0 === isCreate && (isCreate = !0);
                var chartParams = this._get_param_4chart();
                Util.show_loading(),
                    Util.ajax_baseline(chartParams.code, chartParams.term).then(
                        function (json) {
                            if (isCreate) {
                                var terms = that._build_term_str(
                                    json[0].slopes,
                                    0
                                );
                                that._init_term(terms),
                                    (chartParams.from = new Date(terms[0])),
                                    (chartParams.end = new Date(terms[1]));
                            }
                            ChartsManager.create_charts_for_baseline(
                                json[0].slopes,
                                that.chart_dom,
                                chartParams
                            ),
                                Util.delate_loading();
                        }
                    );
            }),
            (t.prototype._init_term = function (t) {
                $("#disp_term").html(t[0] + "~" + t[1]),
                    this._init_term_form(t[0], t[1]);
            }),
            (t.prototype._build_term_str = function (t, a) {
                var n, o;
                return (
                    t.forEach(function (t) {
                        var e = new Date(t[a]);
                        if (null == n) return (o = n = e), !0;
                        e < n && (n = e), o < e && (o = e);
                    }),
                    [Util.format_date_str(n), Util.format_date_str(o)]
                );
            }),
            (t.prototype._init_term_form = function (t, e) {
                $("[name=from]").attr("max", e.replace(/\//g, "-")),
                    $("[name=from]").attr("min", t.replace(/\//g, "-")),
                    $("[name=end]").attr("max", e.replace(/\//g, "-")),
                    $("[name=end]").attr("min", t.replace(/\//g, "-")),
                    $("[name=from]").val(t.replace(/\//g, "-")),
                    $("[name=end]").val(e.replace(/\//g, "-"));
            }),
            (t.prototype._disp_title = function (t) {
                var e = "";
                "coordinate" == this.type &&
                    (e = t ? "Coordinate Change Graph" : "蠎ｧ讓吝､牙喧"),
                    "baseline" == this.type &&
                        (e = t ? "Baseline Change Graph" : "蝓ｺ邱壼､牙喧"),
                    $("#chart_title").text(e);
            }),
            t
        );
    })(),
    AppMap = (function () {
        function _(t) {
            void 0 === t && (t = !1),
                (this.mode = ""),
                (this.charts_coordinate_marking_objs = []),
                (this.charts_baseline_marking_objs = []),
                (_.is_en = t) && (MapManager.is_en = !0),
                (this.MapManager = new MapManager());
        }
        return (
            (_.prototype.init = function () {
                var t = this;
                this._init_map();
                var e = setInterval(function () {
                    t.MapManager.has_stations &&
                        (t._attache_contoller(),
                        t._set_func_vector_calculation(),
                        t._set_func_graph_coordinate(),
                        t._set_func_graph_baseline(),
                        $("[name=info-type]").change(),
                        $("[name=disp-location]").change(),
                        clearInterval(e),
                        Util.delate_loading());
                }, 300);
            }),
            (_.prototype._attache_contoller = function () {
                this._attache_event_change_main_contoller(),
                    this._attache_event_change_location(),
                    this._attache_event_change_term(),
                    this._attache_event_change_direction_type(),
                    this._attache_event_change_vector_magnification(),
                    this._attache_event_dl_vector_and_kml(),
                    this._attache_clear_coordinate_station(),
                    this._attache_clear_baseline_station(),
                    this._attache_event_change_vector_base_station(),
                    this._attache_event_disp_graph_coordinate(),
                    this._attache_event_disp_graph_baseline();
            }),
            (_.prototype._init_map = function () {
                var e = this;
                this.MapManager.set_base_station_code(
                    _.DEFAILT_VECTOR_STATION_CODE
                ),
                    this.MapManager.set_zoom_action(function (t) {
                        e.MapManager.has_stations &&
                            e._change_marke(t.target._zoom);
                    }),
                    this.MapManager.change_location("Overview");
            }),
            (_.prototype._attache_event_change_main_contoller = function () {
                var e = this;
                $("[name=info-type]").on("change", function (t) {
                    e.mode != $("[name=info-type]:checked").val().toString() &&
                        ((e.mode = $("[name=info-type]:checked")
                            .val()
                            .toString()),
                        $(
                            ".form-group-vector, .form-group-graph-coordinate, .form-group-graph-baseline"
                        ).hide(),
                        $(".form-group-" + e.mode).show(),
                        e._change_marke(e.MapManager.get_current_zoom()));
                });
            }),
            (_.prototype._attache_event_change_location = function () {
                var t = this;
                $("[name=disp-location]").on("change", function () {
                    t.MapManager.change_location(
                        $("[name=disp-location]").val().toString()
                    ),
                        t._set_massage();
                });
            }),
            (_.prototype._attache_event_change_term = function () {
                var t = this;
                $("[name=term]").on("change", function () {
                    t._change_marke(t.MapManager.get_current_zoom()),
                        t._set_massage();
                });
            }),
            (_.prototype._attache_event_change_direction_type = function () {
                var t = this;
                $("[name=direction-type]").on("change", function () {
                    t._set_func_vector_calculation(
                        $("[name=direction-type]:checked").val().toString(),
                        parseFloat(
                            $("[name=vector-magnification]").val().toString()
                        )
                    ),
                        t._change_marke(t.MapManager.get_current_zoom());
                });
            }),
            (_.prototype._attache_event_change_vector_magnification =
                function () {
                    var t = this;
                    $("[name=vector-magnification]").on("change", function () {
                        t._set_func_vector_calculation(
                            $("[name=direction-type]:checked").val().toString(),
                            parseFloat(
                                $("[name=vector-magnification]")
                                    .val()
                                    .toString()
                            )
                        ),
                            t._change_marke(t.MapManager.get_current_zoom());
                    });
                }),
            (_.prototype._attache_event_dl_vector_and_kml = function () {
                var e = this;
                $("#dl_vector").on("click", function () {
                    Util.dl_vectors(
                        $("[name=term]:checked").val().toString(),
                        e.MapManager.get_base_station_code()
                    );
                }),
                    $("#dl_kml").on("click", function () {
                        var t = $("[name=disp-location]").val().toString();
                        Util.dl_kml(
                            $("[name=term]:checked").val().toString(),
                            e.MapManager.get_base_station_code(),
                            t,
                            "Overview" == t,
                            $("[name=direction-type]:checked").val().toString()
                        );
                    });
            }),
            (_.prototype._attache_event_disp_graph_coordinate = function () {
                var t = this;
                $("#open_window_graph-coordinate").on("click", function () {
                    0 !=
                        $("select[name*=coordinate-station-list] option")
                            .length && t._open_chart_window("coordinate");
                });
            }),
            (_.prototype._attache_event_disp_graph_baseline = function () {
                var t = this;
                $("#open_window_graph-baseline").on("click", function () {
                    0 !=
                        $("select[name*=baseline-station-list] option")
                            .length &&
                        -1 !=
                            $("select[name*=baseline-station-list] option")
                                .eq(0)
                                .val()
                                .toString()
                                .indexOf("-") &&
                        t._open_chart_window("baseline");
                });
            }),
            (_.prototype._attache_event_change_vector_base_station =
                function () {
                    var t = this;
                    $("[name=selected-station]").on("change", function () {
                        "change" == $("[name=selected-station]").val()
                            ? (t.MapManager.remove_target_vector_base_station(),
                              t.MapManager.set_mode_change_base_station_flg(!0))
                            : ("reset" == $("[name=selected-station]").val()
                                  ? t.MapManager.mark_taget_vector_base_station(
                                        _.DEFAILT_VECTOR_STATION_CODE
                                    )
                                  : t.MapManager.remove_target_vector_base_station(),
                              t.MapManager.set_mode_change_base_station_flg(
                                  !1
                              ));
                    }),
                        $("#change_vector-base-station").on(
                            "click",
                            function () {
                                t.MapManager.change_mark_vector_base_station(),
                                    t.MapManager.remove_target_vector_base_station(),
                                    t._change_marke(
                                        t.MapManager.get_current_zoom()
                                    );
                            }
                        );
                }),
            (_.prototype._attache_clear_coordinate_station = function () {
                var t = this;
                $("#remove_coordinate-station").on("click", function () {
                    return (
                        $(
                            "select[name*=coordinate-station-list] option:selected"
                        ).each(function (t, e) {
                            $(e).remove();
                        }),
                        t._draw_coordinate_marking(),
                        !1
                    );
                }),
                    $("#reset_coordinate-station-list").on(
                        "click",
                        function () {
                            return (
                                $(
                                    "select[name*=coordinate-station-list] option"
                                ).remove(),
                                t._draw_coordinate_marking(),
                                !1
                            );
                        }
                    );
            }),
            (_.prototype._attache_clear_baseline_station = function () {
                var t = this;
                $("#remove_baseline-station").on("click", function () {
                    return (
                        $(
                            "select[name*=baseline-station-list] option:selected"
                        ).each(function (t, e) {
                            $(e).remove();
                        }),
                        t._draw_baseline_marking(),
                        !1
                    );
                }),
                    $("#reset_baseline-station-list").on("click", function () {
                        return (
                            $(
                                "select[name*=baseline-station-list] option"
                            ).remove(),
                            t._draw_baseline_marking(),
                            !1
                        );
                    });
            }),
            (_.prototype._change_marke = function (t) {
                this.MapManager.reset_layer();
                var e = t <= 6;
                switch (this.mode) {
                    case "vector":
                        this.MapManager.mark_vector(
                            e,
                            $("[name=term]:checked").val().toString()
                        );
                        break;
                    case "graph-coordinate":
                        this.MapManager.mark_graph_coordinate(e),
                            this._draw_coordinate_marking();
                        break;
                    case "graph-baseline":
                        this.MapManager.mark_graph_baseline(e),
                            this._draw_baseline_marking();
                }
            }),
            (_.prototype._set_func_vector_calculation = function (a, n) {
                void 0 === a && (a = "horizontal"), void 0 === n && (n = 10);
                this.MapManager.set_func_vector_calculation(function (t) {
                    $("#_vetor_line").css("width", (20 * n) / 100 + "px");
                    var e = {
                        value: [],
                        color: "red",
                        type: a,
                    };
                    return (
                        "horizontal" == a
                            ? (e.value = [t[0] * n * 20, t[1] * n * 20])
                            : ((e.value = [0, t[2] * n * 20]),
                              t[2] < 0 && (e.color = "blue")),
                        e
                    );
                });
            }),
            (_.prototype._set_func_graph_coordinate = function () {
                var e = this;
                this.MapManager.set_func_graph_coordinate_click(function (t) {
                    $("select[name*=coordinate-station-list] option").length >=
                        _.MAX_CHART_TARGET_NUM ||
                        $(
                            "select[name*=coordinate-station-list] option[value=" +
                                t.target.options.alt +
                                "]"
                        )[0] ||
                        ($("select[name*=coordinate-station-list]").append(
                            '<option value="' +
                                t.target.options.alt +
                                '">' +
                                t.target.options.title +
                                "</option>"
                        ),
                        e._draw_coordinate_marking());
                });
            }),
            (_.prototype._set_func_graph_baseline = function () {
                var s = this;
                this.MapManager.set_func_graph_baseline_click(function (t) {
                    if (
                        !(
                            $("select[name*=baseline-station-list] option")
                                .length >= _.MAX_CHART_TARGET_NUM &&
                            0 <
                                $(
                                    "select[name*=baseline-station-list] option:last"
                                )
                                    .val()
                                    .toString()
                                    .indexOf("-")
                        )
                    ) {
                        var e = $(
                                "select[name*=baseline-station-list] option:last"
                            ).val(),
                            a = !1;
                        if (null == e || /\w+\-\w+/.test(e.toString()))
                            $("select[name*=baseline-station-list]").append(
                                '<option value="' +
                                    t.target.options.alt +
                                    '">' +
                                    t.target.options.title +
                                    "-</option>"
                            ),
                                (a = !0);
                        else {
                            var n = $(
                                    "select[name*=baseline-station-list] option:last"
                                ).text(),
                                o = !1,
                                i = !1;
                            n.split("-")[0] == t.target.options.title &&
                                (o = !0);
                            var r = e + "-" + t.target.options.alt;
                            $(
                                "select[name*=baseline-station-list] option"
                            ).each(function (t, e) {
                                $(e).val().toString() == r && (i = !0);
                            }),
                                o ||
                                    i ||
                                    ($(
                                        "select[name*=baseline-station-list] option:last"
                                    ).remove(),
                                    $(
                                        "select[name*=baseline-station-list]"
                                    ).append(
                                        '<option value="' +
                                            e +
                                            "-" +
                                            t.target.options.alt +
                                            '">' +
                                            n +
                                            t.target.options.title +
                                            "</option>"
                                    ),
                                    (a = !0));
                        }
                        a && s._draw_baseline_marking();
                    }
                });
            }),
            (_.prototype._draw_baseline_marking = function () {
                var n = this;
                this.charts_baseline_marking_objs.forEach(function (t) {
                    n.MapManager.remove_layer(t);
                }),
                    $("select[name*=baseline-station-list] option").each(
                        function (t, e) {
                            var a = $(e).val().toString().split("-");
                            a.forEach(function (t) {
                                n.MapManager.mark_icon_with_red(
                                    t,
                                    function (t) {
                                        n.charts_baseline_marking_objs.push(t);
                                    }
                                );
                            }),
                                1 < a.length &&
                                    n.MapManager.draw_line(
                                        a[0],
                                        a[1],
                                        function (t) {
                                            n.charts_baseline_marking_objs.push(
                                                t
                                            );
                                        }
                                    );
                        }
                    );
            }),
            (_.prototype._draw_coordinate_marking = function () {
                var n = this;
                this.charts_coordinate_marking_objs.forEach(function (t) {
                    n.MapManager.remove_layer(t);
                }),
                    $("select[name*=coordinate-station-list] option").each(
                        function (t, e) {
                            var a = $(e).val().toString();
                            n.MapManager.mark_icon_with_red(a, function (t) {
                                n.charts_coordinate_marking_objs.push(t);
                            });
                        }
                    );
            }),
            (_.prototype._set_massage = function () {
                var t = $("[name=disp-location] option:selected")
                        .val()
                        .toString(),
                    e = $("[name=term]:checked").val().toString();
                Util.ajax_comment(t, e).then(function (t) {
                    _.is_en
                        ? $("#message_box").html("" + t[1][3])
                        : $("#message_box").html("" + t[0][3]);
                });
            }),
            (_.prototype._open_chart_window = function (t) {
                var e = new Map(),
                    a = [];
                "coordinate" == t &&
                    $("select[name*=coordinate-station-list] option").each(
                        function (t, e) {
                            a.push($(e).val());
                        }
                    ),
                    "baseline" == t &&
                        $("select[name*=baseline-station-list] option").each(
                            function (t, e) {
                                a.push($(e).val());
                            }
                        ),
                    e.set("codes", a.join(",")),
                    e.set("type", t),
                    e.set("term", $("[name=term]:checked").val().toString()),
                    Util.open_window(
                        (_.is_en ? "charts.en.html" : "charts.html") +
                            "?" +
                            Util._format_get_query(e)
                    );
            }),
            (_.DEFAILT_VECTOR_STATION_CODE = "950462"),
            (_.is_en = !1),
            (_.MAX_CHART_TARGET_NUM = 5),
            _
        );
    })();