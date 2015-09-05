<?php

require_once dirname(__FILE__) . '/console.class.php';

class ConsoleGetFilesProcessor extends modConsoleProcessor{
    
    public function process() {
        $path = $this->modx->getOption('console_core_path', NULL, $this->modx->getOption('core_path') . 'components/console/').'files';
        $files = array();
        
        $this->incl($path, '', $files);
        
        return $this->success($files);
    }
    
    protected function incl($path, $dir = '', array & $files){
        foreach(glob($path . DIRECTORY_SEPARATOR. $dir . DIRECTORY_SEPARATOR. '*') as $val){
            $filename = basename($val);
            
            if(is_dir($val)){
                $this->incl($path, $dir . DIRECTORY_SEPARATOR . basename($val), $files);
            }
            else if(preg_match('/\.php$/', $val)){
                $filename = $dir . DIRECTORY_SEPARATOR . basename($val);
                $files[] = trim($filename, '/');
            }
        }
    }
}

return 'ConsoleGetFilesProcessor';