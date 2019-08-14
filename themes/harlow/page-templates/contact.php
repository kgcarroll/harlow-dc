<?php 
/*
* Template Name: Contact
*
*/
get_header(); ?>
  <div id="contact" class="container" role="main">
		<?php print_header_image(); ?>
		<?php print_header_content(); ?>
		<div id="contact-info">
			<div class="contact-content">
	      <?php print_plain_address(); ?>
	      <?php print_directions(); ?>
	      <?php print_phone_number(); ?>
	      <?php print_office_hours(); ?>
	      <?php print_schedule_tour(); ?><?php print_social(); ?>
			</div>
			<div class="contact-form">
				<?php echo FrmFormsController::get_form_shortcode( array( 'id' => 2, 'title' => false, 'description' => false ) ); ?>
			</div>
		</div>
  </div>
<?php get_footer(); ?>