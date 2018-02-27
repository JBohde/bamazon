var mysql = require('mysql');
var inquirer = require('inquirer');
let item; 
let price;
let res;

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'user',
    password: 'password',
    database: 'bamazon'
});


connection.connect(function(err) {
    if(err) {
        throw err;
    }
    // console.log("connected as id " + connection.threadId);
    // let dbIds;
    showTable();
    
});

function showTable() {
    connection.query("Select * from products", function(err, res) {
        if(err) throw err;
        res = res;
        console.log("\n***********************BAMAZON*******************************\n");
        for(i = 0; i < res.length; i++) {
          console.log("id:" + res[i].item_id + " PRODUCT: " + res[i].product_name);
          console.log("     DEPT: " + res[i].department_name);
          console.log("     PRICE: " + res[i].price + "\n");
        }
        buyPrompt();
    })
}

function buyPrompt() {
    inquirer.prompt([{
        type: 'input',
        name: 'item',
        message: "What's the item id number of the product you would like to purchase?"
    },
    {
        type: 'input',
        name: 'quantity',
        message: "How many would you like to buy?"
    
    }]).then(answers => {
        const buy = "SELECT item_id FROM products WHERE item_id = ?  && stock_quantity > ?";
        connection.query(buy, [answers.item, answers.quantity], function(err, res) {
          if(res <= 0) {
            console.log("Sorry, we don't have enough in inventory!");
          } else {
            console.log(res);
          }
          buyPrompt();
        })
    }); 
}


