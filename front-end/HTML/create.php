<?php
// Configuratiebestand opnemen
require_once "config.php";
 
// Variabelen definiëren en initialiseren met lege waarden
$name = $address = $salary = "";
$name_err = $address_err = $salary_err = "";
 
// Formuliergegevens verwerken wanneer het formulier wordt ingediend
if($_SERVER["REQUEST_METHOD"] == "POST"){
    // Naam valideren
    $input_name = trim($_POST["name"]);
    if(empty($input_name)){
        $name_err = "Voer een naam in.";
    } elseif(!filter_var($input_name, FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^[a-zA-Z\s]+$/")))){
        $name_err = "Voer een geldige naam in.";
    } else{
        $name = $input_name;
    }
    
    // Adres valideren
    $input_address = trim($_POST["address"]);
    if(empty($input_address)){
        $address_err = "Voer een adres in.";     
    } else{
        $address = $input_address;
    }
    
    // Salaris valideren
    $input_salary = trim($_POST["salary"]);
    if(empty($input_salary)){
        $salary_err = "Voer het salarisbedrag in.";     
    } elseif(!ctype_digit($input_salary)){
        $salary_err = "Voer een positief geheel getal in.";
    } else{
        $salary = $input_salary;
    }
    
    // Invoervalidatie controleren voordat gegevens in de database worden ingevoerd
    if(empty($name_err) && empty($address_err) && empty($salary_err)){
        // Bereid een insert statement voor
        $sql = "INSERT INTO employees (name, address, salary) VALUES (:name, :address, :salary)";
 
        if($stmt = $pdo->prepare($sql)){
            // Variabelen binden aan de voorbereide statement als parameters
            $stmt->bindParam(":name", $param_name);
            $stmt->bindParam(":address", $param_address);
            $stmt->bindParam(":salary", $param_salary);
            
            // Parameters instellen
            $param_name = $name;
            $param_address = $address;
            $param_salary = $salary;
            
            // Poging om de voorbereide statement uit te voeren
            if($stmt->execute()){
                // Records succesvol aangemaakt. Doorverwijzen naar de startpagina
                header("location: index.php");
                exit();
            } else{
                echo "Oeps! Er is iets misgegaan. Probeer het later opnieuw.";
            }
        }
         
        // Statement sluiten
        unset($stmt);
    }
    
    // Verbinding sluiten
    unset($pdo);
}
?>
 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Record Aanmaken</title>
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
                    <h2 class="mt-5">Record Aanmaken</h2>
                    <p>Vul dit formulier in en dien het in om een werknemersrecord aan de database toe te voegen.</p>
                    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                        <div class="form-group">
                            <label>Naam</label>
                            <input type="text" name="name" class="form-control <?php echo (!empty($name_err)) ? 'is-invalid' : ''; ?>" value="<?php echo $name; ?>">
                            <span class="invalid-feedback"><?php echo $name_err;?></span>
                        </div>
                        <div class="form-group">
                            <label>Adres</label>
                            <textarea name="address" class="form-control <?php echo (!empty($address_err)) ? 'is-invalid' : ''; ?>"><?php echo $address; ?></textarea>
                            <span class="invalid-feedback"><?php echo $address_err;?></span>
                        </div>
                        <div class="form-group">
                            <label>Salaris</label>
                            <input type="text" name="salary" class="form-control <?php echo (!empty($salary_err)) ? 'is-invalid' : ''; ?>" value="<?php echo $salary; ?>">
                            <span class="invalid-feedback"><?php echo $salary_err;?></span>
                        </div>
                        <input type="submit" class="btn btn-primary" value="Indienen">
                        <a href="index.php" class="btn btn-secondary ml-2">Annuleren</a>
                    </form>
                </div>
            </div>        
        </div>
    </div>
</body>
</html>