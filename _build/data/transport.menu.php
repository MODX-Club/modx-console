<?php
$menus  =  array();

/*
 * Основной контроллер
 */

$action= $modx->newObject('modAction');
$action->fromArray(array(
    'id' => 1,
    'namespace' => NAMESPACE_NAME,
    'parent' => 0,
    'controller' => 'console',
    'haslayout' => 1,
    'lang_topics' => 'console:default',
    'assets' => '',
),'',true,true);

/* load action into menu */
$menu= $modx->newObject('modMenu');
$menu->fromArray(array(
    'text' => 'console',
    'parent' => 'components',
    'description' => 'console.desc',
    'icon' => 'images/icons/plugin.gif',
    'menuindex' => 0,
    'params' => '',
    'handler' => '',
    'permissions'   => 'console',
),'',true,true);
$menu->addOne($action);
unset($action);

$menus[] = $menu;




$menus[] = $menu;

return $menus;