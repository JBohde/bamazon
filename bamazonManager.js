var mysql = require('mysql');
var inquirer = require('inquirer');
let item; 
let quantity;
let price;
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
 
    connection.query("Select * from products", function(err, results) {
        if(err) throw err;
        console.log("\n WELCOME TO BAMAZON! \n");
          for(i = 0; i < results.length; i++) {
            // table is an Array, so you can `push`, `unshift`, `splice` and friends 
            table.push([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price]);
          }
        console.log(table.toString() + "\n");
    });
}