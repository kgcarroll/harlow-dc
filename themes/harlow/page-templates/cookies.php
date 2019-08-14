<?php
/*
* Template Name: Cookies
*
*/
get_header(); ?>
    <div id="cookies" class="container cookies-content" role="main">
        <div class="content">
            <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
                <h1 class="headline"><?php the_title(); ?></h1>          
                <?php endwhile; else : ?>
                <p><?php esc_html_e( 'Sorry, no posts matched your criteria.' ); ?></p>
            <?php endif; ?>
            <div class="copy">
                <?php the_content(); ?>
            </div>
        </div>
    </div>
<?php get_footer(); ?>