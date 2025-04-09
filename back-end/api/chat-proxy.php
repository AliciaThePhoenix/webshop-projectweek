<?php
// Set headers to allow CORS and JSON content type
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Enable more detailed error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_log("Chat proxy called at " . date('Y-m-d H:i:s'));

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// API configuration - Mistral AI
$api_key = 'vHrsX9bWGF3AW7fR0hblwIQzSekJQHa1';
$api_url = 'https://api.mistral.ai/v1/chat/completions';
$model = 'mistral-medium'; // Default Mistral model

// Check if this is a test request
$is_test = isset($_GET['test']) && $_GET['test'] === '1';

try {
    if ($is_test) {
        // This is a test request - use a simple predefined message
        $message = "Hello, can you respond with a simple test message?";
    } else {
        // Regular API usage - check for POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            throw new Exception('Only POST requests are allowed for regular usage');
        }

        // Get the request body and decode JSON
        $request_body = file_get_contents('php://input');
        error_log("Received request body: " . $request_body);
        
        $data = json_decode($request_body, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON in request: ' . json_last_error_msg());
        }

        // Validate request has message field
        if (!isset($data['message']) || empty($data['message'])) {
            throw new Exception('No message provided or message is empty');
        }
        
        $message = $data['message'];
    }

    // Log the message being sent for debugging
    error_log("Sending message to Mistral AI: " . $message);

    // Prepare request payload for Mistral AI
    $payload = [
        'model' => $model,
        'messages' => [
            [
                'role' => 'system',
                'content' => 'You are a helpful assistant for a pharmacy website called Apothecare, focus ur responses on health and wellness topics. Provide very concise, brief responses (2-3 short sentences maximum). Focus only on the most essential information. Avoid lengthy explanations or excessive details.'
            ],
            [
                'role' => 'user',
                'content' => $message
            ]
        ],
        'max_tokens' => 150,  // Reduced from 300 to enforce shorter responses
        'temperature' => 0.7  // Added to control response randomness
    ];

    // Initialize cURL session
    $ch = curl_init($api_url);
    if (!$ch) {
        throw new Exception("Failed to initialize cURL");
    }

    // Set cURL options for Mistral AI
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $api_key,
        'Accept: application/json'
    ]);

    // For debugging, capture verbose output
    curl_setopt($ch, CURLOPT_VERBOSE, true);
    $verbose = fopen('php://temp', 'w+');
    curl_setopt($ch, CURLOPT_STDERR, $verbose);

    // Execute the request
    $response = curl_exec($ch);
    
    // Check for cURL errors
    if ($response === false) {
        $curl_errno = curl_errno($ch);
        $curl_error = curl_error($ch);
        
        // Get verbose debug information
        rewind($verbose);
        $verboseLog = stream_get_contents($verbose);
        
        throw new Exception("cURL Error ($curl_errno): $curl_error\nVerbose log: $verboseLog");
    }

    $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Decode the API response
    $result = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Failed to decode API response: ' . json_last_error_msg());
    }

    // Check for API errors
    if ($status_code >= 400) {
        throw new Exception("API returned error status code: $status_code, Response: " . 
                           (isset($result['error']) ? json_encode($result['error']) : $response));
    }
    
    // Log success
    error_log("Successfully received API response with status code: $status_code");
    
    // If in test mode, add diagnostic info
    if ($is_test) {
        echo json_encode([
            'status' => 'test_completed',
            'api_status_code' => $status_code,
            'response' => $result
        ], JSON_PRETTY_PRINT);
    } else {
        // Otherwise, return the API response directly
        header('Content-Type: application/json');
        echo $response;
    }
    
} catch (Exception $e) {
    // Log error and return nice error response
    $error_message = $e->getMessage();
    error_log("Error in chat proxy: $error_message");
    
    http_response_code(500);
    echo json_encode([
        'error' => [
            'message' => $error_message,
            'type' => 'proxy_error'
        ]
    ]);
}
?>
