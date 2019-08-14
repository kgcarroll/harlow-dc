<?php get_header(); ?>
    <div id="single-post" class="container">
        <div class="back-link"><a href="/blog"><span class="icon-arrow"></span>Back to blog</a></div>
        <div class="blog-wrapper">
            <div class="left">
                <?php if (have_posts()) : ?>
                    <?php while (have_posts()) : the_post(); ?>
                        <div class="post">
                            <div class="single-post-content">
                                <?php if ( has_post_thumbnail() ) { ?>
                                    <div class="image">
                                        <?php the_post_thumbnail(); ?>
                                    </div>
                                <?php } ?>
                                <h1 class="post-title"><?php the_title(); ?></h1>
                                <div class="date"><?php echo get_the_date('F j, Y'); ?></div>
                                <div class="content editor">
                                    <?php the_content(); ?>
                                </div>
                            </div>
                        </div>
                    <?php endwhile;?>
                <?php endif;?>
            </div>
            <div class="right">
                <?php get_sidebar(); ?>
            </div>
        </div>
    </div>
<?php get_footer(); ?>
