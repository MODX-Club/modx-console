<?php

class ConsoleIndexManagerController extends ConsoleManagerController{
    
    function process(array $scriptProperties = array()) {

        #add js
        $this->addJavascript($this->config['manager_url'].'js/widgets/console.panel.js');
        $this->addJavascript($this->config['manager_url'].'js/sections/home.js');

        $this->modx->invokeEvent('OnSnipFormPrerender');
    }
    
    function getTemplateFile() {
        return $this->getTemplate('index.tpl');
    }
}
?>
