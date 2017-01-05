<?php

// variables
$EmailFrom = $Email;
$EmailTo = "harrison@fortitudedevelopment.com";
$Subject = "Website Contact Form";
$First = Trim(stripslashes($_POST['First'])); 
$Last = Trim(stripslashes($_POST['Last'])); 
$Tel = Trim(stripslashes($_POST['Telephone'])); 
$Email = Trim(stripslashes($_POST['Email'])); 
$Message = Trim(stripslashes($_POST['Message'])); 

// validation
$validationOK=true;
if (!$validationOK) {
  print "<meta http-equiv=\"refresh\" content=\"0;URL=error.htm\">";
  exit;
}

// prepare email body text
$Body = "";
$Body .= "First Name: ";
$Body .= $First;
$Body .= "\n";
$Body .= "Last Name: ";
$Body .= $Last;
$Body .= "\n";
$Body .= "Telephone Number: ";
$Body .= $Telephone;
$Body .= "\n";
$Body .= "Email Address: ";
$Body .= $Email;
$Body .= "\n";
$Body .= "Message: ";
$Body .= $Message;
$Body .= "\n";

// send email 
$success = mail($EmailTo, $Subject, $Body, "From: <$EmailFrom>");

// redirect to success page 
if ($success){
  print "<meta http-equiv=\"refresh\" content=\"0;URL=contactthanks.php\">";
}
else{
  print "<meta http-equiv=\"refresh\" content=\"0;URL=error.htm\">";
}
?>