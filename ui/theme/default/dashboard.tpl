{include file="sections/header.tpl"}

{if ($_admin['user_type']) eq 'Admin' || ($_admin['user_type']) eq 'Sales'}
					<div class="row hidden">
						<div class="col-md-12">
							<div class="dash-head clearfix mt15 mb20">
								<div class="left">
									<h4 class="mb5 text-light">Dashboard</h4>
									<p class="small"></p>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
					
						<div style="width:100%;" class="col-md-7">
						
							<div class="panel panel-default mb20 panel-hovered project-stats table-responsive">
								<div class="panel-heading">{$_L['Prepaid_Vouchers']}</div>
														<div class="panel-body">								

									<a style="width:140px;margin-top:4px;" class="btn btn-info waves-effect" href="{$_url}prepaid/delete-old-voucher" title="Delete Old Voucher"><i class="ion ion-android-delete"> </i> Delete All</a>
									<a style="width:140px;margin-top:4px;" class="btn btn-primary waves-effect" href="{$_url}prepaid/add-voucher" title="Add New Voucher"><i class="ion ion-android-add"> </i> Generate</a>
									<a style="width:140px;margin-top:4px;" class="btn btn-warning waves-effect" href="{$_url}prepaid/print-voucher" target="_blank" title="Print Voucher"><i class="ion ion-android-print"> </i> Print</a>
									
								<hr/>
								
									<form class="btn btn-info waves-effect" style="width:100%;background:transparent;border:none;box-shadow:none;padding:2px 2px 2px 2px;margin-top:2px;" id="site-search" method="post" action="{$_url}prepaid/voucher/">
											<div class="input-group">
												<div class="input-group-addon">
													<span class="fa fa-search"></span>
												</div>
												<input type="text" name="code" class="form-control" placeholder="{$_L['Search_by_Code']}...">
												<div class="input-group-btn">
													<button class="btn btn-success">{$_L['Search']}</button>
												</div>
											</div>
									</form>
									
								<hr>
									<table class="table">
										<thead>
											<tr>
									<th>ID</th>
									<th>{$_L['Type']}</th>																									
									<th>{$_L['Routers']}</th>
									<th>{$_L['Plan_Name']}</th>
									<th>{$_L['Code_Voucher']}</th>
									<th>{$_L['Secret']}</th>
									<th>{$_L['Status_Voucher']}</th>
									<th>{$_L['Manage']}</th>
											</tr>
										</thead>
										<tbody>
										{$no = 1}
							{foreach $code_stock as $code_stocks}
								<tr>
									<td>{$code_stocks['id']}</td> 												
									<td>{$code_stocks['type']}</td>
									<td>{$code_stocks['routers']}</td>
									<td>{$code_stocks['name_plan']}</td>
									<td>{$code_stocks['code']}</td>
									<td>{$code_stocks['secret']}</td>
									<td align="center">{if $code_stocks['status'] eq '0'} <label class="btn-tag btn-tag-success">New Voucher</label> {else} <label class="btn-tag btn-tag-danger">Old Voucher</label> {/if}</td>									
									<td>
										<a href="{$_url}prepaid/voucher-delete/{$code_stocks['id']}" id="{$code_stocks['id']}" class="btn btn-danger btn-sm cdelete">{$_L['Delete']}</a>
									</td>
								</tr>
							{/foreach}
									</table>
								</div>
							</div>
						</div>
						
						
						
					</div>
{else}
					<div class="row">
						<div class="col-md-12">
							<div class="dash-head clearfix mt15 mb20">
								<div class="left">
									<h4 class="mb5 text-light">{$_L['Welcome']}, {$_user['fullname']}</h4>
									<p>{$_L['Welcome_Text_User']}</p>
									<ul>
										<li> {$_L['Account_Information']}</li>
										<li> <a href="{$_url}voucher/activation">{$_L['Voucher_Activation']}</a></li>
										<li> <a href="{$_url}voucher/list-activated">{$_L['List_Activated_Voucher']}</a></li>
										<li> <a href="{$_url}accounts/change-password">{$_L['Change_Password']}</a></li>
										<li> {$_L['Order_Voucher']}</li>
										<li> {$_L['Private_Message']}</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12">
							<div class="panel mb20 panel-primary panel-hovered">
								<div class="panel-heading">{$_L['Account_Information']}</div>
								<div class="panel-body">
									<div class="row">
			            				<div class="col-sm-3">
					               			<p class="small text-success text-uppercase text-normal">{$_L['Username']}</p>
					               			<p class="small mb15">{$_bill['username']}</p>
					                	</div>
			            				<div class="col-sm-3">
					               			<p class="small text-primary text-uppercase text-normal">{$_L['Plan_Name']}</p>
					               			<p class="small mb15">{$_bill['namebp']}</p>
					                	</div>
					                	<div class="col-sm-3">
					                		<p class="small text-info text-uppercase text-normal">{$_L['Created_On']}</p>
					               			<p class="small mb15">{date($_c['date_format'], strtotime($_bill['recharged_on']))} {$_bill['time']}</p>
					                	</div>
					                	<div class="col-sm-3">
					                		<p class="small text-danger text-uppercase text-normal">{$_L['Expires_On']}</p>
					               			<p class="small mb15">{date($_c['date_format'], strtotime($_bill['expiration']))} {$_bill['time']}</p>
					                	</div>
									</div>
									
								</div>
							</div>
						</div>
					</div>
{/if}

{include file="sections/footer.tpl"}
