<?php
// Tạo header cho việc kiểm soát đầy đủ
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Thông tin server
$server = "localhost";
$username = "root";
$password = "";
$database = "qlnh_perfact";

// Kết nối
$conn = new mysqli($server, $username, $password, $database);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

$Username = isset($_GET['Username']) ? $_GET['Username'] : '';
$Password = isset($_GET['Password']) ? $_GET['Password'] : '';

$DMFoodID = isset($_GET['DMFoodID']) ? $_GET['DMFoodID'] : '';

$FoodID = isset($_GET['FoodID']) ? $_GET['FoodID'] : '';

$FoodName = isset($_GET['FoodName']) ? $_GET['FoodName'] : '';
$Quantity = isset($_GET['Quantity']) ? $_GET['Quantity'] : '';
$Price = isset($_GET['Price']) ? $_GET['Price'] : '';
$TableName = isset($_GET['TableName']) ? $_GET['TableName'] : '';
$BillDate = isset($_GET['BillDate']) ? $_GET['BillDate'] : '';
$TotalAmount = isset($_GET['TotalAmount']) ? $_GET['TotalAmount'] : '';
$CustomerName = isset($_GET['CustomerName']) ? $_GET['CustomerName'] : '';
$SDT = isset($_GET['SDT']) ? $_GET['SDT'] : '';

switch($action){
    case "checkAccount":
        checkAccount($conn, $Username, $Password);
        break;
    case "home":
        home($conn);
        break;
    case "getAccountDetails":
        $Username = isset($_GET['Username']) ? $_GET['Username'] : '';
        getAccountDetails($conn, $Username);
        break;
    case "getAccountList":
        getAccountList($conn);
        break;
    case "searchAccount":
        $searchTerm = isset($_GET['searchTerm']) ? $_GET['searchTerm'] : '';
        searchAccount($conn, $searchTerm);
        break;
    case "addAccount":
        addAccount($conn);
        break;
    case "deleteAccount":
        $AccountID = isset($_GET['AccountID']) ? $_GET['AccountID'] : '';
        deleteAccount($conn, $AccountID);
        break;
    case "updateAccount":
        updateAccount($conn);
        break;

    case "getTable":
        getTable($conn);
        break;
// Add new case in switch statement for managing tables
    case "addTable":
        $TableName = isset($_GET['TableName']) ? $_GET['TableName'] : '';
        $Status = isset($_GET['Status']) ? $_GET['Status'] : ''; // Lấy giá trị trạng thái
        addTable($conn, $TableName, $Status);
        break;
    case "updateTable":
        $TableID = isset($_GET['TableID']) ? $_GET['TableID'] : '';
        $TableName = isset($_GET['TableName']) ? $_GET['TableName'] : '';
        $Status = isset($_GET['Status']) ? $_GET['Status'] : '';
        updateTable($conn, $TableID, $TableName, $Status);
        break;
    case "deleteTable":
        $TableID = isset($_GET['TableID']) ? $_GET['TableID'] : '';
        deleteTable($conn, $TableID);
        break;

    case "getDmFood":
        getDmFood($conn, $TableName);
        break;
    case "getFood":
        getFood($conn, $DMFoodID);
        break;
    case "addBill":
        addBill($conn, $FoodName, $FoodID, $Quantity, $TableName, $BillDate, $CustomerName, $SDT);
        break;
    case "getDatalBillCurrent":
        getDatalBillCurrent($conn, $TableName);
        break;
    case "plushQuantityItem":
        plushQuantityItem($conn, $FoodName, $TableName, $CustomerName, $SDT);
        break;
    default:
        echo "Không xác định";
}

function checkAccount($conn, $Username, $Password) {
    $sql = "SELECT * FROM tbaccount where Username like '$Username' and Password like '$Password'";
   
    $result = $conn->query($sql);
    
    //Tạo mảng trống
    $rows = array();
    
    while ($row = $result->fetch_assoc()){
        $rows[] = $row;
    }

    $json = json_encode(array("taikhoan" => $rows), JSON_PRETTY_PRINT);

    file_put_contents('data.json', $json);
}

function home($conn){
    $sql_totalamount = "SELECT SUM(TotalAmount) AS TotalAmount FROM tbBillHistory WHERE DATE(BillDate) = CURDATE()";

    $result_totalamount = $conn->query($sql_totalamount);

    $rows_totalamount = array();
    
    while ($row_totalamount = $result_totalamount->fetch_assoc()){
        $rows_totalamount[] = $row_totalamount;
    }

    $json = json_encode(array("totalAmount" => $rows_totalamount), JSON_PRETTY_PRINT);

    file_put_contents('data.json', $json);
}

// Add this function
function getAccountDetails($conn, $Username) {
    $sql = "SELECT tbaccount.AccountID, tbaccount.Username, tbaccount.Password, tbaccount.AccountType, 
                   tbuserinfo.FullName, tbuserinfo.BirthDay, tbuserinfo.Sex, tbuserinfo.Email, tbuserinfo.PhoneNumber 
            FROM tbaccount
            INNER JOIN tbuserinfo ON tbaccount.AccountID = tbuserinfo.AccountID
            WHERE tbaccount.Username = '$Username'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    $json = json_encode($row, JSON_PRETTY_PRINT);
    echo $json;
}
function getAccountList($conn) {
    $sql = "SELECT tbaccount.AccountID, tbaccount.Username, tbaccount.AccountType, 
                   tbuserinfo.FullName, tbuserinfo.BirthDay, tbuserinfo.Sex, tbuserinfo.Email, tbuserinfo.PhoneNumber 
            FROM tbaccount
            INNER JOIN tbuserinfo ON tbaccount.AccountID = tbuserinfo.AccountID";
    $result = $conn->query($sql);
    $rows = array();
    if (!$result) {
        // Nếu truy vấn thất bại, ghi lỗi vào nhật ký
        error_log("SQL error: " . $conn->error);
        echo json_encode(array("error" => $conn->error));
        return;
    }
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $json = json_encode(array("ListAccount" => $rows), JSON_PRETTY_PRINT);
    file_put_contents('data.json', $json);
    echo $json;
}

function searchAccount($conn, $searchTerm) {
    $sql = "SELECT tbaccount.AccountID, tbaccount.Username, tbaccount.AccountType, 
                   tbuserinfo.FullName, tbuserinfo.BirthDay, tbuserinfo.Sex, tbuserinfo.Email, tbuserinfo.PhoneNumber 
            FROM tbaccount
            INNER JOIN tbuserinfo ON tbaccount.AccountID = tbuserinfo.AccountID
            WHERE tbuserinfo.FullName LIKE '%$searchTerm%'";
    $result = $conn->query($sql);
    $rows = array();
    if (!$result) {
        // Nếu truy vấn thất bại, ghi lỗi vào nhật ký
        error_log("SQL error: " . $conn->error);
        echo json_encode(array("error" => $conn->error));
        return;
    }
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $json = json_encode(array("SearchResult" => $rows), JSON_PRETTY_PRINT);
    echo $json;
}
// function addAccount($conn, $Username, $Password, $AccountType, $FullName, $BirthDay, $Sex, $Email, $PhoneNumber) {
//     $sql = "INSERT INTO tbaccount (Username, Password, AccountType) VALUES ('$Username', '$Password', '$AccountType')";
//     if ($conn->query($sql) === TRUE) {
//         $AccountID = $conn->insert_id;
//         $sqlUserInfo = "INSERT INTO tbuserinfo (AccountID, FullName, BirthDay, Sex, Email, PhoneNumber) 
//                         VALUES ('$AccountID', '$FullName', '$BirthDay', '$Sex', '$Email', '$PhoneNumber')";
//         $conn->query($sqlUserInfo);
//         echo json_encode(array("status" => "success"));
//     } else {
//         echo json_encode(array("status" => "error", "message" => $conn->error));
//     }
// }
function addAccount($conn)
{
    // Lấy dữ liệu từ request
    $data = json_decode(file_get_contents("php://input"), true);

    // Extract dữ liệu từ request
    $Username = $data['Username'];
    $Password = $data['Password'];
    $AccountType = $data['AccountType'];
    $FullName = $data['FullName'];
    $BirthDay = $data['BirthDay'];
    $Sex = $data['Sex'];
    $Email = $data['Email'];
    $PhoneNumber = $data['PhoneNumber'];

    // Thêm vào tbaccount
    $sqlAccount = "INSERT INTO tbaccount (Username, Password, AccountType) 
                   VALUES ('$Username', '$Password', '$AccountType')";
    if ($conn->query($sqlAccount) === TRUE) {
        $AccountID = $conn->insert_id;
        
        // Thêm vào tbuserinfo
        $sqlUserInfo = "INSERT INTO tbuserinfo (AccountID, FullName, BirthDay, Sex, Email, PhoneNumber) 
                        VALUES ('$AccountID', '$FullName', '$BirthDay', '$Sex', '$Email', '$PhoneNumber')";
        if ($conn->query($sqlUserInfo) === TRUE) {
            echo json_encode(array("status" => "success"));
        } else {
            echo json_encode(array("status" => "error", "message" => $conn->error));
        }
    } else {
        echo json_encode(array("status" => "error", "message" => $conn->error));
    }
}

function deleteAccount($conn, $AccountID) {
    $sqlUserInfo = "DELETE FROM tbuserinfo WHERE AccountID = '$AccountID'";
    $conn->query($sqlUserInfo);
    $sqlAccount = "DELETE FROM tbaccount WHERE AccountID = '$AccountID'";
    $conn->query($sqlAccount);
    echo json_encode(array("status" => "success"));
}

function updateAccount($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $AccountID = $data['AccountID'];
    $AccountType = $data['AccountType'];
    $FullName = $data['FullName'];
    $BirthDay = $data['BirthDay'];
    $Sex = $data['Sex'];
    $Email = $data['Email'];
    $PhoneNumber = $data['PhoneNumber'];
    
    $sqlAccount = "UPDATE tbaccount SET AccountType = '$AccountType' WHERE AccountID = '$AccountID'";
    $sqlUserInfo = "UPDATE tbuserinfo SET FullName = '$FullName', BirthDay = '$BirthDay', Sex = '$Sex', Email = '$Email', PhoneNumber = '$PhoneNumber' WHERE AccountID = '$AccountID'";
    
    if ($conn->query($sqlAccount) === TRUE && $conn->query($sqlUserInfo) === TRUE) {
        echo json_encode(array("status" => "success"));
    } else {
        echo json_encode(array("status" => "error", "message" => $conn->error));
    }
}

function getTable($conn){
    $sql_table = "SELECT * FROM tbdstable";

    $result_table = $conn->query($sql_table);

    $rows_table = array();
    
    while ($row_table = $result_table->fetch_assoc()){
        $rows_table[] = $row_table;
    }

    $json = json_encode(array("ListTable" => $rows_table), JSON_PRETTY_PRINT);

    file_put_contents('data.json', $json);
}

function addTable($conn, $TableName, $Status) {
    $TableName = $conn->real_escape_string($TableName);
    $Status = $conn->real_escape_string($Status);

    $sql = "INSERT INTO tbdstable (TableName, Status) VALUES ('$TableName', '$Status')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Thêm bàn thành công"]);
    } else {
        echo json_encode(["error" => "Lỗi: " . $sql . "<br>" . $conn->error]);
    }
}


function updateTable($conn, $TableID, $TableName, $Status) {
    $TableName = $conn->real_escape_string($TableName);
    $Status = $conn->real_escape_string($Status);

    $sql = "UPDATE tbdstable SET TableName='$TableName', Status='$Status' WHERE TableID=$TableID";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Cập nhật bàn thành công"]);
    } else {
        echo json_encode(["error" => "Lỗi: " . $sql . "<br>" . $conn->error]);
    }
}

function deleteTable($conn, $TableID) {
    $sql = "DELETE FROM tbdstable WHERE TableID=$TableID";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Xóa bàn thành công"]);
    } else {
        echo json_encode(["error" => "Lỗi: " . $sql . "<br>" . $conn->error]);
    }
}
function getDmFood($conn, $TableName){
    $sql_dmFood = "SELECT * FROM tbdmfood";
    $sql_Food = "SELECT * FROM tbfood WHERE DMFoodID = 1";
    $sql_bill = "SELECT * FROM tbbilldetails WHERE TableName = '$TableName'";

    $result_dmFood = $conn->query($sql_dmFood);
    $result_Food = $conn->query($sql_Food);
    $result_bill = $conn->query($sql_bill);

    $rows_dmFood = array();
    $rows_Food = array();

    while ($row_dmFood = $result_dmFood->fetch_assoc()){
        $rows_dmFood[] = $row_dmFood;
    }

    while ($row_Food = $result_Food->fetch_assoc()){
        $rows_Food[] = $row_Food;
    }

    if($result_bill && $result_bill->num_rows > 0){
        $rows_bill = array();
        while ($row_bill = $result_bill->fetch_assoc()){
            $rows_bill[] = $row_bill;
        }
        $json = json_encode(array("ListCategory" => $rows_dmFood,"ListFood" => $rows_Food, "BillCurrentOfTable" => $rows_bill), JSON_PRETTY_PRINT);
        
        file_put_contents('data.json', $json);
    }else{
        $json = json_encode(array("ListCategory" => $rows_dmFood,"ListFood" => $rows_Food), JSON_PRETTY_PRINT);

        file_put_contents('data.json', $json);
    }
}

function getFood($conn, $DMFoodID){
    $sql_Food = "SELECT * FROM tbfood WHERE DMFoodID = '$DMFoodID'";

    $result_Food = $conn->query($sql_Food);

    $rows_Food = array();
    
    while ($row_Food = $result_Food->fetch_assoc()){
        $rows_Food[] = $row_Food;
    }

    $json = json_encode(array("ListFood" => $rows_Food), JSON_PRETTY_PRINT);

    file_put_contents('data.json', $json);
}

function addBill($conn, $FoodName, $FoodID, $Quantity, $TableName, $BillDate, $CustomerName, $SDT){
    $sql_searchFoodName = "SELECT * FROM tbfood WHERE FoodID = '$FoodID'";
    $result_searchFoodName = $conn->query($sql_searchFoodName);

    if ($result_searchFoodName && $result_searchFoodName->num_rows > 0) {

        $row_searchFoodName = $result_searchFoodName->fetch_assoc();
        $FoodName = $row_searchFoodName['FoodName'];
        $Price = $row_searchFoodName['Price'];

        //check tồn tại của food trước đó
        $sql_check = "SELECT * FROM tbBillDetails WHERE FoodName = '$FoodName' and TableName='$TableName'";
        $result_check = $conn->query($sql_check);

        if($result_check && $result_check->num_rows > 0){

            $row_check = $result_check->fetch_assoc();

            $Quantity = $row_check['Quantity'];
            $QuantityCurrent = $Quantity + 1;

            $TotalAmount = $Price * $QuantityCurrent;

            $sql_addBill = "UPDATE tbBillDetails SET TotalAmount = '$TotalAmount', Quantity='$QuantityCurrent' WHERE FoodName = '$FoodName'";
            
            $result_addBill = $conn->query($sql_addBill);
        }else if($result_check->num_rows == 0){
            $sql_addBill = "INSERT INTO tbBillDetails (FoodName,TableName,BillDate,Price,CustomerName,SDT,Quantity,TotalAmount) VALUES ('$FoodName','$TableName','$BillDate','$Price','$CustomerName','$SDT',1,'$Price')";
            
            $result_addBill = $conn->query($sql_addBill);
        }
    } 
}

function plushQuantityItem($conn, $FoodName, $TableName, $CustomerName, $SDT){
    //check tồn tại của food trước đó
    $sql = "SELECT * FROM tbBillDetails WHERE FoodName = '$FoodName' and TableName='$TableName' and CustomerName = '$CustomerName' and SDT = '$SDT'";
    $result = $conn->query($sql);

    if($result && $result->num_rows > 0){

        $row = $result->fetch_assoc();

        $Quantity = $row['Quantity'];
        $Price = $row['Price'];
        $QuantityCurrent = $Quantity + 1;

        $TotalAmount = $Price * $QuantityCurrent;

        $sql_plush = "UPDATE tbBillDetails SET TotalAmount = '$TotalAmount', Quantity='$QuantityCurrent' WHERE FoodName = '$FoodName' and TableName='$TableName' and CustomerName = '$CustomerName' and SDT = '$SDT'";
        
        $result_plush = $conn->query($sql_plush);
    }
}

function getDatalBillCurrent($conn, $TableName){
    $sql = "SELECT * FROM tbBillDetails WHERE TableName='$TableName'";

    $result = $conn->query($sql);

    $rows = array();

    while ($row = $result->fetch_assoc()){
        $rows[] = $row;
    }

    $json = json_encode(array("BillCurrentOfTable" => $rows), JSON_PRETTY_PRINT);

    file_put_contents('data.json', $json);
}
$conn->close();
?>