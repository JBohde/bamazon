DROP DATABASE IF EXISTS bamazon;
-- Creates the "animals_db" database --
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(500) NOT NULL,
  department_name VARCHAR(500) NOT NULL,
  price DOUBLE NOT NULL,
  stock_quantity INTEGER(30) NOT NULL,
  PRIMARY KEY (item_id)
)