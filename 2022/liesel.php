<?php include('header.php'); ?>

<main>
    <section class="latest-podcast-section section-padding pb-0" id="section_2">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10 col-12">
                    <div class="section-title-wrap mb-5">
                        <h4 class="section-title"><?= $translations['details'] ?></h4>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 col-12">
                            <div class="custom-block-icon-wrap">
                                <div class="custom-block-image-wrap custom-block-image-detail-page">
                                    <img src="../images/2022/2022-f.jpg" class="custom-block-image img-fluid" alt="" style="height: 100%!important;">
                                </div>
                                <span class="badge-left badgem position-absolute"><?= $translations['available'] ?></span>
                            </div>
                        </div>
                        <div class="col-lg-6 col-12">
                            <div class="custom-block-info">
                                <div class="custom-block-top d-flex mb-1">
                                    <small class="me-4">
                                        <a href="#">
                                            <i class="bi-play"></i>
                                            40 x 60 cm
                                        </a>
                                    </small>
                                    <small>
                                        <i class="bi-clock-fill custom-icon"></i>
                                        2022
                                    </small>

                                    <small class="ms-auto"> 
                                        <span class="badge"><?= $translations['oil_painting'] ?></span>
                                    </small>
                                </div>
                                <h2 class="mb-2"><?= $translations['liesel_heading']; ?></h2>
                                <p>
                                    <?= $translations['liesel_description']?>
                                </p>

                                <div class="profile-block profile-detail-block d-flex flex-wrap align-items-center mt-5">
                                    <div class="row" style="display: contents;">
                                        <p> <strong>
                                                <?= $translations['price'] ?>: <span style="color: #49e98e; font-size: 20px">400<?= $translations['leva'] ?><span>
                                            </strong>
                                        </p>
                                    </div>
                                    <div class="d-flex mb-3 mb-lg-0 mb-md-0">
                                        <p><?= $translations['contact_for_orders'] ?></p>
                                    </div>

                                    <ul class="social-icon ms-lg-auto ms-md-auto">
                                        <li class="social-icon-item">
                                            <a href="mailto:dzhemile.ahmet@gmail.com" class="social-icon-link bi-envelope" target="_blank"></a>
                                        </li>
                                        <li class="social-icon-item">
                                            <a href="viber://chat?number=0895627511" class="social-icon-link bi-cursor" target="_blank"></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="related-podcast-section section-padding">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-12">
                    <div class="section-title-wrap mb-5">
                        <h4 class="section-title"><?= $translations['you_may_also_like'] ?></h4>
                    </div>
                </div>
                <?php include('related.php'); ?>
            </div>
        </div>
    </section>
</main>

<?php include('footer.php'); ?>
