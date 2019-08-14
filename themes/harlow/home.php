<?php
/*
* Template Name: Blog
*
*/
get_header(); ?>
<div id="blog" class="container" role="main">

    <?php print_blog_header_content(); ?>
    
    <div class="blog-wrapper">
        <div class="left">
            <?php if (have_posts()) : ?>
                <?php while (have_posts()) : the_post(); ?>
                    <div class="post">
                        <div class="post-content">
                            <?php if ( has_post_thumbnail() ) { ?>
                            <div class="image">
                                <?php the_post_thumbnail('blog'); ?>
                            </div>
                            <?php } ?>
                            <div class="content">
                                <div class="title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></div>
                                <div class="date"><?php echo get_the_date('F j, Y');; ?></div>
                                <div class="link"><a href="<?php the_permalink(); ?>">Read More <span class="icon-arrow"></span></a></div>
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