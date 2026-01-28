const menu = require("../menu.js");
const { mainmenu, foodMenu } = require("../utils/menuResponse.js");
const { calculateTotal } = require("../utils/calculateTotal.js");
// function that handles the option logic
const handleMessage = async (message, session) => {
  // Handle empty message, reset to main menu
  if (!message || message.trim() === '') {
    session.state = "IDLE";
    session.currentOrder = []; // New conversation = fresh order
    return mainmenu;
  }

  switch (message) {
    case "1":
      if (session.state !== "ORDERING") {
        session.state = "ORDERING";
        return (
          "Please select a menu item:\n" +
          foodMenu(menu) +
          "\nEnter a menu number or press 99 to checkout."
        );
      } else {
        // User is in ORDERING state and selected menu item 1
        const item = menu.find((i) => i.id == 1);
        if (item) {
          session.currentOrder.push(item);
          const total = calculateTotal(session.currentOrder);
          return (
            `✅ ${item.name} added.\n` +
            `Current total: ₦${total}\n` +
            `Select more items or press 99 to checkout.`
          );
        }
      }
      break;


    case "99":
      if (session.currentOrder.length == 0) {
        session.state = "IDLE";
        return "You currently have no order,\n" + mainmenu;
      }
      
      const totalAmount = calculateTotal(session.currentOrder);
      // Initialize Paystack payment
      try {
        const { initializePayment } = require("./paystackService"); // Lazy load
     
        const email = "customer@example.com"; 
        const callbackUrl = `http://localhost:8000/payment/callback?deviceId=${session.deviceId}`; // We'll need deviceId here
        
        const paymentData = await initializePayment(email, totalAmount, callbackUrl);
        
        session.paymentReference = paymentData.reference;
        
        // Add to history immediately with Pending status
        session.orderHistory.push({
            items: session.currentOrder,
            total: totalAmount,
            status: 'Pending Payment',
            reference: paymentData.reference,
            date: new Date()
        });
        
        session.currentOrder = []; // Clear current order
        session.state = "IDLE"; // Reset state 
        
        return `Order placed successfully ✅\nPlease make payment here: <a href="${paymentData.authorization_url}" target="_blank">Pay Now</a>`;
      } catch (error) {
        console.error("Payment init error:", error);
        return "Error initializing payment. Please try again.";
      }

    case "98":
      if (session.orderHistory.length !== 0) {
        let historyStr = "📜 *Order History:*\n";
        session.orderHistory.forEach((order, index) => {
           let items, total, status;
           
           if (Array.isArray(order)) {
               items = order;
               total = calculateTotal(order);
               status = "Completed"; 
           } else {
               items = order.items;
               total = order.total;
               status = order.status;
           }

           historyStr += `\n*Order ${index + 1}*\n`;
           historyStr += `Order Status: ${status}\n`;
           historyStr += `Items Selected:\n`;
           items.forEach(item => {
             historyStr += `- ${item.name} (₦${item.price})\n`;
           });
           historyStr += `Order Total: ₦${total}\n`;
        });
        return historyStr;
      }
      return "No order history yet";

    case "97":
      if (session.orderHistory.length > 0) {
        const lastOrder = session.orderHistory[session.orderHistory.length - 1];
        
        // User request: "current orders should show only orders that have been paod for"
        if (lastOrder.status === 'Paid') {
            let items, total, status;
            
            if (Array.isArray(lastOrder)) {
                
                return "No active order"; 
            } else {
                items = lastOrder.items;
                total = lastOrder.total;
                status = lastOrder.status;
            }

            let orderStr = `Order Status: ${status}\n`;
            orderStr += `Items Selected:\n`;
            items.forEach(item => {
               orderStr += `- ${item.name} (₦${item.price})\n`;
            });
            orderStr += `Order Total: ₦${total}\n`;
            return orderStr;
        }
      }
      return "You have no current order";

    case "0":
      // Scenario 1: Order Selected (Items in Cart)
      if (session.currentOrder.length > 0) {
          session.currentOrder = [];
          session.state = "IDLE";
          return "Your order has been cancelled.\n" + mainmenu;
      }

      // Scenario 1b: In Ordering Menu but No Items Selected
      if (session.state === "ORDERING") {
          session.state = "IDLE";
          return "No order has been placed yet.\n" + mainmenu;
      }
      
      // Check history for Last Order status
      if (session.orderHistory.length > 0) {
          const lastOrder = session.orderHistory[session.orderHistory.length - 1];
          
          // Scenario 2: Pending Order (Pending Payment)
          if (lastOrder.status === 'Pending Payment') {
              lastOrder.status = "Cancelled";
              session.state = "IDLE";
              return "Your order has been cancelled.\n" + mainmenu;
          } 
          // Scenario 3: Order Placed and Paid
          else if (lastOrder.status === 'Paid') {
               return "❌ Your order has already been placed and cannot be cancelled.\n\nPlease reach out to our agent at <a href='mailto:princessdada321@gmail.com'>princessdada321@gmail.com</a> for complaints or assistance.\n" + mainmenu;
          }
      }

      // Scenario 1 Fallback: No Order Placed (No cart, no pending history)
      session.state = "IDLE";
      return "No order has been placed yet.\n" + mainmenu;

    default:
      if (session.state === "ORDERING") {
        const item = menu.find((i) => i.id == message);

        if (!item) {
          return (
            "❌ Invalid menu number.\n" +
            "Please select a valid menu item:\n" +
            foodMenu(menu)
          );
        }

        session.currentOrder.push(item);
        const total = calculateTotal(session.currentOrder);

        return (
          `✅ ${item.name} added.\n` +
          `Current total: ₦${total}\n` +
          `Select more items or press 99 to checkout.`
        );
      }

      return "Invalid option.\n" + mainmenu;
  }
};

module.exports = { handleMessage, mainmenu, foodMenu };
