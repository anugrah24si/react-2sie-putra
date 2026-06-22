Supabase Full Integration Plan
Current State Summary
Auth: Login uses DummyJSON API; Register/Forgot are UI-only stubs.
Data: Orders and Customers are in-memory arrays in App.jsx. Products come from src/data/products.json.
Database SQL: docs/database-setup.sql already exists with tables (profiles, products, orders, order_items, points_transactions, tier_config), triggers, RLS policies, and indexes.
Existing pages to PRESERVE untouched: Notes (/notes), Components (/components), FiturXYZ (/fiturxyz), and all shared components.
Supabase project: hvihmzqopsvspvtevhmh.supabase.co (already used by notesAPI.js).
Important Schema Notes
The existing database-setup.sql uses order statuses Preparing / On Delivery / Delivered / Canceled and tier thresholds Bronze 0-999, Silver 1000-4999, Gold 5000-9999, Platinum 10000+. The user spec requests Pending / Processing / Completed / Cancelled and different thresholds. The SQL file will be updated to match the user spec since "Database Schema is source of truth" and the spec is the desired target state.
Task 1: Update Database SQL (docs/database-setup.sql)
Update the existing SQL file to align with the user spec:
Change order statuses to: Pending, Processing, Completed, Cancelled
Update point rule: 1 point per Rp10,000 (FLOOR(total_amount / 10000))
Update tier thresholds: Bronze 0-499, Silver 500-1499, Gold 1500-2999, Platinum 3000+
Update tier_config INSERT to match new thresholds
Add full_name column alias or keep name column (already exists as name VARCHAR(255))
Ensure all tables have created_at and updated_at audit columns (already present)
Keep all existing RLS policies, triggers, and indexes (adjust for new status names)
Files modified: docs/database-setup.sql
Task 2: Create Supabase Client Service (src/services/supabaseClient.js)
Create a lightweight Supabase client using the official @supabase/supabase-js library (NOT the Supabase REST API pattern used in notesAPI.js). This will handle Auth and database queries consistently.
Install @supabase/supabase-js via npm
Export a singleton supabase client instance
Use the existing Supabase URL and anon key from notesAPI.js
Centralize Supabase configuration
Files created: src/services/supabaseClient.js
Packages added: @supabase/supabase-js
Task 3: Create Auth Context (src/services/AuthContext.jsx)
Create a React Context to manage authentication state globally:
Provide user, profile, loading, signOut() to the entire app
On mount: call supabase.auth.getSession() to restore session
Listen to supabase.auth.onAuthStateChange() for real-time auth events
Fetch the user's profiles row after login to get role, tier, points
Export a useAuth() hook for easy consumption
Files created: src/services/AuthContext.jsx
Task 4: Create Protected Route Component (src/components/ProtectedRoute.jsx)
Create a route guard component:
Props: children, allowedRoles (array)
If loading auth state: show <Loading />
If not authenticated: <Navigate to="/login" />
If authenticated but wrong role: redirect to appropriate dashboard based on role
Admin gets /dashboard, Member gets /member
Files created: src/components/ProtectedRoute.jsx
Task 5: Create Member Layout (src/layout/MemberLayout.jsx)
Create a layout for Member pages (distinct from Admin's MainLayout):
Reuse existing Header component for search
Create a simplified sidebar for members: Dashboard, Products (browse), My Orders, My Profile
Use the existing PageHeader component
Include <Outlet /> for child routes
Files created: src/layout/MemberLayout.jsx
Task 6: Create API Service Layer
Create service modules to abstract all Supabase queries:
6a: src/services/profilesAPI.js
fetchProfile(id) - get single profile
fetchAllProfiles() - admin: get all profiles
updateProfile(id, data) - update profile fields
deleteProfile(id) - soft delete (set deleted_at)
6b: src/services/productsAPI.js
fetchProducts() - get all active products (deleted_at IS NULL)
fetchProductById(id) - get single product
createProduct(data, userId) - admin: insert product
updateProduct(id, data) - admin: update product
deleteProduct(id) - admin: soft delete
6c: src/services/ordersAPI.js
fetchOrders() - admin: all orders; member: own orders
fetchOrderById(id) - get order with items
createOrder(orderData, items) - member: create order + items in transaction
updateOrderStatus(id, status) - admin: change status
fetchMemberOrders(memberId) - member: own order history
6d: src/services/dashboardAPI.js
fetchAdminDashboard() - aggregate stats (total customers, products, orders, revenue, members per tier)
fetchMemberDashboard(memberId) - member stats (points, tier, order count, recent orders)
Files created: src/services/profilesAPI.js, src/services/productsAPI.js, src/services/ordersAPI.js, src/services/dashboardAPI.js
Task 7: Update Auth Pages
7a: Update Login.jsx (src/pages/Auth/Login.jsx)
Replace DummyJSON API call with supabase.auth.signInWithPassword()
After success, fetch profile to determine role
Redirect Admin to /dashboard, Member to /member
Keep existing UI structure and styling
7b: Update Register.jsx (src/pages/Auth/Register.jsx)
Add controlled form state with handleChange
Add full_name input field
Call supabase.auth.signUp() with email, password, and data: { name } metadata
Profile auto-created via existing DB trigger (handle_new_user)
Show success message, redirect to login
Keep existing UI styling
7c: Update Forgot.jsx (src/pages/Auth/Forgot.jsx)
Add controlled form state
Call supabase.auth.resetPasswordForEmail()
Show success/error feedback
Keep existing UI styling
Files modified: src/pages/Auth/Login.jsx, src/pages/Auth/Register.jsx, src/pages/Auth/Forgot.jsx
Task 8: Create Member Pages
8a: Member Dashboard (src/pages/Member/MemberDashboard.jsx)
Display:
Member name, email
Current tier and points (with progress bar to next tier)
Total orders count
Recent 5 orders table
Tier discount info
8b: Member Products (src/pages/Member/MemberProducts.jsx)
Browse products (read-only grid/table from Supabase)
"Add to Cart" / "Order" button for each product
Stock availability indicator
8c: Create Order (src/pages/Member/CreateOrder.jsx)
Product selection with quantity
Auto-calculate total (apply tier discount)
Stock validation (cannot order more than available)
Submit creates order + order_items via Supabase
8d: Order History (src/pages/Member/OrderHistory.jsx)
Table of member's own orders (fetched via RLS-filtered query)
Show order ID, date, items summary, total, status, points earned
Click to expand order details
8e: Member Profile (src/pages/Member/MemberProfile.jsx)
View and edit own profile (name, phone, city)
Display points history from points_transactions table
Tier progression info
Files created: src/pages/Member/MemberDashboard.jsx, src/pages/Member/MemberProducts.jsx, src/pages/Member/CreateOrder.jsx, src/pages/Member/OrderHistory.jsx, src/pages/Member/MemberProfile.jsx
Task 9: Update App.jsx Routing and Data Flow
Major refactor of src/App.jsx:
Wrap app in <AuthProvider> from AuthContext
Remove in-memory orders/customers state and all handler functions
Add role-based route groups:
Auth routes (public): /login, /register, /forgot -- redirect to dashboard if already logged in
Admin routes (ProtectedRoute with role=['admin']): /dashboard, /customers, /products, /products/:id, /orders
Member routes (ProtectedRoute with role=['member']): /member, /member/products, /member/orders, /member/orders/new, /member/profile
Public routes: Product catalog view accessible to guests
Preserved routes (auth required but any role): /notes, /components, /fiturxyz
Update MainLayout props to receive data from Supabase instead of in-memory state
Dashboard page receives Supabase-fetched stats
Files modified: src/App.jsx, src/main.jsx
Task 10: Update Admin Pages for Supabase Integration
10a: Update Dashboard.jsx (src/pages/Main/Dashboard.jsx)
Replace props-based data with Supabase queries via dashboardAPI
Fetch admin stats: total customers, total products, total orders, total revenue, members per tier
Show recent orders from Supabase
Keep existing StatCard component and visual layout
10b: Update Customers.jsx (src/pages/Main/Customers.jsx)
Full CRUD: fetch from profilesAPI, add form, edit, delete
Validate email uniqueness, required name
Display in existing card grid format
Add edit/delete buttons per customer card
10c: Update Orders.jsx (src/pages/Main/Orders.jsx)
Fetch orders from ordersAPI (with order_items joined)
Admin can change order status (Pending -> Processing -> Completed / Cancelled)
Remove the "Add Order" form (orders are created by members only)
Display order items detail on expand
10d: Update Products.jsx (src/pages/Main/Products.jsx)
Fetch from productsAPI instead of JSON file
Admin CRUD: add form, edit, delete
Keep existing table layout with search/filter
Validate: name required, price > 0, stock >= 0
10e: Update ProductDetail.jsx (src/pages/Main/ProductDetail.jsx)
Fetch single product from productsAPI by UUID
Admin: show edit/delete actions
Keep existing 2-column layout
Files modified: src/pages/Main/Dashboard.jsx, src/pages/Main/Customers.jsx, src/pages/Main/Orders.jsx, src/pages/Main/Products.jsx, src/pages/Main/ProductDetail.jsx
Task 11: Update Sidebar for Role-Aware Navigation
Modify src/components/Sidebar.jsx:
Accept userRole prop from AuthContext
Admin sidebar: Dashboard, Orders, Customers, Products, Notes, Components, Fitur XYZ
Member sidebar: Dashboard, Browse Products, My Orders, My Profile
Use getMenuPath() to return correct paths per role
Preserve existing styling and icon system
Files modified: src/components/Sidebar.jsx
Task 12: Update MainLayout for Auth Integration
Modify src/layout/MainLayout.jsx:
Accept and display logged-in user info in Header
Add logout button functionality via useAuth().signOut()
Pass role-aware menu items to Sidebar
Files modified: src/layout/MainLayout.jsx, src/components/Header.jsx
Task 13: Verification and Testing
Verify SQL runs without errors on Supabase (manual step by user)
Test auth flow: Register -> Login -> Role-based redirect
Test Admin CRUD on all entities
Test Member: browse products, create order, view history, check points
Test RLS: Member cannot access admin routes, cannot see other members' orders
Test tier auto-update on order completion
Test stock decrease on order creation and revert on cancellation
Verify Notes, Components, FiturXYZ pages still work unchanged
Execution Order
Task 1  (SQL update)          -- Must be done FIRST, run on Supabase before coding
Task 2  (Supabase client)     -- Foundation for all API calls
Task 3  (AuthContext)          -- Auth state management
Task 4  (ProtectedRoute)      -- Route guards
Task 5  (MemberLayout)        -- Member UI shell
Task 6  (API services)        -- Data layer
Task 7  (Auth pages)          -- Login/Register/Forgot
Task 8  (Member pages)        -- Member features
Task 9  (App.jsx routing)     -- Wire everything together
Task 10 (Admin pages)         -- Supabase-backed CRUD
Task 11 (Sidebar update)      -- Role-aware nav
Task 12 (MainLayout update)   -- Auth in header
Task 13 (Verification)        -- Final checks
Files Summary
Action	Files
Create	src/services/supabaseClient.js, src/services/AuthContext.jsx, src/services/profilesAPI.js, src/services/productsAPI.js, src/services/ordersAPI.js, src/services/dashboardAPI.js, src/components/ProtectedRoute.jsx, src/layout/MemberLayout.jsx, src/pages/Member/MemberDashboard.jsx, src/pages/Member/MemberProducts.jsx, src/pages/Member/CreateOrder.jsx, src/pages/Member/OrderHistory.jsx, src/pages/Member/MemberProfile.jsx
Modify	docs/database-setup.sql, src/App.jsx, src/main.jsx, src/pages/Auth/Login.jsx, src/pages/Auth/Register.jsx, src/pages/Auth/Forgot.jsx, src/pages/Main/Dashboard.jsx, src/pages/Main/Customers.jsx, src/pages/Main/Orders.jsx, src/pages/Main/Products.jsx, src/pages/Main/ProductDetail.jsx, src/components/Sidebar.jsx, src/layout/MainLayout.jsx, src/components/Header.jsx
Untouched	src/pages/Main/Note.jsx, src/pages/Main/Components.jsx, src/pages/Main/FiturXyz.jsx, src/pages/Main/NotFound.jsx, src/services/notesAPI.js, src/components/AlertBox.jsx, src/components/GenericTable.jsx, src/components/LoadingSpinner.jsx, src/components/EmptyState.jsx, src/components/Button.jsx, src/components/Badge.jsx, src/components/Avatar.jsx, src/components/Card.jsx, src/components/Container.jsx, src/components/Footer.jsx, src/components/Table.jsx, src/components/ProductCard.jsx, src/components/PageHeader.jsx, src/components/Loading.jsx