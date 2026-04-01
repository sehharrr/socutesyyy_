import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { OrderFlowProvider } from './context/OrderFlowContext'
import { ShopProvider } from './context/ShopContext'
import { ShopHeader } from './components/ShopHeader'
import HomePage from './pages/HomePage'
import ProductDetail from './pages/ProductDetail'
import CustomizePlaceholder from './pages/CustomizePlaceholder'
import UploadPage from './pages/UploadPage'
import CustomerFormPage from './pages/CustomerFormPage'
import PaymentPage from './pages/PaymentPage'
import ContactRedirect from './pages/ContactRedirect'
import AdminPage from './pages/AdminPage'

function AppShell() {
  const location = useLocation()
  const hideShopChrome = location.pathname.startsWith('/admin')
  return (
    <ShopProvider>
      <CartProvider>
        <OrderFlowProvider>
          <div className="relative min-h-svh bg-white">
            {!hideShopChrome && <ShopHeader />}
            <Routes>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/checkout/customer" element={<CustomerFormPage />} />
              <Route path="/checkout/payment" element={<PaymentPage />} />
              <Route path="/order/:slug/upload" element={<UploadPage />} />
              <Route path="/order/:slug/customer" element={<CustomerFormPage />} />
              <Route path="/order/:slug/payment" element={<PaymentPage />} />
              <Route path="/order/:slug/contact" element={<ContactRedirect />} />
              <Route
                path="/customize/:productId"
                element={<CustomizePlaceholder />}
              />
            </Routes>
            </div>
          </OrderFlowProvider>
        </CartProvider>
      </ShopProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
