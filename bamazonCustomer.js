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
    showTable();
    
});

function selectAll() {
    connection.query("Select * from products", function(err, results) {
        if(err) throw err;
        console.log(results)
        })
}

function confirmPurchase() {
    inquirer.prompt({
        type: 'list',
        name: 'confirm',
        message: "Would you like to purchase? (Use arrows)",
        choices: ["Yes", "No"]

    }).then(answers => {
        if (answers.confirm === "Yes") {
           console.log("Thank you for your purchase!");
        } else if (answers.confirm === "No") {
           console.log("Order cancelled.");
        }
    });
}



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
        console.log(table.toString());
        buyPrompt();
    })
}

function tableFormat(number, max) {
    let string = "";
    if(number >0)
        while(string.length < max-number) {
            string +=" ";
        }
        return string;
}

function buyPrompt() {
    inquirer.prompt([{
        type: 'input',
        name: 'item',
        message: "Enter the ID of the product you would like to purchase:"
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
        connection.query(updateQuery, [quantity, item], function(err, results) {
          if(results <= 0) {
              console.log("Sorry, we don't have enough in inventory!");
          } else {
            connection.query(buyQuery, [item], function(err, results) {
                // console.log(results[0]);
                console.log("Thanks so much for your purchase of " + results[0].product_name+ "!" + "\n");
                console.log("Your total comes to " + (results[0].price * quantity) + "." + "\n");
                confirmPurchase();
            });
          }
          buyPrompt();
        })
    }); 
}


