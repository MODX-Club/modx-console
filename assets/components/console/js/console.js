var ModConsole = function(config) {
    config = config || {};
    ModConsole.superclass.constructor.call(this,config);
};
Ext.extend(ModConsole,Ext.Component,{
    page:{},window:{},grid:{},tree:{},panel:{},combo:{},config:{},form: {}
});
Ext.reg('mod-console',ModConsole);

var ModConsole = new ModConsole();