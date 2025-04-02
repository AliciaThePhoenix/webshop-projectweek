<?php
// Controleer of het id-parameter bestaat voordat verder wordt gegaan
if(isset($_GET["id"]) && !empty(trim($_GET["id"]))){
    // Configuratiebestand opnemen
    require_once "config.php";
    
    // Bereid een select statement voor
    $sql = "SELECT * FROM employees WHERE id = :id";
    
    if($stmt = $pdo->prepare($sql)){
        // Variabelen binden aan de voorbereide statement als parameters
        $stmt->bindParam(":id", $param_id);
        
        // Parameters instellen
        $param_id = trim($_GET["id"]);
        
        // Poging om de voorbereide statement uit te voeren
        if($stmt->execute()){
            if($stmt->rowCount() == 1){
                /* Haal het resultaat op als een associatieve array. Aangezien de 
                resultaatset slechts één rij bevat, is een while-lus niet nodig */
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Individuele veldwaarden ophalen
                $name = $row["name"];
                $address = $row["address"];
                $salary = $row["salary"];
            } else{
                // URL bevat geen geldig id-parameter. Doorverwijzen naar foutpagina
                header("location: error.php");
                exit();
            }
            
        } else{
            echo "Oeps! Er is iets misgegaan. Probeer het later opnieuw.";
        }
    }
     
    // Statement sluiten
    unset($stmt);
    
    // Verbinding sluiten
    unset($pdo);
} else{
    // URL bevat geen id-parameter. Doorverwijzen naar foutpagina
    header("location: error.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Record Bekijken</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .wrapper{
            width: 600px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12">
                    <h1 class="mt-5 mb-3">Record Bekijken</h1>
                    <div class="form-group">
                        <label>Naam</label>
                        <p><b><?php echo $row["name"]; ?></b></p>
                    </div>
                    <div class="form-group">
                        <label>Adres</label>
                        <p><b><?php echo $row["address"]; ?></b></p>
                    </div>
                    <div class="form-group">
                        <label>Salaris</label>
                        <p><b><?php echo $row["salary"]; ?></b></p>
                    </div>
                    <p><a href="index.php" class="btn btn-primary">Terug</a></p>
                </div>
            </div>        
        </div>
    </div>
</body>
</html>