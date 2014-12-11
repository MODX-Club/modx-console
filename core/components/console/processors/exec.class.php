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
        ob_start();
        eval($code);
        $output = ob_get_contents();
        ob_end_clean();
        return ($output);
    }
}

return 'ConsoleExecProcessor';
?>
