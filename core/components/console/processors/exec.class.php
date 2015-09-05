<?php

require_once dirname(__FILE__) . '/console.class.php';

class ConsoleExecProcessor extends modConsoleProcessor{
    
    public function process() {
        $modx = & $this->modx;
        $modx->setLogTarget('HTML');
        $modx->setLogLevel(xPDO::LOG_LEVEL_DEBUG);
        $code = $this->getProperty('code');
        $_SESSION['Console']['code'] = $code;
        $code = preg_replace('/^ *(<\?php|<\?)/mi', '', $code);
        ob_start();
        eval($code);
        $output = ob_get_contents();
        ob_end_clean();
        $completed = true;
        if (isset($_SESSION['Console']['completed'])) {
            if ($_SESSION['Console']['completed'] === false) {
                $completed = false;
            } else {
                unset($_SESSION['Console']['completed']);
            }
        }
        return $modx->toJSON(array('completed' => $completed, 'output' => $output));
    }
}

return 'ConsoleExecProcessor';