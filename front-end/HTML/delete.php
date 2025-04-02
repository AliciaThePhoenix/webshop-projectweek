 <?php
// Verwijderbewerking verwerken na bevestiging
if(isset($_POST["id"]) && !empty($_POST["id"])){
    // Configuratiebestand opnemen
    require_once "config.php";
    
    // Bereid een delete statement voor
    $sql = "DELETE FROM employees WHERE id = :id";
    
    if($stmt = $pdo->prepare($sql)){
        // Variabelen binden aan de voorbereide statement als parameters
        $stmt->bindParam(":id", $param_id);
        
        // Parameters instellen
        $param_id = trim($_POST["id"]);
        
        // Poging om de voorbereide statement uit te voeren
        if($stmt->execute()){
            // Records succesvol verwijderd. Doorverwijzen naar de startpagina
            header("location: index.php");
            exit();
        } else{
            echo "Oeps! Er is iets misgegaan. Probeer het later opnieuw.";
        }
    }
     
    // Statement sluiten
    unset($stmt);
    
    // Verbinding sluiten
    unset($pdo);
} else{
    // Controleer of het id-parameter bestaat
    if(empty(trim($_GET["id"]))){
        // URL bevat geen id-parameter. Doorverwijzen naar foutpagina
        header("location: error.php");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Record Verwijderen</title>
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
                    <h2 class="mt-5 mb-3">Record Verwijderen</h2>
                    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                        <div class="alert alert-danger">
                            <input type="hidden" name="id" value="<?php echo trim($_GET["id"]); ?>"/>
                            <p>Weet u zeker dat u dit werknemersrecord wilt verwijderen?</p>
                            <p>
                                <input type="submit" value="Ja" class="btn btn-danger">
                                <a href="index.php" class="btn btn-secondary ml-2">Nee</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>        
        </div>
    </div>
</body>
</html>