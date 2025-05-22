<?php include('header.php'); ?>
<main>
    <header class="site-header d-flex flex-column justify-content-center align-items-center"
        id="header-solid">
    </header>
    <section class="about-section section-padding" id="section_2" style="padding-top: 50px!important;">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-12 mx-auto">
                    <div class="pb-5 mb-5">
                        <div class="section-title-wrap mb-4">
                            <h4 class="section-title"><?php echo $translations['about']['header']; ?></h4>
                        </div>
                        <div class="row">
                            <div class="col" style="height: 100%!important;">
                                <p style="font-size: 22px;">
                                    <?php echo $translations['about']['intro']['paragraph1']; ?>
                                </p>
                                <p style="font-size: 22px;">
                                    <?php echo $translations['about']['intro']['paragraph2']; ?>
                                </p>
                                <p style="font-size: 22px;">
                                    <?php echo $translations['about']['intro']['paragraph3']; ?>
                                </p>
                            </div>
                            <div class="col-7">
                                <img src="images/about-me.png" class="about-image-main img-fluid" alt=""
                                    style="height: 100%!important;">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-12 col-12">
                    <div class="section-title-wrap mb-5">
                        <h4 class="section-title"><?php echo $translations['about']['studio_title']; ?></h4>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-3 col-md-12 mb-4 mb-lg-0">
                        <img
                            src="images/about/4.jpg"
                            class="w-100 shadow-1-strong rounded mb-4 img-ab"
                            alt="Boat on Calm Water" />

                        <img
                            src="images/about/1.jpg"
                            class="w-100 shadow-1-strong rounded mb-4 img-ab"
                            alt="Wintry Mountain Landscape" />
                    </div>

                    <div class="col-lg-3 mb-4 mb-lg-0">
                        <img
                            src="images/about/2.jpg"
                            class="w-100 shadow-1-strong rounded mb-4 img-ab"
                            alt="Mountains in the Clouds" />

                        <img
                            src="images/about/3.jpg"
                            class="w-100 shadow-1-strong rounded mb-4 img-ab"
                            alt="Boat on Calm Water" />
                    </div>

                    <div class="col-lg-3 mb-4 mb-lg-0">
                        <img
                            src="images/about/8.jpg"
                            class="w-100 shadow-1-strong rounded mb-4 img-ab"
                            alt="Waves at Sea" />

                        <img
                            src="images/about/7.jpg"
                            class="w-100 shadow-1-strong rounded mb-4 img-ab"
                            alt="Yosemite National Park" />
                    </div>
                    <div class="col-lg-3 mb-4 mb-lg-0">
                        <img
                            src="images/about/6.jpg"
                            class="w-100 shadow-1-strong rounded mb-4 img-ab"
                            alt="Waves at Sea" />
                        <img
                            src="images/about/9.jpg"
                            class="w-100 shadow-1-strong rounded mb-4 img-ab"
                            alt="Waves at Sea" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
<?php include('footer.php'); ?>
