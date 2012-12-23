<div id="modx-extra-console"></div>
<script type="text/javascript">

new (function(config){
    var self = this;
    
    this.config = config || {};
    
    
    var height = 400;
    
    var mainPanel = Ext.getCmp('modx-content');
    
    if(mainPanel){
        height = Math.round((mainPanel.getHeight() / 4 * 3) || height);
    }


    this.request = function(){
        var code = self.TextArea.getEl().getValue();  
        self.OutputPanel.getEl().getUpdater().update({
            url: self.config.connector_url + 'console.php',
            params:{
                action: 'exec',
                code: code
            }
	})
    }

    {literal}
    
    this.TextArea = new Ext.form.TextArea({
        anchor: 'console',
        id: 'modx-snippet-snippet',
        height:  height,
        width: '100%',
        border: true,
        enableKeyEvents: true,
        listeners: {
            keydown: function(editor, e){
                if(Ext.isObject(editor) && editor.getValue){
                    this.setValue(editor.getValue());
                }
            },
            onCtrlEnter: function(editor){
                self.request();
            }
        },
        value: '<?php'
    });
    
    this.Editor = new Ext.Panel({
        id: 'x-form-el-modx-snippet-snippet',
        items: [this.TextArea],
        bbar: [{
            text: 'Execute',
            handler: this.request
        }]
    });

    {/literal}
        
    this.OutputPanel = new Ext.Panel({
        border: false,
        renderTo: Ext.get('modx-extra-console-output'),
        autoHeight: true
    });

    
    
    
    new Ext.Panel({
        border: false,
        renderTo: Ext.get('modx-extra-console'),
        items: [new MODx.Panel({
            title: 'Console',
            items: [
                this.Editor
            ]}),
            this.OutputPanel
        ]
    });

})({$config});

</script>