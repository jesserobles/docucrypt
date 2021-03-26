<?php

// The version number (9_5_0) should match version of the Chilkat extension used, omitting the micro-version number.
// For example, if using Chilkat v9.5.0.48, then include as shown here:
include("chilkat_9_5_0.php");

// The Chilkat API can be unlocked for a fully-functional 30-day trial by passing any
// string to the UnlockBundle method.  A program can unlock once at the start. Once unlocked,
// all subsequently instantiated objects are created in the unlocked state. 
// 
// After licensing Chilkat, replace the "Anything for 30-day trial" with the purchased unlock code.
// To verify the purchased unlock code was recognized, examine the contents of the LastErrorText
// property after unlocking.  For example:
$glob = new CkGlobal();
$success = $glob->UnlockBundle('Anything for 30-day trial');
if ($success != true) {
    print $glob->lastErrorText() . "\n";
    exit;
}

$status = $glob->get_UnlockStatus();
if ($status == 2) {
    print 'Unlocked using purchased unlock code.' . "\n";
}
else {
    print 'Unlocked in trial mode.' . "\n";
}

// The LastErrorText can be examined in the success case to see if it was unlocked in
// trial more, or with a purchased unlock code.
print $glob->lastErrorText() . "\n";

?>
