<?php include('header.php'); ?>

<main>
    <header class="site-header d-flex flex-column justify-content-center align-items-center"
        id="header-solid">
    </header>

    <section class="section-padding" id="section_2">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-5 col-12 mt-5 mt-lg-0">
                    <h1>
                        <span class="bordered" style="font-size: 60px;">
                            <?php echo $translations['contact']['header']; ?>
                        </span>
                    </h1>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-5 col-12 pe-lg-5">
                    <div class="contact-info">
                        <p class="d-flex border-bottom pb-3 mb-4">
                            <strong class="d-inline me-4"><?php echo $translations['contact']['phone']; ?></strong>
                            <span>+359 895 62 75 11</span>
                        </p>

                        <p class="d-flex border-bottom pb-3 mb-4">
                            <strong class="d-inline me-4"><?php echo $translations['contact']['email']; ?></strong>
                            <a href="mailto:dzhemile.ahmet@gmail.com">dzhemile.ahmet@gmail.com</a>
                        </p>

                        <p class="d-flex">
                            <strong class="d-inline me-4"><?php echo $translations['contact']['location']; ?></strong>
                            <span><?php echo $translations['contact']['location_value']; ?></span>
                        </p>
                        <p class="d-flex">
                            <button type="button" class="btn custom-btn custom-border-btn smoothscroll" style="width: 100%; background-color: rgb(23, 136, 168);" data-bs-toggle="modal" data-bs-target="#contactModal">
                                <h5 style="color: rgb(255, 255, 255);">
                                    <?php echo $translations['contact']['get_in_touch']; ?>
                                </h5>
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<!-- Modal for Contact Form -->
<div class="modal fade pt-5" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="contactModalLabel">
                    <?php echo $translations['contact']['modal_title']; ?>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="contactForm" action="send_email.php" method="post" class="custom-form contact-form" role="form">
                    <div class="row">
                        <div class="col-lg-6 col-md-6 col-12">
                            <div class="form-floating">
                                <input type="text" name="full-name" id="full-name" class="form-control"
                                    placeholder="<?php echo $translations['contact']['form']['full_name']; ?>" required="">
                                <label for="floatingInput">
                                    <?php echo $translations['contact']['form']['full_name']; ?>
                                </label>
                            </div>
                        </div>
                        <div class="col-lg-6 col-md-6 col-12">
                            <div class="form-floating">
                                <input type="email" name="email" id="email" pattern="[^ @]*@[^ @]*"
                                    class="form-control" placeholder="<?php echo $translations['contact']['form']['email']; ?>" required="">
                                <label for="floatingInput">
                                    <?php echo $translations['contact']['form']['email']; ?>
                                </label>
                            </div>
                        </div>
                        <div class="col-lg-12 col-12">
                            <div class="form-floating">
                                <textarea class="form-control" id="message" name="message"
                                    placeholder="<?php echo $translations['contact']['form']['message']; ?>"></textarea>
                                <label for="floatingTextarea">
                                    <?php echo $translations['contact']['form']['message']; ?>
                                </label>
                            </div>
                        </div>
                        <div class="col-lg-4 col-12 ms-auto">
                            <button type="submit" class="form-control">
                                <?php echo $translations['contact']['form']['submit']; ?>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include('footer.php'); ?>
