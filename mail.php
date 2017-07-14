
<?php
$recepient = "kolodaslav@gmail.com";
$sitename = "YETC";
$name = trim($_GET["name"]);
$phone = trim($_GET["phone"]);
$pagetitle = "Новая заявка с сайта YETC";
$message = "ИМЯ: $name ТЕЛЕФОН: $phone "; 
mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");