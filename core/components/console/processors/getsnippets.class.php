<?php

class ConsoleGetSnippetsProcessor extends modProcessor{
    public function process() {
        $snippets = array();
        $q = $this->modx->newQuery('modSnippet');
        $q->select('name');
        $q->prepare();
        if ($q->stmt->execute()) {
            while ($row = $q->stmt->fetch(PDO::FETCH_ASSOC)) {
                $snippets[] = $row['name'];
            }
        }

        return $this->success($snippets);
    }
}

return 'ConsoleGetSnippetsProcessor';