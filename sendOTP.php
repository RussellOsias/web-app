<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Function to send OTP via email
function sendOTP($email, $otp) {
    try {
        // Create instance; passing `true` enables exceptions
        $mail = new PHPMailer(true);

        // Server settings
        $mail->isSMTP();                                            // Send using SMTP
        $mail->Host       = 'smtp.gmail.com';                       // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $mail->Username   = 'valoaccs1928@gmail.com';               // SMTP username
        $mail->Password   = 'zvqmkguzrnwurscd';                     // SMTP password (App Password for Gmail)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption
        $mail->Port       = 587;                                    // TCP port to connect to

        // Recipients
        $mail->setFrom('valoaccs1928@gmail.com', 'Verification Code');
        $mail->addAddress($email);     // Add a recipient

        // Content
        $mail->isHTML(true);           // Set email format to HTML
        $mail->Subject = 'Your One-Time Password (OTP)';
        $mail->Body    = "Your OTP is: <b>$otp</b><br><br>This code will expire in 5 minutes.";

        // Send the email
        $mail->send();
        return ["success" => true];
    } catch (Exception $e) {
        return ["success" => false, "error" => $mail->ErrorInfo];
    }
}

// Handle POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data["email"];
    $otp = $data["otp"];

    // Send OTP
    $result = sendOTP($email, $otp);

    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($result);
}
?>