<?php include('header.php'); ?>
<main>
    <header class="site-header d-flex flex-column justify-content-center align-items-center">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-12 text-center">
                    <h2 class="mb-0"><?php echo $translations['gallery']['header']; ?></h2>
                </div>
            </div>
        </div>
    </header>
    <section class="trending-podcast-section section-padding pt-0">
        <div class="container">
            <div class="row mb-5">
                <?php foreach ($translations['gallery']['paintings'] as $painting): ?>
                    <div class="col-lg-4 col-12 mb-4 mb-lg-0">
                        <div class="custom-block custom-block-full">
                            <div class="custom-block-image-wrap">
                                <a href="<?php echo $painting['link']; ?>">
                                    <img src="<?php echo $painting['image']; ?>" class="custom-block-image img-fluid" alt="<?php echo $painting['title']; ?>">
                                    <?php if (isset($painting['sold'])): ?>
                                        <span class="badge-soldmin badgem position-absolute"><strong><?php echo $painting['sold']; ?></strong></span>
                                    <?php endif; ?>
                                </a>
                            </div>
                            <div class="custom-block-info">
                                <h5 class="mb-2">
                                    <a href="<?php echo $painting['link']; ?>">
                                        <?php echo $painting['title']; ?>
                                    </a>
                                </h5>
                                <div class="profile-block d-flex">
                                    <p><?php echo $translations['oil_painting']; ?>
                                        <strong><?php echo $painting['dimensions']; ?></strong>
                                    </p>
                                </div>
                                <p class="mb-0"><?php echo $painting['description']; ?></p>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
</main>
<?php include('footer.php'); ?>
