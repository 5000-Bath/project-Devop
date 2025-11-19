const { defineConfig } = require("cypress");
const axios = require("axios"); // เพิ่ม axios

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // เพิ่ม task สำหรับอัปเดตสถานะออเดอร์
      on("task", {
        async updateOrderStatus({ orderId, status }) {
          try {
            // ยิง API ไปยัง Backend โดยตรงเพื่อเปลี่ยนสถานะ
            // นี่คือการจำลองการทำงานของ Admin โดยไม่ต้องผ่าน UI
            const response = await axios.patch(
              `http://localhost:8080/api/orders/${orderId}/status`,
              { status: status },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            console.log(
              `[Cypress Task] Updated order ${orderId} to status: ${status}`,
              response.data
            );
            return null; // task ต้อง return ค่าที่ serializable ได้
          } catch (error) {
            console.error(
              "[Cypress Task] Failed to update order status:",
              error.message
            );
            throw error; // โยน error เพื่อให้ Cypress รู้ว่า task ล้มเหลว
          }
        },
      });
    },
  },
});
