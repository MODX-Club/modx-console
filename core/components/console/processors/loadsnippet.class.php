<?php

require_once dirname(__FILE__) . '/console.class.php';

class ConsoleLoadSnippetProcessor extends modConsoleProcessor{

    public function process() {
        $name = trim($this->getProperty('file',''));
        if (empty($name)) return $this->failure($this->modx->lexicon('console_err_snippet_ns'));
        /** @var modSnippet $snippet */
        if ($snippet =  $this->modx->getObject('modSnippet',array('name'=>$name))) {
            $code = "<?php\n".$snippet->getContent();
        } else {
            return $this->failure($this->modx->lexicon('console_err_snippet_nf'));
        }

        return $this->success($code);
    }
}

return 'ConsoleLoadSnippetProcessor';