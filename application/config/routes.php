<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$route['default_controller'] = 'C_home';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;


$route['feeder/feed'] = 'C_feeder/feed';
$route['feeder/insert'] = 'C_feeder/insertAPI';

