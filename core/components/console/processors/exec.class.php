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
        $code = $this->getProperty('code');
        $code = preg_replace('/^ *(<\?php|<\?)/mi', '', $code);
        return eval($code);
    }
}

return 'ConsoleExecProcessor';
?>
