<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $fullName = $_POST['full-name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Email recipient
    $to = "dzhemile.ahmet@gmail.com";

    // Subject of the email
    $subject = "Contact Form Submission from $fullName";

    // Message content
    $body = "Name: $fullName\n";
    $body .= "Email: $email\n";
    $body .= "Message: $message\n";

    // Additional headers
    $headers = "From: $email";

    // Send the email
    if (mail($to, $subject, $body, $headers)) {
        // Success message
        echo "Thank you for contacting us! We will get back to you soon.";
    } else {
        // Failure message
        echo "Sorry, something went wrong. Please try again later.";
    }
} else {
    // If the form is not submitted properly
    echo "Invalid request.";
}
?>
