<?php 

$articles = $translations['articles2023'];

shuffle($articles);
$relatedArticles = array_slice($articles, 0, 3);
?>

<div class="row">
    <?php foreach ($relatedArticles as $article): ?>
        <div class="col-lg-4 col-12 mb-4 mb-lg-0">
            <div class="custom-block custom-block-full">
                <div class="custom-block-image-wrap">
                    <a href="<?php echo $article['link']; ?>">
                        <img src="<?php echo $article['image']; ?>" class="custom-block-image img-fluid" alt="">
                        <?php if (!empty($article['sold'])): ?>
                            <span class="badge-soldmin badgem position-absolute"><strong><?php echo $translations['sold']; ?></strong></span>
                        <?php endif; ?>
                    </a>
                </div>
                <div class="custom-block-info">
                    <h5 class="mb-2">
                        <a href="<?php echo $article['link']; ?>">
                            <?php echo $article['title']; ?>
                        </a>
                    </h5>
                    <div class="profile-block d-flex">
                        <p><?php echo $article['medium']; ?> <strong><?php echo $article['size']; ?></strong></p>
                    </div>
                    <p class="mb-0"><?php echo $article['description']; ?></p>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>
