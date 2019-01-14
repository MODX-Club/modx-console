<?php
$menus  =  array();

/*
 * Основной контроллер
 */

/* load action into menu */
$menu= $modx->newObject('modMenu');
$menu->fromArray(array(
    'action' => 'index',
    'text' => 'console',
    'parent' => 'components',
    'description' => 'console_desc',
    'icon' => 'images/icons/plugin.gif',
    'menuindex' => 0,
    'params' => '',
    'handler' => '',
    'permissions'   => 'console',
    'namespace' => NAMESPACE_NAME,
),'',true,true);

$menus[] = $menu;

return $menus;