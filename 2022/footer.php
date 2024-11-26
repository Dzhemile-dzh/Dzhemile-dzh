<footer class="site-footer">
    <div class="container">
        <div class="row">
            <div class="col-lg-6 col-12 mb-5 mb-lg-0">
                <div class="subscribe-form-wrap">
                    <h6><?php echo $translations['footer']['subscribe']; ?></h6>
                    <form class="custom-form subscribe-form" action="subscribe.php" method="post" role="form">
                        <input type="email" name="subscribe-email" id="subscribe-email" pattern="[^ @]*@[^ @]*" class="form-control" placeholder="<?php echo $translations['footer']['email_placeholder']; ?>" required>
                        <div class="col-lg-12 col-12">
                            <button type="submit" class="form-control" id="submit"><?php echo $translations['footer']['subscribe_button']; ?></button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="col-lg-3 col-md-6 col-12 mb-4 mb-md-0 mb-lg-0">
                <h6 class="site-footer-title mb-3"><?php echo $translations['footer']['contact']; ?></h6>
                <p class="mb-2">
                    <strong class="d-inline me-2"><?php echo $translations['footer']['phone']; ?></strong> +359 895 62 75 11
                </p>
                <p>
                    <strong class="d-inline me-2"><?php echo $translations['footer']['email']; ?></strong>
                    <a href="mailto:dzhemile.ahmet@gmail.com">dzhemile.ahmet@gmail.com</a>
                </p>
            </div>

            <div class="col-lg-3 col-md-6 col-12">
                <h6 class="site-footer-title mb-3"><?php echo $translations['footer']['socials']; ?></h6>
                <ul class="social-icon">
                    <li class="social-icon-item">
                        <a href="https://www.instagram.com/doarti42/" class="social-icon-link bi-instagram" target="_blank"></a>
                    </li>
                    <li class="social-icon-item">
                        <a href="https://www.saatchiart.com/en-bg/brushwhisker42" class="social-icon-link bi-whatsapp" target="_blank"></a>
                    </li>
                    <li class="social-icon-item">
                        <a href="viber://chat?number=0895627511" class="social-icon-link bi-cursor" target="_blank"></a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class="container pt-5">
        <div class="row align-items-center">
            <div class="col-lg-2 col-md-3 col-12">
                <a class="navbar-brand" href="../index.php">
                    <img src="../images/logo-doarti.png" class="logo-image img-fluid" alt="Doarti">
                </a>
            </div>

            <div class="col-lg-6 col-md-9 col-12">
                <ul class="site-footer-links">
                    <li class="site-footer-link-item">
                        <a href="#" class="site-footer-link"><?php echo $translations['footer']['homepage']; ?></a>
                    </li>
                    <li class="site-footer-link-item">
                        <a href="../contact.php" class="site-footer-link"><?php echo $translations['footer']['contact_page']; ?></a>
                    </li>
                    <li class="site-footer-link-item">
                        <a href="../about.php" class="site-footer-link"><?php echo $translations['footer']['about_page']; ?></a>
                    </li>
                </ul>
            </div>

            <div class="col-lg-4 col-12">
                <p class="copyright-text mb-0"><?php echo $translations['footer']['copyright']; ?></p>
            </div>
        </div>
    </div>
</footer>
<!-- JAVASCRIPT FILES -->
<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.bundle.min.js"></script>
<script src="../js/owl.carousel.min.js"></script>
<script src="../js/custom.js"></script>
</body>

</html>