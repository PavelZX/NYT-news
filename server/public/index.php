<?php

require_once __DIR__ . '/../src/functions.php';

// Default index page
router('GET', '^/$', function() {
    echo '<a href="articles">List articles</a><br>';
});

// GET request to /articles
router('GET', '^/articles$', function() {
    echo '<a href="articles/1000">Show article: 1000</a>';
});

// With named parameters
router('GET', '^/articles/(?<id>\d+)$', function($params) {
    echo "You selected Article-ID: ";
    var_dump($params);
});

// POST request to /articles
router('POST', '^/articles$', function() {
    header('Content-Type: application/json');
    $json = json_decode(file_get_contents('php://input'), true);
    echo json_encode(['result' => 1]);
});

header("HTTP/1.0 404 Not Found");
echo '404 Not Found';