<?php

class ConsoleSaveFileProcessor extends modProcessor{
    
    public $permission = 'console.save_file';
    
    public function process() {
        $code = trim($this->getProperty('code',''));
        $fileName = basename(trim($this->getProperty('name','')));
        $path = $this->modx->getOption('console_core_path', NULL, $this->modx->getOption('core_path') . 'components/console/').'files/';
        if (!is_dir($path) && !mkdir($path,0755)) $this->failure($this->modx->lexicon('console_err_path_nf'));
        if (!empty($code) && $fileName) file_put_contents($path.$fileName.'.php', $code );

        return $this->success();
    }
}

return 'ConsoleSaveFileProcessor';
