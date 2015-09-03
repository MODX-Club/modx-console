<?php

class ConsoleGetFilesProcessor extends modProcessor{
    public function process() {
        $path = $this->modx->getOption('console_core_path', NULL, $this->modx->getOption('core_path') . 'components/console/').'files/';
        $files = array();
        foreach(scandir($path) as $tmp) {
            if (strpos($tmp,'.php') !== false) $files[] = $tmp;
        };
        return $this->success($files);
    }
}

return 'ConsoleGetFilesProcessor';