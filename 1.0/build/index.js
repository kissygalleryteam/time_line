/*
combined files : 

gallery/timeline/1.0/index

*/
/**
 * @fileoverview 
 * @author paozhu<kejun.zkj@alibaba-inc.com
 * @module timeline
 **/
KISSY.add('gallery/timeline/1.0/index',function (S, Node, Base) {
  var D = S.DOM,
      $ = Node.all;

  //自带的一些模板
  var FB_HTML = ""
    +   "<div class='fb-block'>"
    +     "<div class='fb-title'><h1>{title}</h1><h2>{date}</h2></div>"
    +     "<div class='fb-content'><p>{content}</p></div>"
    +   "</div>"
    +   "<i class='fb-{pos}-pointer'></i>";

  var HTML_TEMPLATE = {
    'fb': FB_HTML
  };

  // 工厂风格的构造器
  var Timeline = function(){
    this._init.apply(this, arguments);
  };

  S.augment(Timeline,{

    _init: function(target, data, opt){

      if(S.isString(target)){
        target = S.one(target);
      }

      this.target = target;

      this.data = data;

      this._buildParam(data,opt);

      this._buildHtml();

      this._setStyle();

      this.render();

      return this;
    },

    _buildParam: function(d, o){
      
      var self = this;

      if(o === undefined || o === null){
        o = {};
      }

      function setParam(def, key){
        var v = o[key];
        self[key] = (v === undefined || v === null) ? def : v;
      }

      function setData(def, key){
        for(var i=0,len = self.data.length; i<len; i++) {
          var v = self.data[i][key];
          self.data[i][key] = (v === undefined || v === null) ? def : v;
        }
      }

      function mergeParam(def, key){
        var v = o[key];
        self[key] = S.merge(def, v);
      }

      function parseNum(key) {
        self[key] = parseInt(self[key]);
      }

      S.each({
        start_pos:       "left",
        //load_style:      ["timeline_fb"]
        container_width:    600, 
        line_width:         28,
        item_gap_space:     30,
        //line_top:           0,
        top_gap_space:      15,
        bottom_gap_space:   15
      }, setParam);

      S.each([
        'container_width',
        'line_width',
        'line_width',
        'item_gap_space',
        //'line_top',
        'top_gap_space'
      ], parseNum);

      S.each({
        html_template:   HTML_TEMPLATE,
      }, mergeParam);

      S.each({
        template:     "fb",
        pos:          "",
        date:         "我是日期",
        title:        "我是标题",
        content:      "我是内容"
      }, setData);

      return this;
    },

    _setStyle: function() {

      this.item_width = (this.container_width - this.line_width) / 2;
      D.css(this.target, "width", this.container_width);
      D.css(this.target, "position", "relative");

      var style = ""
        + ".tl-line {"
        + "  width: " + this.line_width + "px;"
        + "  position: absolute;"
        + "  z-index: 10;"
        + "  left: " + (this.container_width - this.line_width) / 2 + "px;"
        + "}"
        + ".tl-item {"
        + "  position: absolute;"
        + "  width: " + this.item_width + "px;"
        + "  z-index: 15;"
        + "}"
        + ".tl-left{"
        + "  left: 0px;"
        + "}"
        + ".tl-right{"
        + "  right: 0px;"
        + "}"
        + ".tl-center{"
        + "  left: " + (this.container_width - this.item_width) / 2 + "px;"
        + "}";

      $("<style>"+style+"</style>").appendTo("head");

      /*  由于这种加载方式会导致计算元素高度不是应用样式后的 所以目前采用用户手动预先载入
      //加载组件自带的一些主题默认样式
      for(var i=0; i<this.load_style.length; i++) {
         var link = "<link rel='stylesheet' href='./"+this.load_style[i]+".css' type='text/css'>";
         $(link).appendTo("head");
      }
      */

    },

    _buildHtml: function(){

      var html = ""
        //+ "<div class='tl-line' style='top: "+this.line_top+"px;'></div>"
        + "<div class='tl-line'></div>"
        + "<div class='tl-left' style='top: "+(this.top_gap_space - this.item_gap_space)+"px;'></div>"
        + "<div class='tl-right' style='top:"+(this.top_gap_space - this.item_gap_space)+"px;'></div>";

      D.append(D.create(html), this.target);

    },

    render: function(){

      //TODO 用户自定义显示方式 默认为左右交替
      this._alternateRender();

    },

    _nextPos: function(pos){

      if(pos == "left") {
        return "right"
      }else{
        return "left";
      }

    },

    _calLastTop: function(pos){

      var last, last_left, last_right, x, y;

      last = D.last(this.target);
      if(D.hasClass(last, "tl-right")) {
        y = parseInt(D.style(last, 'top')) + D.height(last);
        last_left = D.children(this.target,'.tl-left').pop();
        x = parseInt(D.style(last_left, 'top')) +  D.height(last_left);
      } else if(D.hasClass(last, "tl-left")) {
        x = parseInt(D.style(last, 'top')) + D.height(last);
        last_right = D.children(this.target,'.tl-right').pop();
        y = parseInt(D.style(last_right, 'top')) + D.height(last_right);
      } else {
        x = parseInt(D.style(last, 'top')) + D.height(last);
        y = x;
      }

      return {left: x, right: y};

    },

    //计算当前timeline 的高度
    _calHeight: function() {

      var last = D.last(this.target);
      return  parseInt(D.style(last, 'top')) + D.height(last);
    },

    _alternateRender: function(){

      var pos   = this.start_pos,
          x     = 0,
          y     = 0,
          c     = this.item_gap_space,
          html, _top, last_top, now_height;

      for(var i=0,len=this.data.length; i<len; i++) {
         //计算左右最后一个html底部距离容器顶部的top值
        last_top = this._calLastTop(pos);
        x = last_top.left;
        y = last_top.right;

        //html item的位置
        if(this.data[i].pos === "left" || this.data[i].pos === "right" || this.data[i].pos === "center") {
          pos = this.data[i].pos;
        } else {
          this.data[i].pos = pos;
        }

        //构造且插入容器当前html
        _top = (x+c) > (y+c) ? (x+c) : (y+c);
        html = this.html_template[this.data[i].template];
        html = S.substitute(html, this.data[i]);
        html = "<div class='tl-item tl-"+pos+"' style='top:"+_top+"px'>"+ html + "</div>";
        D.append(D.create(html), this.target);

       //计算下一个插入位置
        pos = this._nextPos(pos);
        //更新中间line的长度
        now_height = this._calHeight();
        D.css(D.get('.tl-line',this.target), "height", this._calHeight() + this.bottom_gap_space);
        D.css(this.target, "height", this._calHeight() + this.bottom_gap_space);

      }

    }

  });

  return Timeline;
}, {requires:['node', 'base']});



