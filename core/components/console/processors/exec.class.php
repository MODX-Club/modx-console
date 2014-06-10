<?php

class ConsoleExecProcessor extends modProcessor{
    var $permission = 'console';
    
    function checkPermissions() {
        if(!$this->modx->hasPermission($this->permission)){
            return  false;
        }
        return true;
    }
    
    public function process() {
        $modx = & $this->modx;
        $modx->setLogTarget('HTML');
        $modx->setLogLevel(xPDO::LOG_LEVEL_DEBUG);
        $code = $this->getProperty('code');
        $_SESSION['Console']['code'] = $code;
        $code = preg_replace('/^ *(<\?php|<\?)/mi', '', $code);
        return eval($code);
    }
}

return 'ConsoleExecProcessor';
?>
