<?php

require_once dirname(__FILE__) . '/console.class.php';

class ConsoleExecProcessor extends modConsoleProcessor{
    
    public function process() {
        $modx = & $this->modx;
        
        if($this->getProperty("show_errors", 1)){
            ini_set("display_errors", 1);
            $modx->setLogTarget('HTML');
            $modx->setLogLevel(xPDO::LOG_LEVEL_DEBUG);
        }
        
        $code = $this->getProperty('code');
        $_SESSION['Console']['code'] = $code;
        $code = preg_replace('/^ *(<\?php|<\?)/mi', '', $code);
        $queryPre = isset($modx->executedQueries) ? $modx->executedQueries : 0;
        $timePre = $modx->queryTime;
        ob_start();
        $prevMem = memory_get_peak_usage(true);
        $timestart = microtime(true);
        $result = eval($code);
        $totalTime = (microtime(true) - $timestart);
        $totalMem = round((memory_get_peak_usage(true) - $prevMem)/1048576,2);
        $output = ob_get_contents();
        ob_end_clean();
        
        if($result){
            $output = $result;
        }
        
        $completed = true;
        if (isset($_SESSION['Console']['completed'])) {
            if ($_SESSION['Console']['completed'] === false) {
                $completed = false;
            } else {
                unset($_SESSION['Console']['completed']);
            }
        }
        
        if($this->getProperty("show_report", 1)){
            
            $timeAfter = $modx->queryTime;
            $queryAfter = isset($modx->executedQueries) ? $modx->executedQueries : 0;
            $sqlTime = ($timeAfter - $timePre);
            $phpTime = ($totalTime - $sqlTime);
            $report = "<hr />\n";
            $report .= "<pre>\n";
            $report .= "SQL time: ".sprintf("%2.4f s", $sqlTime);
            $report .= "\nSQL queries: ".($queryAfter - $queryPre);
            $report .= "\nPHP time: ".sprintf("%2.4f s", $phpTime);
            $report .= "\nTotal time: ".sprintf("%2.4f s", $totalTime);
            $report .= "\nMemory: ".$totalMem." MB\n";
            $report .= "</pre>";
            
            $output .= $report;
        }
        
        
        return $modx->toJSON(array('completed' => $completed, 'output' => $output));
    }
}

return 'ConsoleExecProcessor';
