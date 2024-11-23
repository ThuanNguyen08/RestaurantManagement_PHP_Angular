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

switch($action){
    case "getUserInfo":
        $accountId = isset($_GET['accountId']) ? intval($_GET['accountId']) : 0;
        getUserInfo($conn, $accountId);
        break;
    case "updateUserInfo":
        updateUserInfo($conn);
        break;
    case "getFoods":
        getFoods($conn);
        break;
    case "saveFoodsToJSON":
        saveFoodsToJSON();
        break;
    case "deleteFood":
        $foodId = isset($_GET['id']) ? intval($_GET['id']) : 0;
        deleteFood($conn, $foodId);
        break;
    case "editFood":
        $foodId = isset($_GET['id']) ? intval($_GET['id']) : 0;
        editFood($conn, $foodId);
        break;
    case "addFood":
        addFood($conn);
        break;  
    case "getDMFoods":
        getDMFoods($conn);
        break;
    case "addDMFood":
        addDMFood($conn);
        break;
    case "editDMFood":
        $dmFoodId = isset($_GET['id']) ? intval($_GET['id']) : 0;
        editDMFood($conn, $dmFoodId);
        break;
    case "deleteDMFood":
        $dmFoodId = isset($_GET['id']) ? intval($_GET['id']) : 0;
        deleteDMFood($conn, $dmFoodId);
        break;
    case "getFoodsByCategory":
        $categoryId = isset($_GET['categoryId']) ? intval($_GET['categoryId']) : 0;
        getFoodsByCategory($conn, $categoryId);
        break;
    case "getRevenues":
        getRevenues($conn);
        break;
    case "deleteRevenue":
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        deleteRevenue($conn, $id);
        break;
    default:
        echo "Không xác định";
}

function getFoods($conn) {
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    $offset = ($page - 1) * $limit;

    $sql = "SELECT * FROM tbfood LIMIT $limit OFFSET $offset";
    $result = $conn->query($sql);

    $foods = array();
    while ($row = $result->fetch_assoc()) {
        $foods[] = $row;
    }

    $total_sql = "SELECT COUNT(*) as total FROM tbfood";
    $total_result = $conn->query($total_sql);
    $total_row = $total_result->fetch_assoc();
    $total = $total_row['total'];

    echo json_encode([
        "foods" => $foods,
        "total" => $total,
        "page" => $page,
        "limit" => $limit
    ]);
}

function getFoodsByCategory($conn, $categoryId) {
    $sql = "SELECT * FROM tbfood WHERE DMFoodID = $categoryId";
    $result = $conn->query($sql);

    $foods = array();
    while ($row = $result->fetch_assoc()) {
        $foods[] = $row;
    }

    echo json_encode($foods);
}

function saveFoodsToJSON() {
    $postData = file_get_contents('php://input');
    $foods = json_decode($postData, true);

    $json = json_encode(array("foods" => $foods), JSON_PRETTY_PRINT);
    file_put_contents('data.json', $json);

    echo json_encode(["status" => "success", "message" => "Data saved to data.json"]);
}

function deleteFood($conn, $id) {
    error_log("Delete food request received with id: " . $id);
    $sql = "DELETE FROM tbfood WHERE FoodID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        error_log("Food deleted successfully");
        echo json_encode(["status" => "success", "message" => "Food deleted"]);
    } else {
        error_log("Failed to delete food: " . $stmt->error);
        echo json_encode(["status" => "error", "message" => "Failed to delete food"]);
    }
}

function editFood($conn, $id) {
    $postData = file_get_contents('php://input');
    $food = json_decode($postData, true);
    $foodName = $food['FoodName'];
    $price = $food['Price'];
    $avtFood = $food['AvtFood'];

    $sql = "UPDATE tbfood SET FoodName = ?, Price = ?, AvtFood = ? WHERE FoodID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sdsi", $foodName, $price, $avtFood, $id);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Food updated"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update food"]);
    }
}

function addFood($conn) {
    $postData = file_get_contents('php://input');
    $newFood = json_decode($postData, true);

    $foodName = $newFood['FoodName'];
    $price = $newFood['Price'];

    $sql = "INSERT INTO tbfood (FoodName, Price) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sd", $foodName, $price);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Food added"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to add food"]);
    }
}

function getDMFoods($conn) {
    $sql = "SELECT * FROM tbdmfood";
    $result = $conn->query($sql);
    
    $dmFoods = array();
    while ($row = $result->fetch_assoc()) {
        $dmFoods[] = $row;
    }

    echo json_encode($dmFoods);
}

function addDMFood($conn) {
    $postData = file_get_contents('php://input');
    $newDMFood = json_decode($postData, true);

    $categoryName = $newDMFood['CategoryName'];

    $sql = "INSERT INTO tbdmfood (CategoryName) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $categoryName);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Category added"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to add category"]);
    }
}

function editDMFood($conn, $id) {
    $postData = file_get_contents('php://input');
    $dmFood = json_decode($postData, true);

    $categoryName = $dmFood['CategoryName'];

    $sql = "UPDATE tbdmfood SET CategoryName = ? WHERE DMFoodID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $categoryName, $id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Category updated"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update category"]);
    }
}

function deleteDMFood($conn, $id) {
    $sql = "DELETE FROM tbdmfood WHERE DMFoodID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Category deleted"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete category"]);
    }
}

function getRevenues($conn) {
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
    $offset = ($page - 1) * $limit;

    $searchCustomer = isset($_GET['customer']) ? $_GET['customer'] : '';
    $searchPhone = isset($_GET['phone']) ? $_GET['phone'] : '';
    $searchTable = isset($_GET['table']) ? $_GET['table'] : '';
    $searchDateIn = isset($_GET['dateIn']) ? $_GET['dateIn'] : '';
    $searchDateOut = isset($_GET['dateOut']) ? $_GET['dateOut'] : '';

    $conditions = [];
    if ($searchCustomer) $conditions[] = "CustomerName LIKE '%" . $conn->real_escape_string($searchCustomer) . "%'";
    if ($searchPhone) $conditions[] = "SDT LIKE '%" . $conn->real_escape_string($searchPhone) . "%'";
    if ($searchTable) $conditions[] = "TableName LIKE '%" . $conn->real_escape_string($searchTable) . "%'";
    if ($searchDateIn) $conditions[] = "BillDate >= '" . $conn->real_escape_string($searchDateIn) . "'";
    if ($searchDateOut) $conditions[] = "BillDate <= '" . $conn->real_escape_string($searchDateOut) . "'";

    $where = count($conditions) > 0 ? "WHERE " . implode(" AND ", $conditions) : "";

    $sql = "SELECT BillID, TableName, CustomerName, SDT, BillDate, TotalAmount, UserInfoID FROM tbbillhistory $where LIMIT $limit OFFSET $offset ";
    $result = $conn->query($sql);

    $revenues = [];
    while ($row = $result->fetch_assoc()) {
        $revenues[] = $row;
    }

    $total_sql = "SELECT COUNT(*) as total FROM tbbillhistory $where";
    $total_result = $conn->query($total_sql);
    $total_row = $total_result->fetch_assoc();
    $total = $total_row['total'];

    echo json_encode([
        "revenues" => $revenues,
        "total" => $total,
        "page" => $page,
        "limit" => $limit
    ]);
}

function deleteRevenue($conn, $id) {
    $sql = "DELETE FROM tbbillhistory WHERE BillID = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(["status" => "success"]);
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

$conn->close();
?>