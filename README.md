# 🍽️ Restaurant Ordering System - Setup & Technical Guide

**Production-ready backend with real-time order tracking**

---

## ⚡ Quick Setup (5 minutes)

```bash
# 1. Clone and install
git clone https://github.com/nishantIA/restaurant-ordering-backend
cd restaurant-ordering-backend
npm install

# 2. Environment (already configured)
cp .env.example .env

# 3. Start
npm run start:dev
```

**✅ Running at:** http://localhost:4000/api/v1

---

## 🧪 Test the System

### Complete Order Flow:
```bash
# 1. Browse menu (fuzzy search works - try "piza")
curl "http://localhost:4000/api/v1/menu/items?search=pizza"

# 2. Add to cart (save session ID from response!)
curl -X POST http://localhost:4000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -d '{"menuItemId":"<FROM_MENU>","quantity":2}'

# 3. Create order (auto-creates user)
curl -X POST http://localhost:4000/api/v1/orders \
  -H "x-session-id: <YOUR_SESSION>" \
  -H "Content-Type: application/json" \
  -d '{"phone":"1234567890","name":"John Doe"}'

# 4. Update status (try PREPARING, then READY, then COMPLETED)
curl -X PATCH http://localhost:4000/api/v1/kitchen/orders/<ORDER_ID>/status \
  -H "Content-Type: application/json" \
  -d '{"status":"PREPARING","changedBy":"Chef"}'

# 5. Process payment
curl -X POST http://localhost:4000/api/v1/payments/process \
  -H "Content-Type: application/json" \
  -d '{"orderId":"<ORDER_ID>","amount":14.14,"paymentMethod":"MOCK"}'
```

---

## ER Diagram

https://ibb.co/Fb6fRVWt


## 🏆 Key Technical Features

### 1. Status Flow Validation (State Machine)
**No skipping steps - enforced at code level**

```
✅ Valid Flow:
RECEIVED → PREPARING → READY → COMPLETED

❌ Invalid (Blocked):
RECEIVED → COMPLETED
PREPARING → COMPLETED
COMPLETED → anything
```

**Test it:**
```bash
# This will fail:
curl -X PATCH .../status -d '{"status":"COMPLETED"}'  # From RECEIVED
# Response: "Invalid status transition: RECEIVED → COMPLETED"
```

---

### 2. Atomic Stock Management
**Prevents overselling with concurrent orders**

```typescript
// Database transaction handles race conditions
await prisma.$transaction(async (tx) => {
  await tx.menuItem.update({
    where: { id },
    data: { availableQuantity: { decrement: quantity } }
  });
  // If stock goes negative → automatic rollback!
});
```

**Test it:**
```bash
# Order more than available stock
# Response: "Only X units available"
```

---

### 3. Complex DAG Customizations
**Hierarchical options for items like "Build Your Own Bowl"**

```
Database Schema:
├── customization_nodes (id, name, type, price)
└── customization_edges (parent_id, child_id, constraints)

Example:
Build-your-own-bowl
├─ Choose Base (required: 1)
│  ├─ Rice ($0)
│  ├─ Quinoa (+$2)
│  └─ Greens (+$1)
├─ Choose Protein (required: 1-2)
│  ├─ Chicken (+$3)
│  ├─ Tofu (+$2)
│  └─ Beef (+$4.50)
└─ Add Vegetables (optional: 0-5)
   ├─ Broccoli (+$0.50)
   └─ Avocado (+$1.50)
```

**Test it:**
```bash
curl http://localhost:4000/api/v1/menu/items/build-your-own-bowl
```

---

### 4. Price Snapshots
**Prices frozen at order time**

```
Timeline:
10:00 - Add to cart (Pizza: $12.99)
10:30 - Menu price changed to $15.99
10:45 - View cart → Shows $15.99 (recalculated)
11:00 - Place order → Frozen at $15.99
11:30 - Menu price changed to $20.00
       - Order still shows $15.99 ✅
```

---

### 5. Real-Time WebSocket Updates
**Instant notifications without refresh**

```javascript
// Customer subscribes to order
const socket = io('http://localhost:4000/orders');
socket.emit('order:subscribe', orderId);

// Kitchen updates status → Customer receives update instantly
socket.on('order:statusUpdate', (data) => {
  console.log('Status:', data.status);  // Updates in <1 second
});
```

---

### 6. Fuzzy Search (pg_trgm)
**Find items even with typos**

```bash
curl "http://localhost:4000/api/v1/menu/items?search=piza"
# Returns: "Margherita Pizza", "Pepperoni Pizza" ✅
```

---

## 🏗️ Architecture

### Tech Stack:
- **Framework:** NestJS 10 + TypeScript
- **Database:** PostgreSQL (Supabase) + Prisma 7
- **Cache:** Redis (Upstash)
- **WebSocket:** Socket.io
- **Deployment:** Railway

### Design Patterns:
- **Repository Pattern** - Data access abstraction
- **Event-Driven** - WebSocket notifications
- **State Machine** - Order status validation
- **CQRS (Light)** - Separate reads/writes

### Module Structure:
```
src/modules/
├── menu/       → Catalog with fuzzy search
├── cart/       → Session-based (Redis)
├── orders/     → Stock management
├── kitchen/    → Status updates
├── payments/   → Mock gateway
├── users/      → Auto-creation
└── websocket/  → Real-time events
```

---

## 📊 Database Schema (14 Tables)

**Core Tables:**
- `users`, `categories`, `menu_items`
- `customizations`, `customization_nodes`, `customization_edges` (DAG)
- `orders`, `order_items`, `order_item_customizations`
- `taxes`, `menu_item_taxes`, `order_taxes`
- `payments`, `order_status_history`

**Key Indexes:**
- GIN indexes for array columns (dietary tags, allergens)
- Trigram indexes for fuzzy search
- Composite indexes for common queries

---

## 🎯 API Endpoints (17 Total)

### Menu (4)
```
GET  /menu/categories
GET  /menu/items?search=&category=&minPrice=&maxPrice=
GET  /menu/items/:idOrSlug
```

### Cart (4)
```
POST   /cart/items
PUT    /cart/items/:id
DELETE /cart/items/:id
GET    /cart
```

### Orders (4)
```
POST /orders
GET  /orders/:idOrOrderNumber
GET  /orders?sessionId=
GET  /orders/history/search?phone=
```

### Kitchen (4)
```
GET   /kitchen/orders?status=
GET   /kitchen/orders/:id
PATCH /kitchen/orders/:id/status
GET   /kitchen/stats
```

### Payments (3)
```
POST /payments/process
GET  /payments/:id
GET  /payments/order/:orderId
```

### WebSocket (1)
```
WS /orders (namespace)
```

---

## ✅ Assignment Coverage

| Feature | Implementation |
|---------|----------------|
| Menu browsing | Categories, search, filters ✅ |
| Shopping cart | Add/update/remove, session-based ✅ |
| Customizations | Simple + DAG for complex items ✅ |
| Order placement | User auto-creation, stock management ✅ |
| Kitchen dashboard | Real-time orders, status updates ✅ |
| Payment processing | Mock gateway with validation ✅ |
| Real-time tracking | WebSocket with Socket.io ✅ |
| **Edge Cases** | All handled ✅ |

### Edge Cases Handled:
- **Concurrent orders** → Atomic transactions
- **Stale prices** → Price snapshots + recalculation
- **Session timeout** → Redis TTL (24h)
- **Invalid status** → State machine validation
- **Duplicate payment** → Unique constraints

---

## 💡 Understanding the System

### Order Flow:
```
1. Customer browses menu
2. Adds items to cart (session-based, Redis)
3. Cart recalculates prices on every GET
4. Places order → Stock decremented atomically
5. User auto-created if phone/email provided
6. Kitchen receives WebSocket notification
7. Kitchen updates status → Customer notified instantly
8. Payment processed → Order complete
```

### Status Transitions:
```
RECEIVED    → Kitchen accepts order
PREPARING   → Chef starts cooking
READY       → Order ready for pickup
COMPLETED   → Customer received order
CANCELLED   → Can cancel from any status
```

### Price Handling:
```
Cart: Always shows current menu price
Order: Freezes price at creation time
Menu changes: Don't affect existing orders
```

### Customizations:
```
Simple: Size, add-ons (Pizza, Coffee)
DAG: Multi-level hierarchical (Build-your-own-bowl)
```

---

## 🔥 What Makes It Production-Ready

✅ **Type Safety** - 100% TypeScript with strict mode  
✅ **Error Handling** - Global filters for consistent responses  
✅ **Validation** - DTOs at every endpoint  
✅ **Logging** - Request/response interceptors  
✅ **Caching** - Redis for performance (5 min TTL)  
✅ **Transactions** - Atomic stock management  
✅ **Real-Time** - WebSocket with room isolation  
✅ **Scalable** - Stateless API, connection pooling  
✅ **Maintainable** - Repository pattern, modular design  

---

## 📚 Additional Documentation

- **DATABASE_SCHEMA.md** - Complete schema with ER diagram
- **API_REFERENCE.md** - All endpoints with examples
- **WEBSOCKET_GUIDE.md** - Real-time integration
- **DEPLOYMENT.md** - Production deployment guide

---

## 🚀 Live Demo

**URL:** https://restaurant-ordering-backend-production.up.railway.app

```bash
curl https://restaurant-ordering-backend-production.up.railway.app/api/v1/menu/categories
```

---

## 🎯 Key Takeaways

**This system demonstrates:**
- Enterprise-grade architecture patterns
- Proper handling of race conditions
- State machine for business logic
- Real-time communication
- Complex data structures (DAG)
- Production-ready code quality

**Ready for frontend integration!** 🚀