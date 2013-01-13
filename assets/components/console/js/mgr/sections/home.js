Ext.onReady(function() {
    MODx.load({ xtype: 'mod-console-page-home'});
});

ModConsole.page.Home = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'mod-console-panel-console'
            ,renderTo: 'mod-extra-console'
        }]
    });
    ModConsole.page.Home.superclass.constructor.call(this,config);
};
Ext.extend(ModConsole.page.Home,MODx.Component);
Ext.reg('mod-console-page-home',ModConsole.page.Home);