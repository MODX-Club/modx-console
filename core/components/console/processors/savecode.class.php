<?php
class ConsoleSaveCodeProcessor extends modProcessor{
    public function process() {
        $code = trim($this->getProperty('code',''));
        $file = trim($this->getProperty('file',''));
        $path = $this->modx->getOption('console_core_path', NULL, $this->modx->getOption('core_path') . 'components/console/').'files/';
        if (!is_dir($path) && !mkdir($path,0755)) $this->failure($this->modx->lexicon('console_err_path_nf'));
        if (!empty($code) && $file) file_put_contents($path.$file.'.php', $code );

        return $this->success('');
    }
}

return 'ConsoleSaveCodeProcessor';