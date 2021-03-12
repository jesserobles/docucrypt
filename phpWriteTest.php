<?php
require_once(__DIR__ .'/vendor/autoload.php');
$client = new Google_Client();
$client->setApplicationName('Docucrypt Test Write');  //this name doesn't matter
$client->setScopes([Google_Service_Docs::DOCUMENTS]); //Uses Google docuements
$client->setAccessType('offline');
$client->setAuthConfig(__DIR__ .'/DocuCrypt-credentials.json'); //json api credentials
$service = new Google_Service_Docs($client);

$documentId = '1i9ob3h1sCGkDfbzo8npQel7MwExWEthSusN06sZadWY';  //set your document ID Docucrypt will need to pass in this variable
$doc = $service->documents->get($documentId);

// Collect all pieces of text (see https://developers.google.com/docs/api/concepts/structure to understand the structure)
$allText = [];
foreach ($doc->body->content as $structuralElement) {
    if ($structuralElement->paragraph) {
        foreach ($structuralElement->paragraph->elements as $paragraphElement) {
            if ($paragraphElement->textRun) {
                $allText[] = $paragraphElement->textRun->content;
            }
        }
    }
}
$modifiedText; //need to pass in the text body from docucrypt into this variable
// place decryption of text for $all text below here
    //decryption goes here

// Go through and create search/replace requests
$requests = $textsAlreadyDone = $forEasyCompare = [];
foreach ($allText as $currText) {
    if (in_array($currText, $textsAlreadyDone, true)) {
        // If two identical pieces of text are found only search-and-replace it once - no reason to do it multiple times
        continue;
    }
    // $currText = implode(",",$currText);
    // currently looks for placeholder text and replaces with this is text has been replaced looking into how to replace full document 
    // MUST HAVE A TEXT WITH PLACEHOLDER STRING
    // will eventually replaced with if statement below once we pass in variable to compare both texts
    // if(strcmp($modifiedText, $currText) !== 0):
    if (preg_match_all("/(.*?)(placeholder)(.*?)/", $currText, $matches, PREG_SET_ORDER)) {        
        // set encryption above replaceAllTextRequest store into the modifiedText variable
        $modifiedText ='Everything has been replaced';
        // Encryption here
        $replaceAllTextRequest = [
            'replaceAllText' => [
                'replaceText' => $modifiedText,
                'containsText' => [
                    'text' => $currText,
                    'matchCase' => true,
                ],
            ],
        ];

        $requests[] = new Google_Service_Docs_Request($replaceAllTextRequest);
    }
    $textsAlreadyDone[] = $currText;
}

// you could dump out $forEasyCompare to see the changes that would be made

$batchUpdateRequest = new Google_Service_Docs_BatchUpdateDocumentRequest(['requests' => $requests]);
$response = $service->documents->batchUpdate($documentId, $batchUpdateRequest);
?>
