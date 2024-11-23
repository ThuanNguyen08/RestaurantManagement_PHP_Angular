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
$UserInfoName = isset($_GET['UserInfoName']) ? $_GET['UserInfoName'] : '';


switch($action){
    case "checkAccount":
        checkAccount($conn, $Username, $Password);
        break;
    case "home":
        home($conn);
        break;
    case "getTable":
        getTable($conn);
        break;
    case "getDmFood":
        getDmFood($conn, $TableName);
        break;
    case "getFood":
        getFood($conn, $DMFoodID);
        break;
    case "addBill":
        addBill($conn, $FoodName, $FoodID, $Quantity, $TableName, $BillDate, $CustomerName, $SDT,$UserInfoName);
        break;
    case "getDatalBillCurrent":
        getDatalBillCurrent($conn, $TableName);
        break;
    case "plushQuantityItem":
        plushQuantityItem($conn, $FoodName, $TableName, $CustomerName, $SDT);
        break;
    case "minusQuantityItem":
        minusQuantityItem($conn, $FoodName, $TableName, $CustomerName, $SDT);
        break;
    case "saveBillToSQL":
        saveBillToSQL($conn, $TableName);
        break;
    case "quantityCustomer":
        quantityCustomer($conn);
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
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    $sql_totalamount = "SELECT SUM(TotalAmount) AS TotalAmount FROM tbbillhistory WHERE DATE(BillDate) = CURDATE()";
    $sql_totalcustomer = "SELECT BillDate, CustomerName, TableName, SUM(TotalAmount) AS TotalAmount FROM tbbillhistory WHERE DATE(BillDate) = CURDATE() GROUP BY BillDate, CustomerName, TableName ORDER BY BillDate DESC LIMIT 5";
    $sql_alltable = "SELECT COUNT(TableID) AS QuantityTableEmpty FROM tbdstable";
    $sql_statustable = "SELECT COUNT(TableID) AS QuantityTableEmpty FROM tbdstable WHERE Status='Trống'";
    $sql_bestfoodname = "SELECT FoodName, SUM(Quantity) AS Quantity FROM tbbillhistory WHERE DATE(BillDate) = CURDATE() GROUP BY FoodName ORDER BY Quantity DESC LIMIT 1";
    $sql_totalQuantitySold = "SELECT SUM(Quantity) AS Quantity FROM tbbillhistory WHERE DATE(BillDate) = CURDATE()";
    $sql_nameUser = "SELECT * FROM tbuserinfo";

    $current_year = date('Y');
    $current_month = date('m');
    $current_day = date('d');

    $sql_totalamount_by_month = "SELECT DATE_FORMAT(BillDate, '%m') AS datamonth, SUM(TotalAmount) AS TotalAmount FROM tbbillhistory WHERE YEAR(BillDate) = $current_year AND MONTH(BillDate) = $current_month GROUP BY DATE_FORMAT(BillDate, '%m') ORDER BY datamonth ASC";

    $sql_totalamount_by_hour = "SELECT DATE_FORMAT(BillDate, '%H') AS hour_of_day, SUM(TotalAmount) AS TotalAmount FROM tbbillhistory WHERE YEAR(BillDate) = $current_year AND MONTH(BillDate) = $current_month AND DAY(BillDate) = $current_day GROUP BY DATE_FORMAT(BillDate, '%H') ORDER BY hour_of_day ASC";

    $sql_total_amount_by_day = " SELECT DATE_FORMAT(BillDate, '%d') AS bill_date, SUM(TotalAmount) AS TotalAmount FROM tbbillhistory WHERE YEAR(BillDate) = $current_year AND MONTH(BillDate) = $current_month GROUP BY DATE_FORMAT(BillDate, '%d') ORDER BY bill_date ASC";

    $result_totalamount = $conn->query($sql_totalamount);
    $result_totalcustomer = $conn->query($sql_totalcustomer);
    $result_alltable = $conn->query($sql_alltable);
    $result_statustable = $conn->query($sql_statustable);
    $result_bestfoodname = $conn->query($sql_bestfoodname);
    $result_totalQuantitySold = $conn->query($sql_totalQuantitySold);
    $result_totalamount_by_month = $conn->query($sql_totalamount_by_month);
    $result_totalamount_by_hour = $conn->query($sql_totalamount_by_hour);
    $result_total_amount_by_day = $conn->query($sql_total_amount_by_day);
    $result_nameUser = $conn->query($sql_nameUser);

    $rows_nameUser = array();
    while ($row_nameUser = $result_nameUser->fetch_assoc()) {
        $rows_nameUser[] = $row_nameUser;
    }

    //truy vấn tổng tiền ngày
    while ($row_totalamount = $result_totalamount->fetch_assoc()) {
        $rows_totalamount = $row_totalamount;
    }

    //truy vấn số lượng khách trong ngày
    $rows_totalcustomer = array();
    while ($row_totalcustomer = $result_totalcustomer->fetch_assoc()) {
        $rows_totalcustomer[] = $row_totalcustomer;
    }

    //truy vấn tổng bàn trống trong ngày
    while ($row_alltable = $result_alltable->fetch_assoc()) {
        $rows_alltable = $row_alltable;
    }

    //truy vấn tổng bàn có người trong ngày
    while ($row_statustable = $result_statustable->fetch_assoc()) {
        $rows_statustable = $row_statustable;
    }

    //truy vấn best food trong ngày
    while ($row_bestfoodname = $result_bestfoodname->fetch_assoc()) {
        $rows_bestfoodname = $row_bestfoodname;
    }

    //truy vấn all quantity sold trong ngày
    while ($row_totalQuantitySold = $result_totalQuantitySold->fetch_assoc()) {
        $rows_totalQuantitySold = $row_totalQuantitySold;
    }
    
    $rows_totalamount_by_month = array();
    while ($row_totalamount_by_month = $result_totalamount_by_month->fetch_assoc()) {
        $rows_totalamount_by_month[] = $row_totalamount_by_month;
    }

    $rows_totalamount_by_hour = array();
    while ($row_totalamount_by_hour = $result_totalamount_by_hour->fetch_assoc()) {
        $rows_totalamount_by_hour[] = $row_totalamount_by_hour;
    }

    $rows_total_amount_by_day = array();
    while ($row_total_amount_by_day = $result_total_amount_by_day->fetch_assoc()) {
        $rows_total_amount_by_day[] = $row_total_amount_by_day;
    }

    $combined_results = array(
        "TotalAmount" => $rows_totalamount,
        "TotalTable" => $rows_alltable,
        "TotalTableNotEmpty" => $rows_statustable,
        "TotalCustomer" => $rows_totalcustomer,
        "BestFoodName" => $rows_bestfoodname,
        "ToTalQuantitySold" => $rows_totalQuantitySold,
        "TotalAmountByMonth" => $rows_totalamount_by_month,
        "TotalAmountByHour" => $rows_totalamount_by_hour,
        "TotalAmountByDay" => $rows_total_amount_by_day,
        "NameUser" => $rows_nameUser,
    );
    
    // Encode to JSON
    $json = json_encode(array("home" => $combined_results), JSON_PRETTY_PRINT);

    file_put_contents('data.json', $json);
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

function getDmFood($conn, $TableName){
    $sql_dmFood = "SELECT * FROM tbdmfood";
    $sql_Food = "SELECT * FROM tbfood WHERE DMFoodID = 1";
    $sql_bill = "SELECT * FROM tbbilldetails WHERE TableName = '$TableName'";

    $result_dmFood = $conn->query($sql_dmFood);
    $result_Food = $conn->query($sql_Food);
    $result_bill = $conn->query($sql_bill);

    $rows_dmFood = array();
    $rows_Food = array();
    $rows_bill = array();

    while ($row_dmFood = $result_dmFood->fetch_assoc()){
        $rows_dmFood[] = $row_dmFood;
    }

    while ($row_Food = $result_Food->fetch_assoc()){
        $rows_Food[] = $row_Food;
    }

    while ($row_bill = $result_bill->fetch_assoc()){
        $rows_bill[] = $row_bill;
    }

    $json = json_encode(array("ListCategory" => $rows_dmFood,"ListFood" => $rows_Food, "BillCurrentOfTable" => $rows_bill), JSON_PRETTY_PRINT);

    file_put_contents('data.json', $json);
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

function changeStatusTable($conn, $TableName){
    $sql_status = "SELECT * FROM tbbilldetails WHERE TableName='$TableName'";
    $result_status = $conn->query($sql_status);
    
    if($result_status->num_rows == 0){
        $status = "Trống";
        $sql_changeStatusTable = "UPDATE tbdstable SET Status='$status' WHERE TableID='$TableName'";
        $result_changeStatusTable = $conn->query($sql_changeStatusTable);
    }else if($result_status->num_rows > 0){
        $status = "Có người";
        $sql_changeStatusTable = "UPDATE tbdstable SET Status='$status' WHERE TableID='$TableName'";
        $result_changeStatusTable = $conn->query($sql_changeStatusTable);
    }
}


function addBill($conn, $FoodName, $FoodID, $Quantity, $TableName, $BillDate, $CustomerName, $SDT, $UserInfoName){

    date_default_timezone_set('Asia/Ho_Chi_Minh');

    $currentDateTime = new DateTime(); 
    $currentDateTime = date('Y-m-d H:i:s'); 

    $sql_searchFoodName = "SELECT * FROM tbfood WHERE FoodID = '$FoodID'";
    $result_searchFoodName = $conn->query($sql_searchFoodName);

    if ($result_searchFoodName && $result_searchFoodName->num_rows > 0) {

        $row_searchFoodName = $result_searchFoodName->fetch_assoc();
        $FoodName = $row_searchFoodName['FoodName'];
        $Price = $row_searchFoodName['Price'];

        //check tồn tại của food trước đó
        $sql_check = "SELECT * FROM tbbilldetails WHERE FoodName = '$FoodName' and TableName='$TableName'";
        $result_check = $conn->query($sql_check);

        if($result_check && $result_check->num_rows > 0){

            $row_check = $result_check->fetch_assoc();

            $Quantity = $row_check['Quantity'];
            $QuantityCurrent = $Quantity + 1;

            $TotalAmount = $Price * $QuantityCurrent;

            $sql_addBill = "UPDATE tbbilldetails SET TotalAmount = '$TotalAmount', Quantity='$QuantityCurrent' WHERE FoodName = '$FoodName'";
            
            $result_addBill = $conn->query($sql_addBill);
        }else if($result_check->num_rows == 0){

            //check user nhân viên
            $sql_searchUserInfoName = "SELECT * FROM tbAccount WHERE Username = '$UserInfoName'";
            $result_searchUserInfoName = $conn->query($sql_searchUserInfoName);
            
            if ($result_searchUserInfoName && $result_searchUserInfoName->num_rows > 0) {
                $row_searchUserInfoName = $result_searchUserInfoName->fetch_assoc();
                $AccountID = $row_searchUserInfoName['AccountID'];

                $sql_addBill = "INSERT INTO tbbilldetails (FoodName,TableName,BillDate,Price,CustomerName,SDT,Quantity,TotalAmount,UserInfoID) VALUES ('$FoodName','$TableName','$currentDateTime','$Price','$CustomerName','$SDT',1,'$Price','$AccountID')";
                $result_addBill = $conn->query($sql_addBill);

                changeStatusTable($conn, $TableName);
            }
        }
    }
}

function plushQuantityItem($conn, $FoodName, $TableName, $CustomerName, $SDT){
    //check tồn tại của food trước đó
    $sql = "SELECT * FROM tbbilldetails WHERE FoodName = '$FoodName' and TableName='$TableName' and CustomerName = '$CustomerName' and SDT = '$SDT'";
    $result = $conn->query($sql);

    if($result && $result->num_rows > 0){

        $row = $result->fetch_assoc();

        $Quantity = $row['Quantity'];
        $Price = $row['Price'];
        $QuantityCurrent = $Quantity + 1;

        $TotalAmount = $Price * $QuantityCurrent;

        $sql_plush = "UPDATE tbbilldetails SET TotalAmount = '$TotalAmount', Quantity='$QuantityCurrent' WHERE FoodName = '$FoodName' and TableName='$TableName' and CustomerName = '$CustomerName' and SDT = '$SDT'";
        
        $result_plush = $conn->query($sql_plush);
    }
}

function minusQuantityItem($conn, $FoodName, $TableName, $CustomerName, $SDT){
    //check tồn tại của food trước đó
    $sql = "SELECT * FROM tbbilldetails WHERE FoodName = '$FoodName' and TableName='$TableName' and CustomerName = '$CustomerName' and SDT = '$SDT'";
    $result = $conn->query($sql);

    if($result && $result->num_rows > 0){

        $row = $result->fetch_assoc();

        $Quantity = $row['Quantity'];
        $Price = $row['Price'];
        $QuantityCurrent = $Quantity - 1;
        
        if($QuantityCurrent > 0){
            $TotalAmount = $Price * $QuantityCurrent;

            $sql_minus = "UPDATE tbbilldetails SET TotalAmount = '$TotalAmount', Quantity='$QuantityCurrent' WHERE FoodName = '$FoodName' and TableName='$TableName' and CustomerName = '$CustomerName' and SDT = '$SDT'";
            $result_minus = $conn->query($sql_minus);
        }else{
            $sql_minus = "DELETE FROM tbbilldetails WHERE FoodName = '$FoodName' AND TableName='$TableName' AND CustomerName = '$CustomerName' AND SDT = '$SDT'";
            $result_minus = $conn->query($sql_minus);

            if($conn->query($sql_minus) === true){
                changeStatusTable($conn, $TableName);
            }
        }
    }
}

function getDatalBillCurrent($conn, $TableName){
    $sql = "SELECT * FROM tbbilldetails WHERE TableName='$TableName'";

    $result = $conn->query($sql);

    $rows = array();

    while ($row = $result->fetch_assoc()){
        $rows[] = $row;
    }

    $json = json_encode(array("BillCurrentOfTable" => $rows), JSON_PRETTY_PRINT);

    file_put_contents('data.json', $json);
}

function saveBillToSQL($conn, $TableName) {
    date_default_timezone_set('Asia/Ho_Chi_Minh');

    $currentDateTime = new DateTime(); 
    $currentDateTime = date('Y-m-d H:i:s'); 

    // Đường dẫn đến file JSON
    $file_path = 'data.json';

    // Đọc nội dung file JSON
    $json_content = file_get_contents($file_path);

    // Giải mã JSON thành mảng PHP
    $data = json_decode($json_content, true);

    // Lấy danh sách hóa đơn hiện tại của bàn (BillCurrentOfTable)
    $bill_current = $data['BillCurrentOfTable'];

    if (empty($bill_current)) {
        echo 'Không có hóa đơn nào hiện tại.';
    } else {
        foreach ($bill_current as $bill) {
            if($bill['TableName'] == $TableName){

                $FoodName = $bill['FoodName'];
                $Quantity = $bill['Quantity'];
                $Price = $bill['Price'];
                $TableName = $bill['TableName'];
                $TotalAmount = $bill['TotalAmount'];
                $UserInfoID = $bill['UserInfoID'];
                $CustomerName = $bill['CustomerName'];
                $SDT = $bill['SDT'];
                //thêm bill vào tbBillHistory
                $sql_insert = "INSERT INTO tbbillhistory (FoodName, Quantity, Price, TableName, BillDate, TotalAmount, UserInfoID, CustomerName, SDT) 
                VALUES ('$FoodName','$Quantity','$Price','$TableName','$currentDateTime','$TotalAmount','$UserInfoID','$CustomerName','$SDT')";
                $result_insert = $conn->query($sql_insert);

                //xóa bill khỏi tbbilldetails
                $sql_delete = "DELETE FROM tbbilldetails WHERE TableName='$TableName'";
                $result_delete = $conn->query($sql_delete);

                if($conn->query($sql_delete)){
                    changeStatusTable($conn, $TableName);
                }
            }
            
        }
    }
}

$conn->close();
?>