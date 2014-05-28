<?php
class ConsoleGetCodeProcessor extends modProcessor{
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
?>
