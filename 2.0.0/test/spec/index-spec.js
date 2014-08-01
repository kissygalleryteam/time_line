KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('time_line', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','kg/time_line/2.0.0/']});