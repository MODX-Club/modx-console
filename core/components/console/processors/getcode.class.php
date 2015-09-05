<?php

require_once dirname(__FILE__) . '/console.class.php';

class ConsoleGetCodeProcessor extends modConsoleProcessor{
    
    public function process() {
        $modx = & $this->modx;
        $code = $_SESSION['Console']['code'];
        if (!$code) {
            $code = "<?php\n";
        }
        return $this->success($code);
    }
}

return 'ConsoleGetCodeProcessor';