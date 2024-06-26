<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<title>{$_title}</title>
	<link rel="shortcut icon" href="{$_theme}/images/logo.png" type="image/x-icon" />
	
	<!-- Icons -->
	<link rel="stylesheet" href="{$_theme}/fonts/ionicons/css/ionicons.min.css">
	<link rel="stylesheet" href="{$_theme}/fonts/font-awesome/css/font-awesome.min.css">

	<!-- Plugins -->
	<link rel="stylesheet" href="{$_theme}/styles/plugins/waves.css">
	<link rel="stylesheet" href="{$_theme}/styles/plugins/perfect-scrollbar.css">
	<link rel="stylesheet" href="{$_theme}/styles/plugins/select2.css">
	<link rel="stylesheet" href="{$_theme}/styles/plugins/bootstrap-colorpicker.css">
	<link rel="stylesheet" href="{$_theme}/styles/plugins/bootstrap-slider.css">
	<link rel="stylesheet" href="{$_theme}/styles/plugins/bootstrap-datepicker.css">
	<link rel="stylesheet" href="{$_theme}/styles/plugins/summernote.css">
	<link rel="stylesheet" href="{$_theme}/styles/font-awesome/css/font-awesome.min.css">

	<!-- Css/Less Stylesheets -->
	<link rel="stylesheet" href="{$_theme}/styles/bootstrap.min.css">
	<link rel="stylesheet" href="{$_theme}/styles/main.min.css">
	
	<link href='http://fonts.googleapis.com/css?family=Roboto:400,500,700,300' rel='stylesheet' type='text/css'>
	
	<!-- Match Media polyfill for IE9 -->
	<!--[if IE 9]> <script src="{$_theme}/scripts/ie/matchMedia.js"></script>  <![endif]--> 
{if isset($xheader)}
	{$xheader}
{/if}

</head>

<body id="app" class="app off-canvas">

	<header class="site-head" id="site-head">
		<ul class="list-unstyled left-elems">
			<li>
				<a href="#" class="nav-trigger ion ion-drag"></a>
			</li>
			{if $_admin['user_type'] eq 'Admin' || $_admin['user_type'] eq 'Sales'}
			<li>
				<div class="form-search hidden-xs">
					<form id="site-search" method="post" action="{$_url}customers/list/">
						<input type="search" class="form-control" name="username" placeholder="{$_L['Search_Contact']}">
						<button type="submit" class="ion ion-ios-search-strong"></button>
					</form>
				</div>
			</li>
			{/if}
			<li>
				<div class="site-logo visible-xs">
					<a href="{$_url}dashboard" class="text-uppercase h3">
						<span class="text">{$_c['CompanyName']}</span>
					</a>
				</div>
			</li>


		</ul>
		<ul class="list-unstyled right-elems">
			<li class="logout hidden-xs">
				<a href="{$_url}logout"><i class="ion ion-power"></i> {$_L['Logout']}</a></a>
			</li>
		</ul>
	</header>

	<div class="main-container clearfix">
		<aside class="nav-wrap" id="site-nav" data-perfect-scrollbar>
			<div class="nav-head">
				<a href="{$_url}dashboard" class="site-logo text-uppercase">
					<i class="ion ion-wifi"></i>
					<span style="font-size:13px;margin-top:4px;" class="text">{$_c['CompanyName']}</span>
				</a>
			</div>

			<nav class="site-nav clearfix" role="navigation">
			{if $_admin['user_type'] eq 'Admin' || $_admin['user_type'] eq 'Sales'}
				<div class="profile clearfix mb15">
					<img src="system/uploads/admin.png" alt="admin"> 
					<div class="group">
						<div class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">{$_admin['fullname']}<span class="caret"></a></span>
							<ul class="dropdown-menu">
								<li><a href="{$_url}settings/users-edit/{$_admin['id']}"><i class="ion ion-person"></i> {$_L['My_Account']}<div class="ripple-wrapper"></div></a></li>
								<li><a href="{$_url}settings/change-password"><i class="ion ion-settings"></i> {$_L['Change_Password']}</a></li>
								<li><a href="{$_url}logout"><i class="ion ion-power"></i> {$_L['Logout']}</a></li>
							</ul>
						</div>
						<small class="desig">{if $_admin['user_type'] eq 'Admin'} {$_L['Administrator']} {else} {$_L['Sales']} {/if}</small>
					</div>
				</div>
			{else}
				<div class="profile clearfix mb15">
					<img src="system/uploads/user.jpg" alt="admin">
					<div class="group">
						<div class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">{$_user['fullname']}<span class="caret"></span></a>
							<ul class="dropdown-menu">
								<li><a href="{$_url}accounts/profile"><i class="ion ion-person"></i> {$_L['My_Account']}<div class="ripple-wrapper"></div></a></li>
								<li><a href="{$_url}accounts/change-password"><i class="ion ion-settings"></i> {$_L['Change_Password']}</a></li>
								<li><a href="{$_url}logout"><i class="ion ion-power"></i> {$_L['Logout']}</a></li>
							</ul>
						</div>
						<small class="desig">{$_L['Member']}</small>
					</div>
				</div>
			{/if}
				
				<ul id="leftMenu" class="list-unstyled clearfix nav-list mb15">
					<li {if $_system_menu eq 'dashboard'}class="active"{/if}>
						<a href="{$_url}dashboard">
							<i class="ion ion-monitor"></i>
							<span class="text">{$_L['Dashboard']}</span>
						</a>
					</li>

				{if $_admin['user_type'] eq 'Admin' || $_admin['user_type'] eq 'Sales'}
					<li {if $_system_menu eq 'customers'}class="open"{/if}>
						<a href="#" onClick="toggleDropdownMobile(this)">
							<i class="ion ion-android-contacts"></i>
							<span class="text">{$_L['Customers']}</span>
							<i class="arrow ion-chevron-left"></i>
						</a>
						<ul class="inner-drop list-unstyled">
							<li {if $_system_menu eq 'customers'}class="active"{/if}><a href="{$_url}customers/add">{$_L['Add_Contact']}</a></li>
							<li {if $_system_menu eq 'customers'}class="active"{/if}><a href="{$_url}customers/list">{$_L['List_Contact']}</a></li>
						</ul>
					</li>
					<li {if $_system_menu eq 'prepaid'}class="open"{/if}>
						<a href="#" onClick="toggleDropdownMobile(this)">
							<i class="ion ion-card"></i>
							<span class="text">{$_L['Prepaid']}</span>
							<i class="arrow ion-chevron-left"></i>
						</a>
						<ul class="inner-drop list-unstyled">
							<li {if $_system_menu eq 'prepaid'}class="active"{/if}><a href="{$_url}prepaid/list">{$_L['Prepaid_User']}</a></li>
							<li {if $_system_menu eq 'prepaid'}class="active"{/if}><a href="{$_url}prepaid/voucher">{$_L['Prepaid_Vouchers']}</a></li>
							<li {if $_system_menu eq 'prepaid'}class="active"{/if}><a href="{$_url}prepaid/refill">{$_L['Refill_Account']}</a></li>
							<li {if $_system_menu eq 'prepaid'}class="active"{/if}><a href="{$_url}prepaid/recharge">{$_L['Recharge_Account']}</a></li>
						</ul>
					</li>
					<li {if $_system_menu eq 'services'}class="open"{/if}>
						<a href="#" onClick="toggleDropdownMobile(this)">
							<i class="ion ion-cube"></i>
							<span class="text">{$_L['Services']}</span>
							<i class="arrow ion-chevron-left"></i>
						</a>
						<ul class="inner-drop list-unstyled">
							<li {if $_system_menu eq 'services'}class="active"{/if}><a href="{$_url}services/hotspot">{$_L['Hotspot_Plans']}</a></li>
							<li {if $_system_menu eq 'services'}class="active"{/if}><a href="{$_url}services/pppoe">{$_L['PPPOE_Plans']}</a></li>
							<li {if $_system_menu eq 'services'}class="active"{/if}><a href="{$_url}bandwidth/list">{$_L['Bandwidth_Plans']}</a></li>
						</ul>
					</li>

				{else}
					<li {if $_system_menu eq 'voucher'}class="open"{/if}>
						<a href="#" onClick="toggleDropdownMobile(this)">
							<i class="ion ion-card"></i>
							<span class="text">{$_L['Voucher']}</span>
							<i class="arrow ion-chevron-left"></i>
						</a>
						<ul class="inner-drop list-unstyled">
							<li {if $_system_menu eq 'voucher'}class="active"{/if}><a href="{$_url}voucher/activation">{$_L['Voucher_Activation']}</a></li>
							<li {if $_system_menu eq 'voucher'}class="active"{/if}><a href="{$_url}voucher/list-activated">{$_L['List_Activated_Voucher']}</a></li>
						</ul>
					</li>
					<li {if $_system_menu eq 'order'}class="active"{/if}>
						<a href="{$_url}order">
							<i class="ion ion-ios-cart"></i>
							<span class="text">{$_L['Order_Voucher']}</span>
						</a>
					</li>
					<li {if $_system_menu eq 'accounts'}class="open"{/if}>
						<a href="#" onClick="toggleDropdownMobile(this)">
							<i class="ion ion-gear-a"></i>
							<span class="text">{$_L['My_Account']}</span>
							<i class="arrow ion-chevron-left"></i>
						</a>
						<ul class="inner-drop list-unstyled">
							<li {if $_system_menu eq 'accounts'}class="active"{/if}><a href="{$_url}accounts/profile">{$_L['My_Profile']}</a></li>
							<li {if $_system_menu eq 'accounts'}class="active"{/if}><a href="{$_url}accounts/change-password">{$_L['Change_Password']}</a></li>
							<li>&nbsp;</li>
						</ul>
					</li>
				{/if}
				{if $_admin['user_type'] eq 'Admin'}


					<li {if $_system_menu eq 'settings'}class="open"{/if}>
						<a href="#" onClick="toggleDropdownMobile(this)">
							<i class="ion ion-gear-a"></i>
							<span class="text">{$_L['Settings']}</span>
							<i class="arrow ion-chevron-left"></i>
						</a>
						<ul class="inner-drop list-unstyled">
							<li {if $_system_menu eq 'settings'}class="active"{/if}><a href="{$_url}settings/app">{$_L['General_Settings']}</a></li>
							<li {if $_system_menu eq 'settings'}class="active"{/if}><a href="{$_url}settings/localisation">{$_L['Localisation']}</a></li>
							<li {if $_system_menu eq 'settings'}class="active"{/if}><a href="{$_url}settings/users">{$_L['Administrator_Users']}</a></li>
							<li {if $_system_menu eq 'network'}class="active"{/if}><a href="{$_url}routers/list">{$_L['Routers']}</a></li>
							<li {if $_system_menu eq 'network'}class="active"{/if}><a href="{$_url}pool/list">{$_L['Pool']}</a></li>
							<li {if $_system_menu eq 'settings'}class="active"{/if}><a href="{$_url}settings/dbstatus">{$_L['Backup_Restore']}</a></li>
							<li>&nbsp;</li>
						</ul>
					</li>

				{/if}
				</ul>
				
			</nav>

			<footer class="nav-foot">
				<p>{date('Y')} &copy; <span>{$_c['CompanyName']}</span></p>
			</footer>
		</aside>
		<script>
		// i find bug that dropdown menu in mobile browser doesnt active, so i force to show all
		var mobile = false;
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			mobile = true;
		}
		function toggleDropdownMobile(node){
			if(mobile){
				$(node).parent('li').addClass('open');
			}
		}
		</script> 
		<div class="content-container" id="content">
			<div class="page {if $_system_menu eq 'dashboard'}page-dashboard{/if}{if $_system_menu eq 'reports'}page-invoice{/if}">

			{if isset($notify)}
				{$notify}
			{/if}