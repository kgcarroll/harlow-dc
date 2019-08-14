<!DOCTYPE html>
<html>
	<head>
	  <title><?php wp_title(''); ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <!--[if lte IE 8]>
    <link rel="stylesheet" type="text/css" href="<?php bloginfo('template_url'); ?>/css/ie.css">
    <script src="<?php bloginfo('template_url'); ?>/js/html5shiv.js"></script>
    <![endif]-->

    <link rel="icon" href="<?php bloginfo("template_url"); ?>/images/favicon.ico">
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-T344VFX');</script>
    <!-- End Google Tag Manager -->
    <script>var templateURL="<?php bloginfo('template_url'); ?>";</script>
	  <?php wp_head(); ?>
	</head>
	<body <?php body_class(); ?>>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T344VFX"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <div id="wrapper">
      <?php // print_signup(); ?>
      <?php // print_specials(); ?>
      <?php print_popouts(); ?>
      <header id="header">
        <?php print_trigger(); ?>
        <?php print_lease_link(); ?>
        <?php print_logo(); ?>
        <div id="header-components" class="">
          <?php print_phone_number(); ?>
          <?php print_schedule_tour(); ?>
          <?php print_chat(); ?>
        </div>
        <div class="nav-container">
          <div id="navigation-components">
            <nav id="navigation">
              <?php wp_nav_menu( array( 'container' => '', 'theme_location' => 'main_menu') ); ?>
              <div class="nav-pipe"></div>
            </nav>
            <div id="secondary-components">
              <nav id="secondary-navigation">
                <?php wp_nav_menu( array( 'container' => '', 'theme_location' => 'secondary_menu') ); ?>
              </nav>
              <?php print_address(); ?>
              <?php print_phone_number(); ?>
              <?php print_schedule_tour(); ?><?php print_social(); ?>
            </div>
          </div>
        </div>
      </header>
