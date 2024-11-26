<!doctype html>
<html lang="<?php echo $lang; ?>">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="">
    <meta name="author" content="">

    <title>Doarti</title>

    <!-- CSS FILES -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&family=Sono:wght@200;300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/bootstrap-icons.css">
    <link rel="stylesheet" href="css/owl.carousel.min.css">
    <link rel="stylesheet" href="css/owl.theme.default.min.css">
    <link href="css/templatemo-pod-talk.css" rel="stylesheet">
</head>
<?php
session_start();

if (isset($_GET['lang'])) {
    $_SESSION['lang'] = $_GET['lang'];
}

$lang = $_SESSION['lang'] ?? 'en';
$translations = include "languages/{$lang}.php";
?>

<body>
    <nav class="navbar navbar-expand-lg">
        <div class="container">
            <a class="navbar-brand me-lg-5 me-0" href="index.php">
                <img src="images/logo-doarti.png" class="logo-image img-fluid" alt="Doarti">
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-lg-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="index.php"><?php echo $translations['header']['home']; ?></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about.php"><?php echo $translations['header']['about']; ?></a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarLightDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <?php echo $translations['header']['paintings']; ?>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-light" aria-labelledby="navbarLightDropdownMenuLink">
                            <?php foreach ($translations['header']['years'] as $year => $label): ?>
                                <li><a class="dropdown-item" href="<?php echo $year; ?>.php"><?php echo $label; ?></a></li>
                            <?php endforeach; ?>
                        </ul>
                    </li>
                    <!-- Language Selector -->
                    <li class="nav-item dropdown">
                        <div class="ms-4">
                        <a class="nav-link dropdown-toggle"role="button"  aria-expanded="false">
                                <?php echo strtoupper($lang); ?>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-light">
                                <li>
                                    <a class="dropdown-item" href="?lang=en">EN</a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="?lang=bg">BG</a>
                                </li>
                            </ul>
                            </div>
                    </li>
                </ul>

                <div class="ms-4">
                    <a href="contact.php" class="btn custom-btn custom-border-btn smoothscroll"><?php echo $translations['header']['contact']; ?></a>
                </div>
            </div>
        </div>
    </nav>