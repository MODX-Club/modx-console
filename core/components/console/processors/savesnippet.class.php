<?php

require_once dirname(__FILE__) . '/console.class.php';

class ConsoleSaveSnippetProcessor extends modConsoleProcessor{

    public function process() {
        $code = trim($this->getProperty('code',''));
        $code = preg_replace('/^ *(<\?php|<\?)/mi', '', $code);
        $snippet = trim($this->getProperty('name',''));
        $overwrite = $this->getProperty('overwrite',false);
        if ($o = $this->modx->getObject('modSnippet',array('name'=>$snippet))) {
            if ($overwrite) {
                /** @var modProcessorResponse $response */
                $response = $this->modx->runProcessor('/element/snippet/update', array('id'=>$o->get('id'),'name'=>$snippet,'snippet'=>$code));
                if ($response->isError()) {
                    return $this->failure($response->getMessage());
                }
            } else {
                return $this->failure($this->modx->lexicon('console_err_snippet_ae'));
            }
        } else {
            /** @var modProcessorResponse $response */
            $response = $this->modx->runProcessor('/element/snippet/create', array('name'=>$snippet,'snippet'=>$code));
            if ($response->isError()) {
                return $this->failure($response->getMessage());
            }
        }
        return $this->success();
    }
}

return 'ConsoleSaveSnippetProcessor';