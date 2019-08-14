<?php
/*
* Template Name: Privacy Policy
*
*/
get_header(); ?>
  <div id="privacy" class="container" role="main">

		<div class="content">
				<?php if (have_posts()) : ?>
		      <?php while (have_posts()) : the_post(); ?>
              <h1 class="headline"><?php wp_title(''); ?></h1>
              <div class="image">
                  <?php
                  if ( has_post_thumbnail() ) {
                      the_post_thumbnail();
                  } ?>
              </div>
              <?php the_content(); ?>          
		      <?php endwhile;?>
		  <?php endif;?>
		</div>
  </div>
<?php get_footer(); ?>