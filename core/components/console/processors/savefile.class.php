<?php

class ConsoleSaveFileProcessor extends modProcessor{

    public $permission = 'console.save_file';

    public function process() {
        $code = trim($this->getProperty('code',''));
        $fileName = basename(trim($this->getProperty('name','')));
        $fileName = $this->modx->sanitizeString($fileName);
        if (empty($fileName)) {
            $this->addFieldError('name',$this->modx->lexicon('console_err_file_nsp'));
            return $this->failure($this->modx->lexicon('console_err_file_nsp'));
        }

        $path = $this->modx->getOption('console_core_path', NULL, $this->modx->getOption('core_path') . 'components/console/').'files/';
        if (!is_dir($path) && !mkdir($path,0755)) $this->failure($this->modx->lexicon('console_err_path_nf'));

        $file = $path . $fileName . '.php';
        if (!empty($code)) {
            file_put_contents($file, $code);
        } else {
            unlink($file);
        }

        return $this->success();
    }
}

return 'ConsoleSaveFileProcessor';
