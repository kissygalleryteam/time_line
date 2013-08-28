/**
 * @fileoverview 
 * @author paozhu<kejun.zkj@alibaba-inc.com‍>
 * @module timeline
 **/
KISSY.add(function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class Timeline
     * @constructor
     * @extends Base
     */
    function Timeline(comConfig) {
        var self = this;
        //调用父类构造函数
        Timeline.superclass.constructor.call(self, comConfig);
    }
    S.extend(Timeline, Base, /** @lends Timeline.prototype*/{

    }, {ATTRS : /** @lends Timeline*/{

    }});
    return Timeline;
}, {requires:['node', 'base']});



