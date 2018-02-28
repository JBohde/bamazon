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
    if(err)  throw err;
    // console.log("connected as id " + connection.threadId);
    showTable();
});

function showTable() {
    var Table = require('cli-table');
    // instantiate 
    var table = new Table({
      head: ['id', 'Product', 'Department', 'Price'], 
      colWidths: [5, 70, 25, 10]
    });
    connection.query("Select * from products", function(err, res) {
        if(err) throw err;
        res = res;
        console.log("\n WELCOME TO BAMAZON! \n");
        for(i = 0; i < res.length; i++) {
            // table is an Array, so you can `push`, `unshift`, `splice` and friends 
          table.push(
            [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price ]
         );
        }
        console.log(table.toString() + "\n");
        buyPrompt();
    })
}

function buyPrompt() {
    inquirer.prompt([{
        type: 'input',
        name: 'item',
        message:"Enter the ID of the product you would like to purchase:"
    },
    {
        type: 'input',
        name: 'quantity',
        message: "How many would you like to buy?"
    
    }]).then(answers => {
        const updateQuery = "UPDATE products SET stock_quantity = stock_quantity -? WHERE item_id = ?";
        const buyQuery = "SELECT product_name, price FROM products WHERE item_id = ?";
        item = answers.item;
        quantity = answers.quantity;
        // Run a query to update the database
        connection.query(updateQuery, [quantity, item], function(err, results) {
          if(results <= quantity) {
              console.log( "\n" + "Sorry, we don't have enough in inventory!");
          } else {
            connection.query(buyQuery, [item], function(err, results) {
                console.log( "\n" + "Your total for " + quantity + " of " + results[0].product_name +  " comes to a total of $" + (results[0].price * quantity) + "." + "\n");
                confirmPurchase();
            });
          }
        })
    }); 
}

function confirmPurchase() {
    inquirer.prompt({
        type: 'list',
        name: 'confirm',
        message: "Would you like to purchase?",
        choices: ["Yes", "No"]

    }).then(answers => {
        if (answers.confirm === "Yes") {
           console.log("Thank you for your purchase!" + "\n");
           shopMore();
        } else if (answers.confirm === "No") {
           console.log("Order cancelled." + "\n");
           shopMore();
        }
    });
}

function shopMore() {
    inquirer.prompt([{
        type: 'list',
        name: 'shop_more',
        message: "Would you like to continue shopping?",
        choices: ["Yes", "No"]

    }]).then(answers => {
        if (answers.shop_more === "Yes") {
            console.log("Okay! Let's go!");
           showTable();
        } else if (answers.shop_more === "No") {
           console.log("Thank you! Come again soon!");
           connection.end(() => {process.exit(); });
        }
    }); 
}