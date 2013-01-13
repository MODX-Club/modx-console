<?php

class ConsoleIndexManagerController extends ConsoleManagerController{
    
    function process(array $scriptProperties = array()) {

        #add js
        $this->addJavascript($this->config['assets_url'].'js/mgr/widgets/console.panel.js');
        $this->addJavascript($this->config['assets_url'].'js/mgr/sections/home.js');

        $this->modx->invokeEvent('OnSnipFormPrerender');
    }
    
    function getTemplateFile() {
        return $this->getTemplate('index.tpl');
    }
}
?>
