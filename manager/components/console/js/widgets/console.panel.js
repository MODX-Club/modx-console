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
				title: _('console_tab')
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

	var visibleHeight = Ext.getCmp('modx-content').getHeight() - 300;
	if(visibleHeight < 200){
		visibleHeight = 200;
	}

	this.resultPanel = new Ext.Panel({
		id: 'mod-console-coderesult'
		,cls: 'x-panel-body'
		,width: '99%'
		,border: false
		,listeners:{
			"afterrender": {
				fn: function(el){
					var upd = el.getUpdater();
					upd.on('beforeupdate',function(a, b){
						if (upd.showLoadIndicator !== false) {
							this.coderesultText.setValue('...');
						}
					}, this);
					upd.on('update',function(result, response){
						var res = JSON.parse(response.responseText);
						this.resultPanel.update(res.output);
						this.coderesultText.setValue(res.output);
						if (res.completed === false) {
							upd.showLoadIndicator = false;
							this.request();
						} else {
							upd.showLoadIndicator = true;
						}
					}, this);
				}
			}
			,scope: this
		}
	});

	this.coderesultText = new Ext.form.TextArea({
		id: 'mod-console-coderesult-text'
		,cls: 'x-panel-body'
		,width: '99%'
		,height: visibleHeight / 2
		,style: "overflow:auto;"
	});

	Ext.apply(config,{
		id: 'modxconsole-codeeditor'
		,border: false
		,baseCls: 'modx-formpanel'
		,cls: 'container'
		,style: {
			margin: '15px 0 0'
		}
		,items: [{
			html: '<p>'+_('console_desc')+'</p>'
			,border: false
			,bodyCssClass: 'panel-desc'
		},{
			id: 'mod-console-codeeditor'
			,xtype: Ext.ComponentMgr.types['modx-texteditor'] ? 'modx-texteditor' : 'textarea'
			,mimeType: 'application/x-php'
			,height: 300
			,width: 'auto'
			,style: {
				margin: '15px'
			}
			,enableKeyEvents: true
			,listeners: {
				keydown: function(editor, e){
					if (e && e.ctrlKey && e.keyCode == e.ENTER) {
						this.request();
					}
				}
				,scope: this
			}
			,value: this.getCodeEditorValue()
		},{
            xtype: 'toolbar'
            ,items: [
                {
                    text: _('console_exec')
                    ,listeners: {
                        click: function () {
                            this.request();
                        }
                        ,scope: this
                    }
                }
                ,{
    				id: 'console-report',
                	xtype: 'checkbox',
    				hideLabel: true,
    				boxLabel: '<div style="padding:0.25em 0 0 2em;">'+_('console_report')+'</div>',
    				//style: {position:'relative'},
    				checked: true
                }
                ,{
    				id: 'console-show-errors',
                	xtype: 'checkbox',
    				hideLabel: true,
    				boxLabel: '<div style="padding:0.25em 0 0 2em;">'+_('console_show_errors')+'</div>',
    				//style: {position:'relative'},
    				checked: true
                }
                ,'->'
                ,{
                    text: _('console_save')
                    ,menu: {
                        items: [{
                            text: _('console_save_to_file'),
                            handler: function() {
                            this.saveFile();
                            },
                            scope: this
                        },{
                            text: _('console_save_snippet'),
                            handler: function() {
                            this.saveSnippet();
                            },
                            scope: this
                        }]
                    }
                }
                ,{
                    text: _('console_load')
                    ,menu: {
                        items: [{
                            text: _('console_load_from_file'),
                                handler: function () {
                                this.getFiles();
                            },
                            scope: this
                        },{
                            text: _('console_load_from_snippet'),
                                handler: function () {
                                this.getSnippets();
                            },
                            scope: this
                        }]
                    }
                },{
                    text: _('console_clear')
                    ,handler: function () {
                        Ext.getCmp('mod-console-codeeditor').setValue('<?php\n');
                    }
                }
            ]
		},{
			xtype: 'modx-vtabs'
			,defaults: {
				border: false
				,autoHeight: false
				,bodyStyle: "height: "+ visibleHeight / 2 +"px;overflow:auto;"
				,style: {
					padding: '15px'
				}
			}
			,width:'98%'
			,height: '100%'
			,stateful: true
			,stateId: 'mod-console-result-tabpanel'
			,stateEvents: ['tabchange']
			,border: false
			,items: [{
				xtype: 'panel'
				,title: _('console_formated_result')
				,items: [this.resultPanel]
			},{
				xtype: 'panel'
				,title: _('console_source_result')
				,border: false
				,items: [this.coderesultText]
			}]
		}]
	});
	ModConsole.panel.CodeEditor.superclass.constructor.call(this,config);
};

Ext.extend(ModConsole.panel.CodeEditor,MODx.Panel, {
	request:function(){

		var area = Ext.getCmp('mod-console-codeeditor');
		var code = area.getValue();
        
        
		var upd = this.resultPanel.getUpdater();
		upd.timeout = 0;
		upd.update({
			url: ModConsole.config.connector_url + 'console.php',
			params:{
				action: 'exec'
                ,show_report: Ext.getCmp('console-report').checked * 1
                ,show_errors: Ext.getCmp('console-show-errors').checked * 1
				,code: code
			}
		});
	},
	getCodeEditorValue:function(){
		MODx.Ajax.request({
			url: 'components/console/connectors/console.php',
			params: {
				action: 'getcode'
			},
			listeners: {
				success: {fn: function(response) {
					var el = Ext.getCmp('mod-console-codeeditor');
					el.setValue(response.message);
				}, scope: this}
			}
		});
		return '<?php\n';
	},
	getSnippets:function(){
		MODx.Ajax.request({
			url: 'components/console/connectors/console.php',
			params: {
				action: 'getsnippets'
			},
			listeners: {
				success: {fn: function(response) {
					ModConsole.comboObjects = response.message;
					if (this.loadObjectsWindow) this.loadObjectsWindow.el.remove();
					this.loadObjectsWindow = MODx.load({
						xtype: 'console-snippets-window',
						id: Ext.id(),
						store: response.message,
						listeners: {
							success: {
								fn: function (response) {
									if (response.a.result.success) {
										var code = response.a.result.message ? response.a.result.message : '<?php\n';
										var el = Ext.getCmp('mod-console-codeeditor');
										el.setValue(code);
									}
								}, scope: this
							},
							failure: {
								fn: function(r){}, scope: this
							}
						}
					});
					this.loadObjectsWindow.show(Ext.EventObject.target);
				}, scope: this},
				failure: {fn: function(response) {}, scope: this}
			}
		});
	},
	getFiles:function(){
		MODx.Ajax.request({
			url: 'components/console/connectors/console.php',
			params: {
				action: 'getfiles'
			},
			listeners: {
				success: {fn: function(response) {
					//ModConsole.comboObjects = response.message;
					if (this.loadObjectsWindow) this.loadObjectsWindow.el.remove();
					this.loadObjectsWindow = MODx.load({
						xtype: 'console-files-window',
						id: Ext.id(),
						store: response.message,
						listeners: {
							success: {
								fn: function (response) {
									if (response.a.result.success) {
										var code = response.a.result.message ? response.a.result.message : '<?php\n';
										Ext.getCmp('mod-console-codeeditor').setValue(code);
									}
								}, scope: this
							},
							failure: {
								fn: function(r){}, scope: this
							}
						}
					});
					this.loadObjectsWindow.show(Ext.EventObject.target);
				}, scope: this},
				failure: {fn: function(response) {}, scope: this}
			}
		});
	},
	saveSnippet:function(){
		var code = Ext.getCmp('mod-console-codeeditor').getValue();

		if (this.saveObjectWindow) this.saveObjectWindow.el.remove();
		this.saveObjectWindow = MODx.load({
			xtype: 'console-savecode-window',
			id: Ext.id(),
			action: 'savesnippet',
			title: _('console_snippet'),
			fields: [{
				xtype: 'hidden',
				name: 'code',
				value: code
			}, {
				xtype: 'textfield',
				name: 'name',
				value: ModConsole.snippetName || 'test',
				anchor: '100%'
			}, {
				xtype: 'checkbox',
				name: 'overwrite',
				boxLabel: _('console_overwrite_snippet'),
				//style: {paddingTop:'0px'},
				checked: true
			}],
			listeners: {
				success: {
					fn: function (response) {
						if (response.a.result.success) {
						}
					}, scope: this
				},
				failure: {
					fn: function(r){}, scope: this
				}
			}
		});
		this.saveObjectWindow.show(Ext.EventObject.target);
	},
	saveFile:function(){
		var code = Ext.getCmp('mod-console-codeeditor').getValue();

		if (this.saveObjectWindow) this.saveObjectWindow.el.remove();
		this.saveObjectWindow = MODx.load({
			xtype: 'console-savecode-window',
			id: Ext.id(),
			action: 'savefile',
			title: _('console_file'),
			fields: [{
				xtype: 'hidden',
				name: 'code',
				value: code
			}, {
				xtype: 'textfield',
				name: 'name',
				fieldLabel: _('console_enter_file_name'),
				value: ModConsole.fileName || 'test',
				anchor: '100%'
			}],
			listeners: {
				success: {
					fn: function (response) {
						if (response.a.result.success) {

						}
					}, scope: this
				},
				failure: {
					fn: function(r){}, scope: this
				}
			}
		});
		this.saveObjectWindow.show(Ext.EventObject.target);
	}

});
Ext.reg('mod-console-panel-codeeditor',ModConsole.panel.CodeEditor);

/*******************************************************************/
ModConsole.window.SaveCode = function (config) {
	config = config || {};

	Ext.applyIf(config, {
		width: 300,
		modal: true,
		url: 'components/console/connectors/console.php',
		keys: [{
			key: Ext.EventObject.ENTER, shift: true, fn: function () {
				this.submit()
			}, scope: this
		}]
	});
	ModConsole.window.SaveCode.superclass.constructor.call(this, config);
};
Ext.extend(ModConsole.window.SaveCode, MODx.Window);
Ext.reg('console-savecode-window', ModConsole.window.SaveCode);

// Select Snippet Window
ModConsole.window.SelectSnippet = function (config) {
	config = config || {};
	if (!config.id) {
		config.id = 'console-snippets-window';
	}
	Ext.applyIf(config, {
		title: _('console_snippet'),
		width: 400,
		modal: true,
		url: 'components/console/connectors/console.php',
		action: 'loadsnippet',
		fields: [{
			xtype: 'console-combo-objects',
			name: 'snippet',
			emptyText: _('console_select_snippet'),
			store: config.store,
			anchor: '100%'
		}],
		keys: [{
			key: Ext.EventObject.ENTER, shift: true, fn: function () {
				ModConsole.snippetName = Ext.getCmp('comboObjectName').getValue();
				this.submit()
			}, scope: this
		}],
		buttons: [{
			text: _('console_close'),
			id: config.id + '-close-btn',
			handler: function () {
				this.hide();
			},
			scope: this
		}, {
			text: _('console_load'),
			id: config.id + '-load-btn',
			handler: function () {
				ModConsole.snippetName = Ext.getCmp('comboObjectName').getValue();
				this.submit();
			},
			scope: this
		}],
		listeners: {

		}
	});
	ModConsole.window.SelectSnippet.superclass.constructor.call(this, config);
};
Ext.extend(ModConsole.window.SelectSnippet, MODx.Window);
Ext.reg('console-snippets-window', ModConsole.window.SelectSnippet);

// Select File Window
ModConsole.window.SelectFiles = function (config) {
	config = config || {};
	if (!config.id) {
		config.id = 'console-files-window';
	}
	Ext.applyIf(config, {
		title: _('console_file'),
		width: 400,
		modal: true,
		url: 'components/console/connectors/console.php',
		action: 'loadfile',
		fields: [{
			xtype: 'console-combo-objects',
			name: 'file',
			store: config.store,
			emptyText: _('console_select_file'),
			anchor: '100%'
		}],
		keys: [{
			key: Ext.EventObject.ENTER, shift: true, fn: function () {
				var fileName = Ext.getCmp('comboObjectName').getValue();
				ModConsole.fileName = fileName.substring(0, fileName.length-4);
				this.submit()
			}, scope: this
		}],
		buttons: [{
			text: _('console_close'),
			id: config.id + '-close-btn',
			handler: function () {
				this.hide();
			},
			scope: this
		}, {
			text: _('console_load'),
			id: config.id + '-load-btn',
			handler: function () {
				var fileName = Ext.getCmp('comboObjectName').getValue();
				ModConsole.fileName = fileName.substring(0, fileName.length-4);
				this.submit();
			},
			scope: this
		}]
	});
	ModConsole.window.SelectFiles.superclass.constructor.call(this, config);
};
Ext.extend(ModConsole.window.SelectFiles, MODx.Window);
Ext.reg('console-files-window', ModConsole.window.SelectFiles);


ModConsole.combo.Objects = function(config) {
	config = config || {};
	Ext.applyIf(config,{
		triggerAction: 'all',
		id: 'comboObjectName',
		mode: 'local',
		hideMode: 'offsets',
		autoScroll: true,
		maxHeight: 200,
		hiddenName: 'file',
		editable: false
	});
	ModConsole.combo.Objects.superclass.constructor.call(this,config);
};
Ext.extend(ModConsole.combo.Objects,MODx.combo.ComboBox);
Ext.reg('console-combo-objects',ModConsole.combo.Objects);