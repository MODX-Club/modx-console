<?php

abstract class modConsoleProcessor extends modProcessor{
    var $permission = 'console';
    
    function checkPermissions() {
        if(!$this->modx->hasPermission($this->permission)){
            return  false;
        }
        return true;
    }
}

return 'modConsoleProcessor';