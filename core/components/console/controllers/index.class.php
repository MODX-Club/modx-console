<?php

class ConsoleIndexManagerController extends ConsoleManagerController{
    
    function process(array $scriptProperties = array()) {
        $this->modx->invokeEvent('OnSnipFormPrerender');
        return array(
            "config" => $this->modx->toJSON($this->config),
        );
    }
    
    function getTemplateFile() {
        return $this->getTemplate('index.tpl');
    }
}
?>
