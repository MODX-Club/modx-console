ModConsole.panel.Console = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>'+_('console')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true }
            ,border: true
            ,width:'100%'
            ,height: '100%'
            ,stateful: true
            ,stateId: 'mod-console-home-tabpanel'
            ,stateEvents: ['tabchange']
            ,items: [{
                title: _('console.tab')
                ,defaults: { autoHeight: true }
                ,items: [{
                    xtype: 'mod-console-panel-codeeditor'
                }]
            }]
        }]
    });
    ModConsole.panel.Console.superclass.constructor.call(this,config);
};
Ext.extend(ModConsole.panel.Console,MODx.Panel);
Ext.reg('mod-console-panel-console',ModConsole.panel.Console);

ModConsole.panel.CodeEditor = function(config) {
    config = config || {};
    Ext.apply(config,{
        id: 'modxconsole-codeeditor'
        ,border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<p>'+_('console.desc')+'</p>'
            ,border: false
            ,bodyCssClass: 'panel-desc'
        },{
            id: 'mod-console-codeeditor'
            ,xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea'
            ,mimeType: 'application/x-php'
            ,height: 300
            ,width: '99%'
            ,enableKeyEvents: true
            ,listeners: {
                keydown: function(editor, e){
                    if (e && e.ctrlKey && e.keyCode == e.ENTER) {
                        this.request();
                    }
                }
                ,scope: this
            }
            ,value: '<?php\n'
        },{
            xtype: 'button'
            ,text: _('console.exec')
            ,listeners: {
                click: function(){
                    this.request();
                }
                ,scope: this
            }
        },{
            id: 'mod-console-coderesult'
            ,xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea'
            ,width: '99%'
            ,height: '100%'
            ,style: {
                'min-height': '400px'
            }
            ,listeners:{
                afterrender: function (comp) {
                    if(Ext.ComponentMgr.types['modx-texteditor'] === 'textarea') return;
                    var el = comp.getEl();
                    el.on('contextmenu', function(e,t,o) {
                        e.preventDefault();
                        // if empty area 
                        if(el.dom.textContent[0] == 1 && el.dom.textContent[el.dom.textContent.length - 1] == 'X') return;
                        
                        var menu = new ModConsole.menu.CodeEditorContextMenu({callerElement:el});
                        menu.showAt(e.getXY());
                    });
                }
            }
        }]
    });
    ModConsole.panel.CodeEditor.superclass.constructor.call(this,config);
};
Ext.extend(ModConsole.panel.CodeEditor,MODx.Panel, {
    request:function(){

        var area = Ext.getCmp('mod-console-codeeditor');
        var result = Ext.get('mod-console-coderesult');
        var code = area.getValue();

        result.getUpdater().update({
            url: ModConsole.config.connector_url + 'console.php',
            params:{
                action: 'exec',
                code: code
            }
        })
    }
});
Ext.reg('mod-console-panel-codeeditor',ModConsole.panel.CodeEditor);


ModConsole.menu.CodeEditorContextMenu = function(config){
    config = config || {};
    Ext.apply(config,{
        items: [{
            text: _('console.menu_context-copy'),
            iconCls: 'edit',
            handler: {fn:this.onClick,scope:this}
        }]
    });
    ModConsole.menu.CodeEditorContextMenu.superclass.constructor.call(this,config);
}
Ext.extend(ModConsole.menu.CodeEditorContextMenu,Ext.menu.Menu, {
    onClick:function(){
        w = new Ext.Window({
            title:'Data',
            width:500,
            items:[{
                'xtype':'textarea'
                ,'width':'98%'
                ,'height':300
                ,value:this.callerElement.dom.innerHTML
            }]
        });
        w.show();
        this.hide();
    }
});