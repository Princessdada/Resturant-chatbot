const mainmenu = `
    Welcome to Princess Resturant
    Select 1 to Place an order
Select 99 to Checkout order
Select 98 to See order history
Select 97 to See current order
Select 0 to Cancel order

Respond with your desired number`;

// function that displays food menu
const foodMenu = (menu) =>
  menu.map((item) => `${item.id}. ${item.name} - ₦${item.price}`).join("\n");
module.exports = { mainmenu, foodMenu };
