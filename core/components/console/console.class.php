<?php

class ConsoleManagerController extends modExtraManagerController{
    
    function __construct(modX &$modx, $config = array()) {
        parent::__construct($modx, $config);
        $this->config['namespace_assets_path'] = $modx->call('modNamespace','translatePath',array(&$modx, $this->config['namespace_assets_path']));
        #manager url still called "assets_url" for safe install
        $this->config['manager_url'] = $modx->getOption('console.manager_url', null, $modx->getOption('manager_url').'components/console/');
        $this->config['connector_url'] = $this->config['manager_url'].'connectors/';
    }

    public function getLanguageTopics() {
        return array('console:default');
    }

    public function checkPermissions() { return true;}

    function initialize(){
        $this->addJavascript($this->config['manager_url'].'js/console.js');
        $this->addHtml('<script type="text/javascript">
        Ext.onReady(function() {
            ModConsole.config.connector_url = "'.$this->config['connector_url'].'";
        });
        </script>');
    }
    
    function getTemplate($tpl) {
        return $this->config['namespace_path']."templates/default/{$tpl}";
    }
}
?>
