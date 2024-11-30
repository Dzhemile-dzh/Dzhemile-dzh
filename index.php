<?php include('header.php'); ?>
<main>
    <section class="hero-section">
        <div class="container">
            <div class="text-center mb-5 pb-2">
                <h1 class="text-white"><?php echo $translations['hero_title']; ?></h1>
            </div>
            <div class="owl-carousel owl-theme">
                <?php
                $profiles = [
                    ['img' => '1.jpg', 'name' => 'Aurora', 'badges' => ['portrait', 'surrealism'], 'links' => ['2024/aurora.php', 'https://www.instagram.com/doarti42/']],
                    ['img' => '2.jpg', 'name' => 'Alice', 'badges' => ['present & past'], 'links' => ['2024/alice.php', 'https://www.instagram.com/doarti42/']],
                    ['img' => '3.jpg', 'name' => 'Hera', 'badges' => ['portraits', 'mother'], 'links' => ['2024/hera.php', 'https://www.instagram.com/doarti42/']],
                    ['img' => '4.jpg', 'name' => 'Amaya Rei', 'badges' => ['warrior'], 'links' => ['2024/amaya-rei.php', 'https://www.instagram.com/doarti42/']],
                    ['img' => '5.jpg', 'name' => 'Nora', 'badges' => ['warrior'], 'links' => ['2023/nora.php', 'https://www.instagram.com/doarti42/']],
                    ['img' => '6.jpg', 'name' => 'Gaia', 'badges' => ['woman body'], 'links' => ['2024/gaia.php', 'https://www.instagram.com/doarti42/']]
                ];
                foreach ($profiles as $profile) { ?>
                    <div class="owl-carousel-info-wrap item">
                        <img src="images/profile/<?php echo $profile['img']; ?>" class="owl-carousel-image img-fluid" alt="">
                        <div class="owl-carousel-info">
                            <h4 class="mb-2">
                            <?php echo $translations['names'][$profile['name']] ?? $profile['name']; ?>
                            <?php if (in_array($profile['name'], ['Aurora', 'Alice', 'Nora'])) { ?>
                                    <img src="images/verified.png" class="owl-carousel-verified-image img-fluid" alt="">
                                <?php } ?>
                            </h4>
                            <?php foreach ($profile['badges'] as $badge) { ?>
                                <span class="badge"><?php echo $translations['badges'][$badge] ?? $badge; ?></span>
                            <?php } ?>
                        </div>
                        <div class="social-share">
                            <ul class="social-icon">
                                <li class="social-icon-item">
                                    <a href="<?php echo $profile['links'][1]; ?>" class="social-icon-link bi-instagram" target="_blank"></a>
                                </li>
                                <li class="social-icon-item">
                                    <a href="<?php echo $profile['links'][0]; ?>" class="social-icon-link bi-whatsapp" target="_blank"></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                <?php } ?>
            </div>
        </div>
    </section>

    <section class="latest-podcast-section section-padding pb-0" id="section_2">
        <div class="container">
            <h4 class="section-title"><?php echo $translations['latest_paintings']; ?></h4>
            <div class="row justify-content-center mt-5">
                <?php
                $paintings = [
                    ["name" => "Aurora", "image" => "images/2024/2024-b.png", "link" => "2024/aurora.php", "year" => 2024, "size" => "60 x 80 cm", "type" => "portrait", "desc" => $translations['painting_details']['aurora_desc']],
                    ["name" => "Alice", "image" => "images/2024/2024-h.png", "link" => "2024/alice.php", "year" => 2024, "size" => "60 x 80 cm", "type" => "portrait", "desc" => $translations['painting_details']['alice_desc']]
                ];

                foreach ($paintings as $painting): ?>
                    <div class="col-lg-6 col-12 mb-4">
                        <div class="custom-block d-flex">
                            <div class="row">
                                <div class="col-5" id="index-image">
                                    <a href="<?php echo $painting['link']; ?>">
                                        <img src="<?php echo $painting['image']; ?>" class="img-fluid" alt="" id="section-painting-img">
                                    </a>
                                </div>
                                <div class="col-7 custom-block-info" id="index-content">
                                    <div class="custom-block-top d-flex mb-1">
                                        <small class="me-4">
                                            <i class="bi-clock-fill custom-icon"></i> <?php echo $painting['year']; ?>
                                        </small>
                                        <span class="badge"><?php echo $painting['size']; ?></span>
                                    </div>
                                    <h5 class="mb-2">
                                        <a href="<?php echo $painting['link']; ?>">
                                        <?php echo $translations['names'][$painting['name']] ?? $painting['name']; ?>
                                        </a>
                                    </h5>
                                    <div class="profile-block d-flex">
                                        <p>
                                            <small class="me-4">
                                                <?php echo $translations['oil_painting']; ?>
                                            </small>
                                            <img src="images/verified.png" class="verified-image img-fluid" alt="">
                                            <strong><?php echo $translations['badges']['portraits']; ?></strong>
                                        </p>
                                    </div>
                                    <p><?php echo $painting['desc']; ?></p>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <section id="section_3">
        <div class="row">
            <div class="col-lg-12">
                <video autoplay loop muted class="video-index" style="width: 100%; height: 800px; object-fit: cover; -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent); mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent); -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-size: 100%; mask-size: 100%;">
                    <source src="images/20230917_152650_1_1.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    </section>

    <section>
        <div class="container">
            <h4 class="section-title"><?php echo $translations['my_favorites']; ?></h4>
            <div class="row mt-5">
                <?php
                $favorites = [
                    ['img' => '1.jpg', 'name' => $translations['favorites']['future_keeper_title'], 'link' => '2024/futures-keeper.php', 'likes' => 17, 'downloads' => 12, "size" => "60 x 80 cm", "desc" => $translations['favorites']['future_keeper_desc']],
                    ['img' => '2.jpg', 'name' => $translations['favorites']['twins_pact_title'], 'link' => '2024/twins.php', 'likes' => 34, 'downloads' => 45, "size" => "60 x 80 cm", "desc" => $translations['favorites']['twins_pact_desc']],
                    ['img' => '3.jpg', 'name' => $translations['favorites']['oscar_dichotomy_title'], 'link' => '2024/oscars-dichotomy.php', 'likes' => 25, 'downloads' => 3, "size" => "60 x 80 cm", "desc" => $translations['favorites']['oscar_dichotomy_desc']]
                ];
                foreach ($favorites as $fav) { ?>
                    <div class="col-lg-4 col-12 mb-4">
                        <div class="custom-block custom-block-full">
                            <a href="<?php echo $fav['link']; ?>" style="width:100%">
                                <img src="images/homepage/<?php echo $fav['img']; ?>" class="custom-block-image img-fluid" alt="">
                            </a>
                            <h5 class="mb-2">
                                <a href="<?php echo $fav['link']; ?>"><?php echo $fav['name']; ?></a>
                            </h5>
                            <div class="profile-block d-flex">
                            <p>                                            
                                <?php echo $translations['oil_painting']; ?>
                                <strong><?php echo $fav['size']; ?></strong>
                            </p>
                            </div>
                            <p class="mb-0"><?php echo $fav['desc']; ?></p>
                            <div class="custom-block-bottom d-flex justify-content-between mt-3">
                                <a href="#" class="bi-heart me-1">
                                    <span><?php echo $fav['likes']; ?></span>
                                </a>
                                <a href="images/homepage/<?php echo $fav['img']; ?>" class="bi-download" download>
                                    <span><?php echo $fav['downloads']; ?></span>
                                </a>
                            </div>
                        </div>
                    </div>
                <?php } ?>
            </div>
        </div>
    </section>
</main>

<?php include('footer.php'); ?>
