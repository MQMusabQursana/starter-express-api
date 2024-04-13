<!DOCTYPE html>
<html>
<head>
    <title>{$_title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/x-icon" href="{$_theme}/images/favicon.ico">
 <link rel="stylesheet" href="{$_theme}/styles/font-awesome/css/font-awesome.min.css">
 <script type="text/javascript" src="{$_theme}/scripts/qrcode.js"></script>
 

    <style>
 .ukuran {
 size:A4;
 }
 
 body,td,th {
 font-size: 12px;
 font-family: "Trebuchet MS", Verdana, sans-serif;
 }
 page[size="A4"] {
   background: white;
   width: 21cm;
   height: 29.7cm;
   display: block;
   margin: 0 auto;
   margin-bottom: 0.5cm;
   html, body {
	width: 210mm;
	height: 297mm;
   }
 }
 @media print {
        body {
            size: auto;
            margin: 0;
            box-shadow: 0;
        }
        page[size="A4"] {
            margin: 0;
            size: auto;
            box-shadow: 0;
        }
        .page-break { display: block; page-break-before: always; }
        .no-print, .no-print *
        {
            display: none !important;
        }
    }
	
.box {
	display: inline-block;
	height: 125px;
	width: 192px;
	background-repeat: no-repeat;
	background-position: center center;
	border-width: 1px;
	border-style: dashed;
	border-color: #999999;
	#border-left-width: 1px;
	#border-left-style: dashed;
	#border-left-color: #999999;
	margin-top:3px;
}

.kiri {
	float: right;
	#width: 110px;
	margin-top: 51px;
	margin-left: 66px;
	font-family: "Courier New", monospace;
	#font-size: 13px;
    font-weight: bold;
}
.kanan {

margin-top:38px;

}

.form1 {

	font-size:15px;
	margin-top: -4px;
	margin-left:-89px;
	
}

.form2 {

	font-size:14px;
	margin-top: 21px;
	margin-left:-88px;
	
}

.price {
	transform: rotate(-90deg);
	transform-origin: left top 0;
	font-size:22px;
	#font-family:tahoma;
	font-weight:normal;
	margin-left:-68px;
	margin-top:20px;
	text-align:center;
}

.qrcode img {
width:70px;
height:70px;
margin-left:23px;
}

    </style>
</head>
 
<body>
<page size="A4">
        <form method="post" action="{$_url}manage-voucher/print-voucher/" class="no-print">
        <table width="100%" border="0" cellspacing="0" cellpadding="1" class="btn btn-default btn-sm">
            <br><tr>
				 <td>ID &nbsp;&nbsp;&nbsp;<input style="text-align:center;width:130px" type="text" name="from_id" style="width:40px" value="{$from_id}">&nbsp;&nbsp;&nbsp; Limit &nbsp;&nbsp;&nbsp;<input style="text-align:center;width:130px" type="text" name="limit" style="width:40px" value="{$limit}"></td>
                <td style="width:220px;">Jenis Paket &nbsp;&nbsp;&nbsp;<select id="plan_id" name="planid" style="width:130px;height:21px;">
                <option value="0">-- Semua --</option>
                {foreach $plans as $plan}
                    <option value="{$plan['id']}" {if $plan['id']==$planid}selected{/if}>{$plan['name_plan']}</option>
                {/foreach}
                </select></td>

                <td><button type="submit">submit</button></td>
            </tr>
        </table><hr>
        	<center><button type="button" id="actprint" class="btn btn-default btn-sm no-print">{$_L['Click_Here_to_Print']}</button><br>
        </center>
        </form><br/>
        
		<div id="printable">
			{foreach $v as $vs}
			{$jml = $jml + 1}
				{if {$vs['secret']} eq {$vs['code']}}
					<div class="box" style="background-image:url({$_theme}/vouchers_one_input/{number_format($vs['price'],0,$_c['dec_point'],$_c['thousands_sep'])}.jpg);background-size: 192px 125px;">
				{else}
					<div class="box" style="background-image:url({$_theme}/vouchers_two_input/{number_format($vs['price'],0,$_c['dec_point'],$_c['thousands_sep'])}.jpg);background-size: 192px 125px;">	
				{/if}	
		
		<div class="kiri">
			{if {$vs['secret']} eq {$vs['code']}}
				<div class="form1">{$vs['name_plan']}</div> 
				<div class="form2">{$vs['secret']}</div>
			{else}
				<div class="form1">{$vs['code']}</div> 
				<div class="form2">{$vs['secret']}</div>
			{/if}		
			
		</div>
			<div class="kanan">
				<div class="qrcode" id="{$vs['code']}"></div>
				{if {$vs['secret']} eq {$vs['code']}}
					<script>
					var typeNumber = 0;
					var errorCorrectionLevel = 'L';
					var qr = qrcode(typeNumber, errorCorrectionLevel);
					qr.addData("http://{$vd['description']}/login?username={$vs['code']}&password={$vs['code']}");
					qr.make();
					document.getElementById("{$vs['code']}").innerHTML = qr.createImgTag();
					</script>
				{else}
					<script>
					var typeNumber = 0;
					var errorCorrectionLevel = 'L';
					var qr = qrcode(typeNumber, errorCorrectionLevel);
					qr.addData("http://{$vd['description']}/login?username={$vs['code']}&password={$vs['secret']}");
					qr.make();
					document.getElementById("{$vs['code']}").innerHTML = qr.createImgTag();
					</script>
				{/if}		
				</div>
					<div style="clear:both"></div>
			</div>
 
                {if $jml == $pagebreak}
                {$jml = 1000}
                <!-- pageBreak 
                <div class="page-break"><div class="no-print" style="background-color: #ffffff; color:#FFF;" align="center">-- pageBreak --<hr></div></div>-->
                {/if}
                {/foreach}
        </div>
</page>
<script src="{$_theme}/scripts/jquery-1.10.2.js"></script>
{if isset($xfooter)}
    {$xfooter}
{/if}
<script>
    jQuery(document).ready(function() {
        // initiate layout and plugins
        $("#actprint").click(function() {
            window.print();
            return false;
        });
    });
</script>
 
</body>
</html>