var mysql = require('mysql');
var inquirer = require('inquirer');
let item; 
let quantity;
let price;
let res;
let chosenItem;

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
        results = res;
        console.log("\n WELCOME TO BAMAZON! \n");
          for(i = 0; i < results.length; i++) {
            // table is an Array, so you can `push`, `unshift`, `splice` and friends 
            table.push([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price]);
          }
        console.log(table.toString() + "\n");

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
          // get the information of the chosen item
          item = answers.item;
          quantity = answers.quantity;
          for (i = 0; i < results.length; i++) {
            if (results[i].item_id === parseInt(item)) {
              chosenItem = results[i];
            }
          }
          // determine if inventory was high enough
          if (chosenItem.stock_quantity < quantity) {
              console.log("\n" + "Sorry, we don't have enough in inventory!" + "\n");
              shopMore();
          } else if (chosenItem.stock_quantity >= quantity) {
            // inventory was high enough, so confirm the purchase
              console.log("\n" + "Your total for " + quantity + " of " + chosenItem.product_name +  " comes to a total of $" + (chosenItem.price * quantity) + "." + "\n");
              confirmPurchase();

          }
      });
    }) 
}

function confirmPurchase() {
    inquirer.prompt({
        type: 'list',
        name: 'confirm',
        message: "Would you like to purchase?",
        choices: ["Yes", "No"]

    }).then(answers => {
        if (answers.confirm === "Yes") {
            const updateQuery = "UPDATE products SET stock_quantity = stock_quantity -? WHERE item_id = ?";
            connection.query(updateQuery, [quantity, item], function(err, res) {
              if(err) throw err;
              console.log("\n" + "Thank you for your purchase!" + "\n");
              shopMore();
            });
        } else if (answers.confirm === "No") {
           console.log("\n" + "Order cancelled." + "\n");
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
           console.log("\n" + "Thank you! Come again soon!");
           connection.end(() => {process.exit(); });
        }
    }); 
}