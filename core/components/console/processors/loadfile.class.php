<?php

require_once dirname(__FILE__) . '/console.class.php';

class ConsoleLoadCodeProcessor extends modConsoleProcessor{
    
    public function process() {
        $file = trim($this->getProperty('file',''));
        
        if (empty($file)) return $this->failure($this->modx->lexicon('console_err_file_ns'));
        
        $path = $this->modx->getOption('console_core_path', NULL, $this->modx->getOption('core_path') . 'components/console/').'files/';
        
        $f = $path . $file; 
        
        $code = '';
        if (file_exists($f)) {
            $code = @file_get_contents($f);
        } else {
            return $this->failure($this->modx->lexicon('console_err_file_nf'));
        }

        return $this->success($code);
    }
}

return 'ConsoleLoadCodeProcessor';