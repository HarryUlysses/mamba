
// 全局变量
var add_flag = true;
var add_report_count = 0;





$('.export_btn').click(function(){
  convertCanvasToImage()
})

function convertCanvasToImage() {
  html2canvas(document.querySelector("#main")).then(function(canvas) {
    var imgUrl = canvas.toDataURL("image/png",1.0); // 将canvas转换成img的src流
    var saveLink = document.createElement('a');
        　　 　　   saveLink.href =imgUrl;
        　　　　    saveLink.download = 'logo.png';
                    saveLink.click();
    createPDFObject(imgUrl);
  });
}
function createPDFObject(imgData) {
  // var doc = new jsPDF('', 'pt', 'a4');
  var doc = new jsPDF('p', 'pt');
  doc.addImage(imgData, 5, 5, 600, 300, 'img');
  doc.save('test.pdf')
}


// 隐藏百度logo图标
$(function(){
  window.onload = function(){
    $(".anchorBL").hide(300);
    $(".BMap_noprint").hide(300);
  }
})


$(".confirm_btn").click(function(){
  $('.input_wrap').hide(300);
  $("#main").show(500)
    var item_dom = '<li class="item active"><span class="blue_line"></span><p class="data_name">'+$(".input").val()+'</p><span>></span></li>'
    $('.ul_list').prepend(item_dom);
    $('.top_btn_wrap').show(500);
    var main_title = '<p class="title">'+$(".input").val()+'</p><p class="title_en">Data Report in May</p>'
    $('.main_title').prepend(main_title);
})

$(".confirm_btn_bad").click(function(){
  $(this.parentNode.parentNode).hide(300);
  $(".input_wrap_add").show(500);
})

//页面拆分公用加载图片集合

// 初始进入是点击add_btn按钮事件
$('.add_btn').click(function(){
  if(add_flag){
    $('.no_box').hide(300);
    $('.input_wrap').show(500);
  }
})

$(".del_btn").click(function(){
  $(this.parentNode.parentNode).hide()
})

// 点击添加AI图表按钮事件处理
$('.add_AI_btn').click(function(){
  $('.input_wrap_add').show(500);
})
$('.confirm_add_btn').click(function(){
  $('.input_wrap_add').hide(300);
  $('.loadBox').show(500);
  $.ajax({
    type: "post",
    dataType:"json",
    url: "/ana/ajax",
    data: {
        question: $('.input_add').val()
    },
    success: function (json) {
      $("#main").show(500)
      if (!!json.table_result) {

        if(json.graph_type == 'hotdynamic_chart'){
          $('.container_wrap_1').show();
          var str_dom = '<p class="item_title">'+$('.input_add').val()+'<p><pclass="item_title_en">Regional Distribution of Invesstment User</p>'
          $(".item_title_1").prepend(str_dom);
          var dom_1 = document.getElementById("container_1");
          var myChart_1 = echarts.init(dom_1);
          var app_1 = {};
          option_1 = null;
          var data = json.table_result;
          var geoCoordMap = {
            '海门': [121.15, 31.89],
            '鄂尔多斯': [109.781327, 39.608266],
            '招远': [120.38, 37.35],
            '舟山': [122.207216, 29.985295],
            '齐齐哈尔': [123.97, 47.33],
            '盐城': [120.13, 33.38],
            '赤峰': [118.87, 42.28],
            '青岛': [120.33, 36.07],
            '乳山': [121.52, 36.89],
            '金昌': [102.188043, 38.520089],
            '泉州': [118.58, 24.93],
            '莱西': [120.53, 36.86],
            '日照': [119.46, 35.42],
            '胶南': [119.97, 35.88],
            '南通': [121.05, 32.08],
            '拉萨': [91.11, 29.97],
            '云浮': [112.02, 22.93],
            '梅州': [116.1, 24.55],
            '文登': [122.05, 37.2],
            '上海': [121.48, 31.22],
            '攀枝花': [101.718637, 26.582347],
            '威海': [122.1, 37.5],
            '承德': [117.93, 40.97],
            '厦门': [118.1, 24.46],
            '汕尾': [115.375279, 22.786211],
            '潮州': [116.63, 23.68],
            '丹东': [124.37, 40.13],
            '太仓': [121.1, 31.45],
            '曲靖': [103.79, 25.51],
            '烟台': [121.39, 37.52],
            '福州': [119.3, 26.08],
            '瓦房店': [121.979603, 39.627114],
            '即墨': [120.45, 36.38],
            '抚顺': [123.97, 41.97],
            '玉溪': [102.52, 24.35],
            '张家口': [114.87, 40.82],
            '阳泉': [113.57, 37.85],
            '莱州': [119.942327, 37.177017],
            '湖州': [120.1, 30.86],
            '汕头': [116.69, 23.39],
            '昆山': [120.95, 31.39],
            '宁波': [121.56, 29.86],
            '湛江': [110.359377, 21.270708],
            '揭阳': [116.35, 23.55],
            '荣成': [122.41, 37.16],
            '连云港': [119.16, 34.59],
            '葫芦岛': [120.836932, 40.711052],
            '常熟': [120.74, 31.64],
            '东莞': [113.75, 23.04],
            '河源': [114.68, 23.73],
            '淮安': [119.15, 33.5],
            '泰州': [119.9, 32.49],
            '南宁': [108.33, 22.84],
            '营口': [122.18, 40.65],
            '惠州': [114.4, 23.09],
            '江阴': [120.26, 31.91],
            '蓬莱': [120.75, 37.8],
            '韶关': [113.62, 24.84],
            '嘉峪关': [98.289152, 39.77313],
            '广州': [113.23, 23.16],
            '延安': [109.47, 36.6],
            '太原': [112.53, 37.87],
            '清远': [113.01, 23.7],
            '中山': [113.38, 22.52],
            '昆明': [102.73, 25.04],
            '寿光': [118.73, 36.86],
            '盘锦': [122.070714, 41.119997],
            '长治': [113.08, 36.18],
            '深圳': [114.07, 22.62],
            '珠海': [113.52, 22.3],
            '宿迁': [118.3, 33.96],
            '咸阳': [108.72, 34.36],
            '铜川': [109.11, 35.09],
            '平度': [119.97, 36.77],
            '佛山': [113.11, 23.05],
            '海口': [110.35, 20.02],
            '江门': [113.06, 22.61],
            '章丘': [117.53, 36.72],
            '肇庆': [112.44, 23.05],
            '大连': [121.62, 38.92],
            '临汾': [111.5, 36.08],
            '吴江': [120.63, 31.16],
            '石嘴山': [106.39, 39.04],
            '沈阳': [123.38, 41.8],
            '苏州': [120.62, 31.32],
            '茂名': [110.88, 21.68],
            '嘉兴': [120.76, 30.77],
            '长春': [125.35, 43.88],
            '胶州': [120.03336, 36.264622],
            '银川': [106.27, 38.47],
            '张家港': [120.555821, 31.875428],
            '三门峡': [111.19, 34.76],
            '锦州': [121.15, 41.13],
            '南昌': [115.89, 28.68],
            '柳州': [109.4, 24.33],
            '三亚': [109.511909, 18.252847],
            '自贡': [104.778442, 29.33903],
            '吉林': [126.57, 43.87],
            '阳江': [111.95, 21.85],
            '泸州': [105.39, 28.91],
            '西宁': [101.74, 36.56],
            '宜宾': [104.56, 29.77],
            '呼和浩特': [111.65, 40.82],
            '成都': [104.06, 30.67],
            '大同': [113.3, 40.12],
            '镇江': [119.44, 32.2],
            '桂林': [110.28, 25.29],
            '张家界': [110.479191, 29.117096],
            '宜兴': [119.82, 31.36],
            '北海': [109.12, 21.49],
            '西安': [108.95, 34.27],
            '金坛': [119.56, 31.74],
            '东营': [118.49, 37.46],
            '牡丹江': [129.58, 44.6],
            '遵义': [106.9, 27.7],
            '绍兴': [120.58, 30.01],
            '扬州': [119.42, 32.39],
            '常州': [119.95, 31.79],
            '潍坊': [119.1, 36.62],
            '重庆': [106.54, 29.59],
            '台州': [121.420757, 28.656386],
            '南京': [118.78, 32.04],
            '滨州': [118.03, 37.36],
            '贵阳': [106.71, 26.57],
            '无锡': [120.29, 31.59],
            '本溪': [123.73, 41.3],
            '克拉玛依': [84.77, 45.59],
            '渭南': [109.5, 34.52],
            '马鞍山': [118.48, 31.56],
            '宝鸡': [107.15, 34.38],
            '焦作': [113.21, 35.24],
            '句容': [119.16, 31.95],
            '北京': [116.46, 39.92],
            '徐州': [117.2, 34.26],
            '衡水': [115.72, 37.72],
            '包头': [110, 40.58],
            '绵阳': [104.73, 31.48],
            '乌鲁木齐': [87.68, 43.77],
            '枣庄': [117.57, 34.86],
            '杭州': [120.19, 30.26],
            '淄博': [118.05, 36.78],
            '鞍山': [122.85, 41.12],
            '溧阳': [119.48, 31.43],
            '库尔勒': [86.06, 41.68],
            '安阳': [114.35, 36.1],
            '开封': [114.35, 34.79],
            '济南': [117, 36.65],
            '德阳': [104.37, 31.13],
            '温州': [120.65, 28.01],
            '九江': [115.97, 29.71],
            '邯郸': [114.47, 36.6],
            '临安': [119.72, 30.23],
            '兰州': [103.73, 36.03],
            '沧州': [116.83, 38.33],
            '临沂': [118.35, 35.05],
            '南充': [106.110698, 30.837793],
            '天津': [117.2, 39.13],
            '富阳': [119.95, 30.07],
            '泰安': [117.13, 36.18],
            '诸暨': [120.23, 29.71],
            '郑州': [113.65, 34.76],
            '哈尔滨': [126.63, 45.75],
            '聊城': [115.97, 36.45],
            '芜湖': [118.38, 31.33],
            '唐山': [118.02, 39.63],
            '平顶山': [113.29, 33.75],
            '邢台': [114.48, 37.05],
            '德州': [116.29, 37.45],
            '济宁': [116.59, 35.38],
            '荆州': [112.239741, 30.335165],
            '宜昌': [111.3, 30.7],
            '义乌': [120.06, 29.32],
            '丽水': [119.92, 28.45],
            '洛阳': [112.44, 34.7],
            '秦皇岛': [119.57, 39.95],
            '株洲': [113.16, 27.83],
            '石家庄': [114.48, 38.03],
            '莱芜': [117.67, 36.19],
            '常德': [111.69, 29.05],
            '保定': [115.48, 38.85],
            '湘潭': [112.91, 27.87],
            '金华': [119.64, 29.12],
            '岳阳': [113.09, 29.37],
            '长沙': [113, 28.21],
            '衢州': [118.88, 28.97],
            '廊坊': [116.7, 39.53],
            '菏泽': [115.480656, 35.23375],
            '合肥': [117.27, 31.86],
            '武汉': [114.31, 30.52],
            '大庆': [125.03, 46.58]
          };

          var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
              var geoCoord = geoCoordMap[data[i].name];
              if (geoCoord) {
                res.push({
                  name: data[i].name,
                  value: geoCoord.concat(data[i].value)
                });
              }
            }
            return res;
          };

          option_1 = {

            title: {
              text: '',
              color: '#000',
              subtext: '',
              sublink: 'https://m.ncfwx.com',
              left: 'left'
            },
            tooltip: {
              trigger: 'item'
            },
            bmap: {
              center: [114.114129, 37.550339],
              zoom: 4,
              roam: true,
              mapStyle: {
                styleJson: [{
                  'featureType': 'water',
                  'elementType': 'all',
                  'stylers': {
                    'color': '#1f273b',
                    // 'color': '#fff',
                  }
                }, {
                  'featureType': 'land',
                  'elementType': 'all',
                  'stylers': {
                    'color': '#1f273b'
                    // 'color': 'red'
                  }
                }, {
                  'featureType': 'railway',
                  'elementType': 'all',
                  'stylers': {
                    'visibility': 'off'
                  }
                }, {
                  'featureType': 'highway',
                  'elementType': 'all',
                  'stylers': {
                    'color': '#00f',
                  }
                }, {
                  'featureType': 'highway',
                  'elementType': 'labels',
                  'stylers': {
                    'visibility': 'off'
                  }
                }, {
                  'featureType': 'arterial',
                  'elementType': 'geometry',
                  'stylers': {
                    'color': '#00f'
                  }
                }, {
                  'featureType': 'arterial',
                  'elementType': 'geometry.fill',
                  'stylers': {
                    'color': '#00f'
                  }
                }, {
                  'featureType': 'poi',
                  'elementType': 'all',
                  'stylers': {
                    'visibility': 'off'
                  }
                }, {
                  'featureType': 'green',
                  'elementType': 'all',
                  'stylers': {
                    'visibility': 'off'
                  }
                }, {
                  'featureType': 'subway',
                  'elementType': 'all',
                  'stylers': {
                    'visibility': 'off'
                  }
                }, {
                  'featureType': 'manmade',
                  'elementType': 'all',
                  'stylers': {
                    'color': '#00f'
                  }
                }, {
                  'featureType': 'local',
                  'elementType': 'all',
                  'stylers': {
                    'color': '#00f'
                  }
                }, {
                  'featureType': 'arterial',
                  'elementType': 'labels',
                  'stylers': {
                    'visibility': 'off'
                  }
                }, {
                  'featureType': 'boundary',
                  'elementType': 'all',
                  'stylers': {
                    'color': '#383f5a'
                  }
                }, {
                  'featureType': 'building',
                  'elementType': 'all',
                  'stylers': {
                    'color': '#383f5a'
                  }
                }, {
                  'featureType': 'label',
                  'elementType': 'labels.text.fill',
                  'stylers': {
                    'color': '#383f5a',//国家文字颜色
                    'visibility': 'off'
                  }
                }]
              }
            },
            series: [{
                name: 'pm2.5',
                type: 'scatter',
                coordinateSystem: 'bmap',
                data: convertData(data),
                symbolSize: function (val) {
                  return val[2] / 10;
                },
                label: {
                  normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                  },
                  emphasis: {
                    show: true
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#0cb5f0'
                  }
                }
              },
              {
                name: 'Top 5',
                type: 'effectScatter',
                coordinateSystem: 'bmap',
                data: convertData(data.sort(function (a, b) {
                  return b.value - a.value;
                }).slice(0, 6)),
                symbolSize: function (val) {
                  return val[2] / 10;
                },
                showEffectOn: 'render',
                rippleEffect: {
                  brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {
                  normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#0cb5f0',
                    shadowBlur: 10,
                    shadowColor: '#333'
                  }
                },
                zlevel: 1
              },
            ]
          };;
          if (option_1 && typeof option_1 === "object") {
            myChart_1.setOption(option_1, true);
          }
          setTimeout(function(){$(".anchorBL").hide();$(".BMap_noprint").hide();},500)
          
        }else if(json.graph_type == "line_chart"){
          var str_dom = '<p class="item_title">'+$('.input_add').val()+'<p><pclass="item_title_en">New User Broken Line Chart</p>'
          $(".item_title_2").prepend(str_dom);
          $('.container_wrap_2').show();
          var dom_2 = document.getElementById("container_2");
          var myChart_2 = echarts.init(dom_2);
          var app_2 = {};
          app_2.title = '环形图';

          option_2 = {
            backgroundColor:"#1f273b",
            xAxis: {
                type: 'category',
                data: json.table_result[0],
                axisLine:{
                  lineStyle:{
                    color:'#343d55',
                    width:1,//这里是为了突出显示加上的，可以去掉
                  }
                },
            },
            yAxis: {
                type: 'value',
                axisLine:{
                  lineStyle:{
                    color:'#343d55',
                    width:1,//这里是为了突出显示加上的，可以去掉
                  }
                },
                splitLine: {           // 分隔线  
                  length:20,         // 属性length控制线长  
                  lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式 
                    color: '#343d55',
                    type: 'dashed'
                  }
                },
            },
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [{
                  offset: 0, color: '#ef5aac' // 0% 处的颜色
              }, {
                  offset: 1, color: '#9b59f1' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            series: [{
                data: json.table_result[1],
                type: 'line',
                smooth: true,
            }]
          };
          if (option_2 && typeof option_2 === "object") {
              myChart_2.setOption(option_2, true);
          }
        }else if(json.graph_type == "pie_chart"){
          var str_dom = '<p class="item_title">'+$('.input_add').val()+'<p><pclass="item_title_en">Ring Chart of Filling Type</p>'
          $(".item_title_3").prepend(str_dom);
          $('.container_wrap_3').show();
          var dom_3 = document.getElementById("container_3");
          var myChart_3 = echarts.init(dom_3);
          var app_3 = {};
          option_3 = null;
          option_3 = {
            backgroundColor:"#1f273b",
              tooltip: {
                  trigger: 'item',
                  formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              series: [
                  {
                      name:'访问来源',
                      type:'pie',
                      radius: ['30%', '40%'],
                      avoidLabelOverlap: false,
                      label: {
                          normal: {
                              show: false,
                              position: 'bottom'
                          },
                          emphasis: {
                              show: true,
                              textStyle: {
                                  fontSize: '20',
                                  color: '#fff',
                                  fontWeight: 'bold'
                              }
                          }
                      },
                      "color": [{
                          type: 'linear',
                          x: 0,
                          y: 0,
                          x2: 0.4,
                          y2: 1,
                          colorStops: [{
                              offset: 0,
                              color: '#ad59e2' // 0% 处的颜色
                          }, {
                              offset: 1,
                              color: '#e45ab5' // 100% 处的颜色
                          }],
                          globalCoord: false // 缺省为 false
                      }, {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0.4,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: '#4fa7ea' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#3778ec' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    }],
                      labelLine: {
                          normal: {
                              show: false
                          }
                      },
                      data:[
                          {value:json.table_result[1][1], name:json.table_result[0][1]},
                          {value:json.table_result[1][0], name:json.table_result[0][0]}
                      ]
                  }
              ]
          };
          if (option_3 && typeof option_3 === "object") {
              myChart_3.setOption(option_3, true);
          }
        }else if(json.graph_type == "bar_chart"){
          var str_dom = '<p class="item_title">'+$('.input_add').val()+'<p><pclass="item_title_en">Recharge amount in recent March</p>'
          $(".item_title_4").prepend(str_dom);
          $('.container_wrap_4').show();
          var dom_4 = document.getElementById("container_4");
          var myChart_4 = echarts.init(dom_4);
          var app_4 = {};
          option_4 = null;
          var posList = [
              'left', 'right', 'top', 'bottom',
              'inside',
              'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
              'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
          ];

          app_4.configParameters = {
              rotate: {
                  min: -90,
                  max: 90
              },
              align: {
                  options: {
                      left: 'left',
                      center: 'center',
                      right: 'right'
                  }
              },
              verticalAlign: {
                  options: {
                      top: 'top',
                      middle: 'middle',
                      bottom: 'bottom'
                  }
              },
              position: {
                  options: echarts.util.reduce(posList, function (map, pos) {
                      map[pos] = pos;
                      return map;
                  }, {})
              },
              distance: {
                  min: 0,
                  max: 100
              }
          };

          app_4.config = {
              rotate: 90,
              align: 'left',
              verticalAlign: 'middle',
              position: 'insideBottom',
              distance: 15,
              onChange: function () {
                  var labelOption = {
                      normal: {
                          rotate: app_4.config.rotate,
                          align: app_4.config.align,
                          verticalAlign: app_4.config.verticalAlign,
                          position: app_4.config.position,
                          distance: app_4.config.distance
                      }
                  };
                  myChart_4.setOption({
                      series: [{
                          label: labelOption
                      }, {
                          label: labelOption
                      }, {
                          label: labelOption
                      }, {
                          label: labelOption
                      }]
                  });
              }
          };


          var labelOption = {
              normal: {
                  show: false,
                  position: app_4.config.position,
                  distance: app_4.config.distance,
                  align: app_4.config.align,
                  verticalAlign: app_4.config.verticalAlign,
                  rotate: app_4.config.rotate,
                  formatter: '{c}  {name|{a}}',
                  fontSize: 16,
                  rich: {
                      name: {
                          textBorderColor: '#fff'
                      }
                  }
              }
          };

          option_4 = {
            backgroundColor:"#1f273b",
              color: ['#003366', '#006699', '#4cabce', '#e5323e'],
              tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                      type: 'shadow'
                  }
              },
              // legend: {
              //     data: ['充值金额']
              // },
              grid: {
                left: '20%',
                right: '14%',
                bottom: '10%',
                containLabel: false
              },
              toolbox: {
                  show: false,
                  orient: 'vertical',
                  left: 'right',
                  top: 'center',
                  feature: {
                      mark: {show: false},
                      dataView: {show: false, readOnly: false},
                      magicType: {show: false, type: ['line', 'bar', 'stack', 'tiled']},
                      restore: {show: false},
                      saveAsImage: {show: false}
                  }
              },
              calculable: true,

              xAxis: {
                type: 'category',
                axisTick: {show: false},
                data: json.table_result[0],
                axisLine:{
                  lineStyle:{
                    color:'#343d55',
                    width:1,//这里是为了突出显示加上的，可以去掉
                  }
                },
            },
            yAxis: {
                type: 'value',
                axisLine:{
                  lineStyle:{
                    color:'#343d55',
                    width:1,//这里是为了突出显示加上的，可以去掉
                  }
                },
                splitLine: {           // 分隔线  
                  length:20,         // 属性length控制线长  
                  lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式 
                    color: '#343d55',
                    type: 'dashed'
                  }
                },
            },


              series: [
                  {
                      name: '充值金额',
                      type: 'bar',
                      barGap: 0,
                      label: labelOption,
                      data: json.table_result[1],
                      itemStyle:{
                        normal: {
                          color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                              {offset: 0, color: '#9b5af1'},
                              {offset: 1, color: '#4fa8e9'}
                            ]
                          ),
                          barBorderRadius:[20,20,0,0]
                        }
                      },
                      barWidth: 18,
                      barGap: '20%'
                  }
              ]
          };;
          if (option_4 && typeof option_4 === "object") {
              myChart_4.setOption(option_4, true);
          }
        }else{
          $('.input_wrap_bad').show(500);
        }
        
        $('.loadBox').hide(300);
      }
    },
    error: function(){
      $('.loadBox').hide(300);
      $('.input_wrap_bad').show(500);
    }
  });
  
})
