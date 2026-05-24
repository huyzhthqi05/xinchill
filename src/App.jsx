import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth } from './firebase';

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

export default function QuanNuocPOS() {
  const [user, setUser] = useState(null);

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const [loading, setLoading] = useState(true);
const getUserDocRef = (name) => {
  if (!user) return null;
  return doc(db, 'users', user.uid, 'pos', name);
};
  // Quản lý Tab hiển thị ở mục bên trái (Mặc định hiện Tab 'order' - Menu món ăn)
  const [activeTab, setActiveTab] = useState('order');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  // Quản lý trạng thái thực tế của 6 bàn (Mỗi bàn có một mảng currentOrders riêng biệt)
const [tables, setTables] = useState(() => {
  return [
    { id: 1, status: 'empty', total: 0, currentOrders: [] },
    { id: 2, status: 'empty', total: 0, currentOrders: [] },
    { id: 3, status: 'empty', total: 0, currentOrders: [] },
    { id: 4, status: 'empty', total: 0, currentOrders: [] },
    { id: 5, status: 'empty', total: 0, currentOrders: [] },
    { id: 6, status: 'empty', total: 0, currentOrders: [] },
    { id: 7, status: 'empty', total: 0, currentOrders: [] },
    { id: 8, status: 'empty', total: 0, currentOrders: [] },
    { id: 9, status: 'empty', total: 0, currentOrders: [] },
    { id: 10, status: 'empty', total: 0, currentOrders: [] },
    { id: 11, status: 'empty', total: 0, currentOrders: [] },
    { id: 12, status: 'empty', total: 0, currentOrders: [] },
    { id: 13, status: 'empty', total: 0, currentOrders: [] },
    { id: 14, status: 'empty', total: 0, currentOrders: [] },
    { id: 15, status: 'empty', total: 0, currentOrders: [] },
    { id: 16, status: 'empty', total: 0, currentOrders: [] },
    { id: 17, status: 'empty', total: 0, currentOrders: [] },
    { id: 18, status: 'empty', total: 0, currentOrders: [] },
    { id: 19, status: 'empty', total: 0, currentOrders: [] },
    { id: 20, status: 'empty', total: 0, currentOrders: [] },
  ];
});

  // Quản lý xem nhân viên đang chọn xem và thao tác cho bàn số mấy
  const [selectedTableId, setSelectedTableId] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Quản lý giỏ hàng TẠM THỜI đang bấm trên màn hình (trước khi ấn Lưu tạm)
  const [currentCart, setCurrentCart] = useState([]);
  const [firestoreLoaded, setFirestoreLoaded] = useState(false);
  const [showCartBubble, setShowCartBubble] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState('');

  // Menu món ăn cố định của quán
  const categories = ['Tất cả', 'Nước ép', 'Sinh tố', 'Sữa chua', 'Trà', 'Ăn vặt'];
  const [selectedMenuCategory, setSelectedMenuCategory] = useState('Tất cả');

  const menu = [
    { id: 'm1', name: 'Nước ép Cà Chua M', price: 15000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm2', name: 'Nước ép Cà Chua L', price: 20000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm3', name: 'Nước ép Cà Rốt M', price: 15000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm4', name: 'Nước ép Cà Rốt L', price: 20000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm5', name: 'Nước ép Ổi M', price: 15000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm6', name: 'Nước ép Ổi L', price: 20000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm7', name: 'Nước ép Chanh dây M', price: 15000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm8', name: 'Nước ép Chanh dây L', price: 20000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm9', name: 'Nước ép Dưa hấu M', price: 15000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm10', name: 'Nước ép Dưa hấu L', price: 20000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm11', name: 'Nước ép Cam M', price: 15000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm12', name: 'Nước ép Cam L', price: 20000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm13', name: 'Nước ép Dưa lưới M', price: 20000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm14', name: 'Nước ép Dưa lưới L', price: 25000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm15', name: 'Nước ép Thơm M', price: 20000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm16', name: 'Nước ép Thơm L', price: 25000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm17', name: 'Nước ép Táo M', price: 20000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm18', name: 'Nước ép Táo L', price: 25000, category: 'Nước ép', image: 'https://unsplash.com' },
    { id: 'm22', name: 'Sinh tố Sapoche M', price: 23000, category: 'Sinh tố', image: 'https://unsplash.com' },
    { id: 'm23', name: 'Sinh tố Sapoche L', price: 29000, category: 'Sinh tố', image: 'https://unsplash.com' },
    { id: 'm24', name: 'Sinh tố Xoài M', price: 23000, category: 'Sinh tố', image: 'https://unsplash.com' },
    { id: 'm25', name: 'Sinh tố Xoài L', price: 29000, category: 'Sinh tố', image: 'https://unsplash.com' },
    { id: 'm26', name: 'Sinh tố Bơ M', price: 23000, category: 'Sinh tố', image: 'https://unsplash.com' },
    { id: 'm27', name: 'Sinh tố Bơ L', price: 29000, category: 'Sinh tố', image: 'https://unsplash.com' },
    { id: 'm28', name: 'Sinh tố Việt quất M', price: 23000, category: 'Sinh tố', image: 'https://unsplash.com' },
    { id: 'm29', name: 'Sinh tố Việt quất L', price: 29000, category: 'Sinh tố', image: 'https://unsplash.com' },
    { id: 'm30', name: 'Sinh tố Mãng cầu M', price: 23000, category: 'Sinh tố', image: 'https://unsplash.com' },
    { id: 'm31', name: 'Sinh tố Mãng cầu L', price: 29000, category: 'Sinh tố', image: 'https://unsplash.com' },
    { id: 'm32', name: 'Sinh tốDâu tây M', price: 23000, category: 'Sinh tố', image: 'https://unsplash.com' },
    { id: 'm33', name: 'Sinh tố Dâu tây L', price: 29000, category: 'Sinh tố', image: 'https://unsplash.com' },
    { id: 'm34', name: 'Sữa chua Chanh đá M', price: 17000, category: 'Sữa chua', image: 'https://unsplash.com' },
    { id: 'm35', name: 'Sữa chua Chanh đá L', price: 22000, category: 'Sữa chua', image: 'https://unsplash.com' },
    { id: 'm36', name: 'Sữa chua Việt quất M', price: 22000, category: 'Sữa chua', image: 'https://unsplash.com' },
    { id: 'm37', name: 'Sữa chua Việt quất L', price: 27000, category: 'Sữa chua', image: 'https://unsplash.com' },
    { id: 'm38', name: 'Sữa chua Xoài M', price: 22000, category: 'Sữa chua', image: 'https://unsplash.com' },
    { id: 'm39', name: 'Sữa chua Xoài L', price: 27000, category: 'Sữa chua', image: 'https://unsplash.com' },
    { id: 'm40', name: 'Sữa chua Dâu M', price: 22000, category: 'Sữa chua', image: 'https://unsplash.com' },
    { id: 'm41', name: 'Sữa chua Dâu L', price: 27000, category: 'Sữa chua', image: 'https://unsplash.com' },
    { id: 'm42', name: 'Sữa chua Đào M', price: 22000, category: 'Sữa chua', image: 'https://unsplash.com' },
    { id: 'm43', name: 'Sữa chua Đào L', price: 27000, category: 'Sữa chua', image: 'https://unsplash.com' },
    { id: 'm44', name: 'Trà chanh M', price: 15000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm45', name: 'Trà chanh L', price: 20000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm46', name: 'Trà tắc M', price: 15000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm47', name: 'Trà tắc L', price: 20000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm48', name: 'Trà đào M', price: 17000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm49', name: 'Trà đào L', price: 22000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm50', name: 'Trà dâu M', price: 17000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm51', name: 'Trà dâu L', price: 22000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm52', name: 'Trà mãng cầu M', price: 17000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm53', name: 'Trà mãng cầu L', price: 22000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm54', name: 'Trà mận M', price: 17000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm55', name: 'Trà mận L', price: 22000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm56', name: 'Trà Atiso M', price: 17000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm57', name: 'Trà Atiso L', price: 22000, category: 'Trà', image: 'https://unsplash.com' },
    { id: 'm58', name: 'Chân gà sốt Thái M', price: 49000, category: 'Ăn vặt', image: 'https://unsplash.com' },
    { id: 'm59', name: 'Chân gà sốt Thái L', price: 69000, category: 'Ăn vặt', image: 'https://unsplash.com' },
    { id: 'm60', name: 'Chân gà sốt Thái mix trứng non M', price: 59000, category: 'Ăn vặt', image: 'https://unsplash.com' },
    { id: 'm61', name: 'Chân gà sốt Thái mix trứng non L', price: 79000, category: 'Ăn vặt', image: 'https://unsplash.com' },
    { id: 'm62', name: 'Ram nướng Bình Định', price: 6000, category: 'Ăn vặt', image: 'https://unsplash.com' },
    { id: 'm63', name: 'Bento', price: 12000, category: 'Ăn vặt', image: 'https://unsplash.com' },
    { id: 'm64', name: 'Hạt hướng dương', price: 10000, category: 'Ăn vặt', image: 'https://unsplash.com' },
    { id: 'm65', name: 'Hạt dưa', price: 12000, category: 'Ăn vặt', image: 'https://unsplash.com' },
    { id: 'm66', name: 'Bánh tráng trộn', price: 12000, category: 'Ăn vặt', image: 'https://unsplash.com' },
  ];

  // Quản lý từ khóa tìm kiếm món ăn
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc danh sách món ăn theo từ khóa tìm kiếm và danh mục
  const filteredMenu = menu.filter(drink => {
    const matchesSearch = drink.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedMenuCategory === 'Tất cả' || drink.category === selectedMenuCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedMenuByCategory = categories
    .filter(category => category !== 'Tất cả')
    .map(category => ({
      category,
      items: menu.filter(drink => drink.category === category && drink.name.toLowerCase().includes(searchTerm.toLowerCase())),
    }));

  // DOANH THU VÀ SỐ ĐƠN THỰC TẾ CỦA QUÁN
  const [realRevenue, setRealRevenue] = useState(0);
  const [realOrderCount, setRealOrderCount] = useState(0);

  const [orderHistory, setOrderHistory] = useState({});
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);
  const [editingTableId, setEditingTableId] = useState(null);
  const [editingTableId, setEditingTableId] = useState(null);

  // Lưu lịch sử doanh thu theo ngày vào localStorage
  const getTodayKey = () => {
    return new Date().toLocaleDateString('en-CA');};

  const [allStats, setAllStats] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDay, setCurrentDay] = useState(getTodayKey());

  useEffect(() => {
  if (!user) return;

  try {
    const appStateRef = doc(db, 'users', user.uid, 'pos', 'appState');
    const statsRef = doc(db, 'users', user.uid, 'pos', 'allStats');
    const historyRef = doc(db, 'users', user.uid, 'pos', 'orderHistory');

    const unsubApp = onSnapshot(appStateRef, (snap) => {
  if (snap.exists()) {
    const data = snap.data();

    if (data.tables) {
      setTables(data.tables);
    }
  }

  setFirestoreLoaded(true);
});

    const unsubStats = onSnapshot(statsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const stats = data.stats || {};

        setAllStats(stats);

        const todayKey = getTodayKey();
        const todayStats = stats[todayKey] || {
          revenue: 0,
          orders: 0
        };

        setRealRevenue(todayStats.revenue || 0);
        setRealOrderCount(todayStats.orders || 0);
      }
    });

    const unsubHistory = onSnapshot(historyRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setOrderHistory(data.history || {});
      }
    });

    return () => {
      unsubApp();
      unsubStats();
      unsubHistory();
    };

  } catch (e) {
    console.warn('Firestore listeners failed', e);
  }
}, [user]);

useEffect(() => {
  const table = tables.find(t => t.id === selectedTableId);

  if (table) {
    setCurrentCart(table.currentOrders || []);
  }
}, [selectedTableId, tables]);

  // HÀM CLICK CHỌN BÀN: Hiển thị lại những món đã lưu trước đó của bàn này lên giỏ hàng
  const handleSelectTable = (tableId) => {
    setSelectedTableId(tableId);
    setEditingTableId(null);
    const targetTable = tables.find(t => t.id === tableId);
    if (targetTable) {
      setCurrentCart(targetTable.currentOrders);
    }
  };

  const handleGoToCheckout = (tableId) => {
  const targetTable = tables.find(t => t.id === tableId);

  if (!targetTable || targetTable.currentOrders.length === 0) {
    alert("Bàn này chưa có món để thanh toán!");
    return;
  }

  setSelectedTableId(tableId);
  setCurrentCart(targetTable.currentOrders);

  setTimeout(() => {
    document
      .getElementById('cart-section')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  }, 100);
};  

  // Hàm Thêm món từ Menu vào Giỏ hàng tạm thời
  const handleAddToOrder = (drink) => {
    const selectedTable = tables.find(t => t.id === selectedTableId);

if (selectedTable?.status === 'busy' && editingTableId !== selectedTableId) {
  alert(`Bàn ${selectedTableId} đã được order. Muốn thay đổi hãy bấm Chỉnh sửa!`);
  return;
}
  const existingItem = currentCart.find(order => order.id === drink.id);

  if (existingItem) {
    setCurrentCart(currentCart.map(order =>
      order.id === drink.id
        ? {
            ...order,
            qty: order.qty + 1,
            price: (order.qty + 1) * drink.price
          }
        : order
    ));
  } else {
    setCurrentCart([
      ...currentCart,
      {
        id: drink.id,
        item: drink.name,
        qty: 1,
        price: drink.price,
        originPrice: drink.price,
        note: ''
      }
    ]);
  }
  setLastAddedItem(drink.name);
setShowCartBubble(true);
setFlyingItem({
  name: drink.name,
  id: Date.now()
});

setTimeout(() => {
  setFlyingItem(null);
}, 900);

};

  // Hàm Tăng/Giảm số lượng món trong giỏ hàng tạm thời
  const handleUpdateQty = (id, change) => {
    setCurrentCart(currentCart.map(order => {
      if (order.id === id) {
        const newQty = order.qty + change;
        if (newQty <= 0) return null;
        return { ...order, qty: newQty, price: newQty * order.originPrice };
      }
      return order;
    }).filter(Boolean));
  };

  // TÍNH NĂNG 1: LƯU TẠM VÀO BÀN ĐÃ CHỌN
  const saveTablesToFirestore = async (updatedTables) => {
  if (!user) return;

  const ref = doc(
    db,
    'users',
    user.uid,
    'pos',
    'appState'
  );

  await setDoc(
    ref,
    {
      tables: updatedTables,
      lastUpdated: serverTimestamp()
    },
    { merge: true }
  );
};


const deleteHistoryFromFirestore = async () => {
  if (!user) return;

  try {
    const historyRef = doc(
      db,
      'users',
      user.uid,
      'pos',
      'orderHistory'
    );

    await deleteDoc(historyRef);

    setOrderHistory({});

    alert('Đã xóa lịch sử đơn hàng!');
  } catch (e) {
    console.error(e);
    alert('Xóa thất bại!');
  }
};
  const handleSaveTemporary = () => {
    if (currentCart.length === 0) {
      alert("Giỏ hàng đang trống, không có gì để xác nhận!");
      return;
    }

    const updatedTables = tables.map(table => {

  if (table.id === selectedTableId) {

    const totalMoney = currentCart.reduce(
      (sum, item) => sum + item.price,
      0
    );

    return {
      ...table,
      status: 'busy',
      currentOrders: currentCart,
      total: totalMoney
    };

  }

  return table;

});

setTables(updatedTables);

saveTablesToFirestore(updatedTables);
setEditingTableId(null);
setShowCartBubble(false);
setCurrentCart([]);
setActiveTab('tables');

    alert(`✅ Xác nhận đơn hàng thành công cho Bàn 0${selectedTableId}!`);
  };

  // TÍNH NĂNG 2: THANH TOÁN HOÁ ĐƠN VÀ RESET BÀN VỀ TRỐNG
  const handleCheckout = () => {
    if (currentCart.length === 0) {
      alert("Bàn này không có món nào để thanh toán!");
      return;
    }

    const totalCartPrice = currentCart.reduce((sum, item) => sum + item.price, 0);
    // Lưu lịch sử đơn hàng
try {
  const todayKey = getTodayKey();
  const history = { ...orderHistory };

  if (!history[todayKey]) {
    history[todayKey] = [];
  }

  history[todayKey].push({
    tableId: selectedTableId,
    total: totalCartPrice,
    items: currentCart,
    createdAt: new Date().toLocaleTimeString(),
  });

  setOrderHistory(history);
  if (user) {
  const historyRef = doc(db, 'users', user.uid, 'pos', 'orderHistory');

  setDoc(historyRef, {
    history,
    lastUpdated: serverTimestamp()
  }, { merge: true });
}
} catch (e) {
  console.log(e);
}
    
    // Cộng dồn tiền vào doanh thu tổng ngày và tăng số lượng đơn thành công
    setRealRevenue(prevRevenue => prevRevenue + totalCartPrice);
    setRealOrderCount(prevCount => prevCount + 1);

    // Cập nhật lưu trữ theo ngày
    try {
      const all = { ...allStats };
      const todayKey = getTodayKey();
      const existing = all[todayKey] || { revenue: 0, orders: 0 };
      const updated = { revenue: (existing.revenue || 0) + totalCartPrice, orders: (existing.orders || 0) + 1 };
      all[todayKey] = updated;
      setAllStats(all);
      // cập nhật summary ngay lập tức
      setRealRevenue(updated.revenue);
      setRealOrderCount(updated.orders);
      // write stats to Firestore (merge)
      if (db && user) {
        try {
          const statsRef = doc(db, 'users', user.uid, 'pos', 'allStats');
          setDoc(statsRef, { stats: all, lastUpdated: serverTimestamp() }, { merge: true }).catch(() => {});
        } catch (e) { console.warn('Failed to write stats to Firestore', e); }
      }
    } catch (e) {}

    alert(`💵 Thanh toán thành công Bàn 0${selectedTableId}: ${totalCartPrice.toLocaleString()}đ!`);
    
    // Khởi tạo lại bàn này về trạng thái Trống (Màu xanh), xóa sạch món đã lưu của bàn này
    const updatedTables = tables.map(table =>
  table.id === selectedTableId
    ? { ...table, status: 'empty', total: 0, currentOrders: [] }
    : table
);

setTables(updatedTables);
saveTablesToFirestore(updatedTables);

    // Xóa sạch giỏ hàng hiển thị bên phải
    setCurrentCart([]);
  };

    // Sync tables to Firestore when changed
    // Sync tables to Firestore when changed
// Sync tables to Firestore when changed

  // Tính tổng tiền tự động hiển thị ở chân giỏ hàng bên phải
  const totalCartPrice = currentCart.reduce((sum, order) => sum + order.price, 0);
  const totalCartItems = currentCart.reduce((sum, order) => sum + order.qty, 0);

  const getStatusColor = (status) => {
    return status === 'busy' ? 'bg-orange-500' : 'bg-green-500';
  };

  const getStatusText = (status) => {
    return status === 'busy' ? 'Đang dùng' : 'Trống';
  };

  const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert("Sai email hoặc mật khẩu!");
  }
};

const handleLogout = async () => {
  await signOut(auth);
};

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Đang tải...
    </div>
  );
}

if (!user) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
          ☕ XinChill POS
        </h1>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email đăng nhập"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-2xl px-4 py-3"
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-2xl px-4 py-3"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-green-600 text-white rounded-2xl py-3 font-semibold"
          >
            Đăng nhập
          </button>

        </div>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-slate-100 p-4">

  {/* Nút menu mobile */}
  <button
    onClick={() => setIsMenuOpen(true)}
    className="lg:hidden fixed top-4 left-4 z-50 bg-green-900 text-white rounded-xl px-4 py-3 shadow-lg"
  >
    ☰
  </button>
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4">

        {/* Sidebar Bên Trái - Có thể bấm nút để đổi qua lại thao tác */}
        <div className={`
  fixed lg:static
  top-0 left-0
  h-screen lg:h-auto
  w-72 lg:w-auto
  z-50
  bg-green-900 text-white
  rounded-r-3xl lg:rounded-3xl
  p-6 shadow-xl
  transform transition-transform duration-300
  ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
  lg:translate-x-0
  lg:col-span-2
`}>
          <h1 className="text-3xl font-bold mb-10 text-center">☕ XinChill</h1>
          <button
  onClick={() => setIsMenuOpen(false)}
  className="lg:hidden absolute top-4 right-4 text-2xl"
>
  ✕
</button>
          <button
  onClick={handleLogout}
  className="w-full bg-red-500 rounded-2xl p-3 mb-4 font-semibold"
>
  Đăng xuất
</button>
          <div className="space-y-4">
            <button 
              onClick={() => {
  setActiveTab('order');
  setIsMenuOpen(false);
}}
              className={`w-full rounded-2xl p-4 text-left font-semibold transition ${activeTab === 'order' ? 'bg-green-600 shadow-md' : 'hover:bg-green-800'}`}
            >
              🧾 Order
            </button>
            <button 
              onClick={() => {
  setActiveTab('tables');
  setIsMenuOpen(false);
}}
              className={`w-full rounded-2xl p-4 text-left font-semibold transition ${activeTab === 'tables' ? 'bg-green-600 shadow-md' : 'hover:bg-green-800'}`}
            >
              🪑 Sơ đồ bàn
            </button>
            <button onClick={() => {
  setActiveTab('orders');
  setIsMenuOpen(false);
}} className={`w-full rounded-2xl p-4 text-left font-semibold transition ${activeTab === 'orders' ? 'bg-green-600 shadow-md' : 'hover:bg-green-800'}`}>
              📦 Đơn hàng
            </button>
            <button onClick={() => {
  setActiveTab('history');
  setIsMenuOpen(false);
}} className={`w-full rounded-2xl p-4 text-left font-semibold transition ${activeTab === 'history' ? 'bg-green-600 shadow-md' : 'hover:bg-green-800'}`}>
              📜 Lịch sử đơn
            </button>
            
            <button onClick={() => {
  setActiveTab('revenue');
  setIsMenuOpen(false);
}} className={`w-full rounded-2xl p-4 text-left font-semibold transition ${activeTab === 'revenue' ? 'bg-green-600 shadow-md' : 'hover:bg-green-800'}`}>
              📊 Doanh thu
            </button>
            <button className="w-full hover:bg-green-800 rounded-2xl p-4 text-left opacity-60">⚙️ Cài đặt</button>
          </div>
        </div>

{isMenuOpen && (
  <div
    onClick={() => setIsMenuOpen(false)}
    className="lg:hidden fixed inset-0 bg-black/40 z-40"
  />
)}

        {/* Khu vực nội dung chính ở giữa */}
        <div className={`${activeTab === 'revenue' ? 'w-full lg:col-span-10' : 'w-full lg:col-span-7'} space-y-4`}>
          {/* Bảng hiển thị Doanh thu tổng */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <p className="text-slate-500">Doanh thu hôm nay</p>
              <h2 className="text-3xl font-bold mt-2 text-green-700">
                {realRevenue.toLocaleString()}đ
              </h2>
            </div>
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <p className="text-slate-500">Số đơn thành công</p>
              <h2 className="text-3xl font-bold mt-2">
                {realOrderCount} đơn
              </h2>
            </div>
          </div>

          {/* TAB Doanh thu: lịch sử theo ngày */}
          {/* TAB LỊCH SỬ ĐƠN HÀNG */}
{activeTab === 'history' && (
  <div className="bg-white rounded-3xl p-5 shadow-sm">
    <button
  onClick={deleteHistoryFromFirestore}
  className="bg-red-500 text-white px-4 py-2 rounded-xl mb-4"
>
  🗑 Xóa toàn bộ lịch sử
</button>
    <h2 className="text-2xl font-bold mb-4">
      Lịch sử đơn hàng
    </h2>

    <div className="grid grid-cols-3 gap-4">
      
      {/* DANH SÁCH NGÀY */}
      <div className="col-span-1">
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {Object.keys(orderHistory).length === 0 && (
            <p className="text-slate-500">
              Chưa có lịch sử đơn hàng
            </p>
          )}

          {Object.keys(orderHistory)
            .sort((a, b) => b.localeCompare(a))
            .map(dateKey => (
              <button
                key={dateKey}
                onClick={() => setSelectedHistoryDate(dateKey)}
                className={`w-full text-left p-3 rounded-2xl border transition ${
                  selectedHistoryDate === dateKey
                    ? 'bg-green-50 border-green-300'
                    : 'bg-slate-50'
                }`}
              >
                <div className="font-semibold">
                  {new Date(dateKey).toLocaleDateString()}
                </div>

                <div className="text-sm text-slate-500">
                  {orderHistory[dateKey].length} đơn
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* CHI TIẾT ĐƠN */}
      <div className="col-span-2">
        {!selectedHistoryDate ? (
          <div className="p-5 text-slate-500">
            Chọn ngày để xem lịch sử đơn
          </div>
        ) : (
          <div className="space-y-4">
            {orderHistory[selectedHistoryDate]
              .slice()
              .reverse()
              .map((order, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">
                        Bàn {order.tableId}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {order.createdAt}
                      </p>
                    </div>

                    <div className="text-green-700 font-bold text-xl">
                      {order.total.toLocaleString()}đ
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.item} x{item.qty}
                        </span>

                        <span>
                          {item.price.toLocaleString()}đ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}
          {activeTab === 'revenue' && (
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Lịch sử doanh thu theo ngày</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {Object.keys(allStats).length === 0 && <p className="text-slate-500">Chưa có dữ liệu doanh thu.</p>}
                    {Object.keys(allStats).sort((a,b)=>b.localeCompare(a)).map(dateKey => (
                      <div key={dateKey} className={`p-3 rounded-xl cursor-pointer border ${selectedDate === dateKey ? 'bg-green-50 border-green-200' : 'bg-slate-50'}`}>
                        <div className="flex justify-between items-center">
                          <button onClick={() => setSelectedDate(dateKey)} className="text-left">
                            <div className="font-semibold">{new Date(dateKey).toLocaleDateString()}</div>
                            <div className="text-sm text-slate-500">{(allStats[dateKey].orders || 0)} đơn • {(allStats[dateKey].revenue || 0).toLocaleString()}đ</div>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full lg:col-span-2">
                  {!selectedDate ? (
                    <div className="p-6 text-slate-600">Chọn ngày bên trái để xem chi tiết doanh thu.</div>
                  ) : (
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold">Chi tiết: {new Date(selectedDate).toLocaleDateString()}</h3>
                        <div className="text-sm text-slate-500">{allStats[selectedDate].orders || 0} đơn</div>
                      </div>
                      <div className="mt-4 bg-slate-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-700">{(allStats[selectedDate].revenue || 0).toLocaleString()}đ</div>
                        <div className="text-sm text-slate-500 mt-2">Tổng doanh thu</div>
                      </div>
                      <div className="mt-4">
                        <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(allStats[selectedDate])); alert('Đã copy dữ liệu sang clipboard'); }} className="bg-slate-200 px-4 py-2 rounded-lg mr-2">Sao chép JSON</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: HIỂN THỊ MENU GỌI MÓN */}
          {activeTab === 'order' && (
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Menu quán nước</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedMenuCategory(category)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedMenuCategory === category ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                <input 
                  className="border rounded-2xl px-4 py-2 w-full md:w-72" 
                  placeholder="Tìm món..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {selectedMenuCategory === 'Tất cả' ? (
                groupedMenuByCategory.map(group => (
                  <div key={group.category} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">{group.category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {group.items.length === 0 ? (
                        <p className="text-slate-500">Không có món phù hợp.</p>
                      ) : (
                        group.items.map((drink, index) => (
                          <div key={drink.id} className="bg-slate-50 rounded-3xl overflow-hidden border hover:shadow-lg transition">
                            <img src={drink.image} className="h-32 sm:h48 w-full object-cover" alt={drink.name} />
                            <div className="p-4">
                              <h3 className="font-bold text-xl">{drink.name}</h3>
                              <div className="flex justify-between items-center mt-3">
                                <p className="text-green-700 font-bold text-lg">{drink.price.toLocaleString()}đ</p>
                                <button 
                                  onClick={() => handleAddToOrder(drink)}
                                  className="bg-green-600 text-white rounded-xl px-4 py-2 hover:bg-green-700 active:scale-95 transition"
                                >
                                  + Thêm
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-2 gap-5">
                  {filteredMenu.length === 0 ? (
                    <p className="text-slate-500">Không có món phù hợp.</p>
                  ) : (
                    filteredMenu.map((drink, index) => (
                      <div key={drink.id} className="bg-slate-50 rounded-3xl overflow-hidden border hover:shadow-lg transition">
                        <img src={drink.image} className="h-32 sm:h48 w-full object-cover" alt={drink.name} />
                        <div className="p-4">
                          <h3 className="font-bold text-xl">{drink.name}</h3>
                          <div className="flex justify-between items-center mt-3">
                            <p className="text-green-700 font-bold text-lg">{drink.price.toLocaleString()}đ</p>
                            <button 
                              onClick={() => handleAddToOrder(drink)}
                              className="bg-green-600 text-white rounded-xl px-4 py-2 hover:bg-green-700 active:scale-95 transition"
                            >
                              + Thêm
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2 HOẶC PHẦN DƯỚI: HIỂN THỊ SƠ ĐỒ BÀN KHÁCH */}
          {(activeTab === 'tables' || activeTab === 'order') && (
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <h2 className="text-2xl font-bold mb-5">Sơ đồ bàn quản lý</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tables.map((table) => (
                  <div 
                    key={table.id} 
                    onClick={() => handleSelectTable(table.id)}
                    className={`bg-slate-50 rounded-3xl p-5 border hover:shadow-md cursor-pointer transition ${selectedTableId === table.id ? 'border-green-600 ring-2 ring-green-100' : 'border-slate-200'}`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">Bàn {table.id}</h3>
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(table.status)}`}></div>
                    </div>
                    <p className="text-slate-500 mt-2">{getStatusText(table.status)}</p>
                    <h4 className="font-bold text-green-700 mt-4 text-xl">
                      {table.total.toLocaleString()}đ
                    </h4>
                    {table.status === 'busy' && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleGoToCheckout(table.id);
    }}
    className="
      mt-3
      w-full
      bg-orange-500
      text-white
      rounded-xl
      py-2
      text-sm
      font-semibold
      hover:bg-orange-600
    "
  >
    💵 Thanh toán
  </button>
)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Giỏ Đơn Hàng bên phải (ẩn khi xem tab Doanh thu) */}
        {activeTab !== 'revenue' && activeTab !== 'history' && (
          <div
  id="cart-section"
  className="w-full lg:col-span-3 bg-white rounded-3xl p-4 lg:p-5 shadow-sm h-fit lg:sticky lg:top-4"
>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Đơn hàng</h2>
            <select
  value={selectedTableId}
  onChange={(e) => setSelectedTableId(Number(e.target.value))}
  className={`px-4 py-2 rounded-full font-bold outline-none cursor-pointer
    ${
      tables.find(t => t.id === selectedTableId)?.status === 'busy'
        ? 'bg-orange-500 text-white'
        : 'bg-green-100 text-green-700'
    }
  `}
>
  {tables.map((table) => (
    <option key={table.id} value={table.id}>
      Bàn {table.id < 10 ? `0${table.id}` : table.id}
      {table.status === 'busy' ? ' 🔥' : ''}
    </option>
  ))}
</select>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {currentCart.map((order, index) => (
              <div key={index} className="border rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-sm">{order.item}</h3>
                  <p className="text-slate-500 text-xs">SL: {order.qty}</p>
                  <input
                  disabled={
  tables.find(t => t.id === selectedTableId)?.status === 'busy' &&
  editingTableId !== selectedTableId
                  }
                    className="mt-2 w-full border rounded-lg px-2 py-1 text-xs"
                    placeholder="Ghi chú: ít đá, ít đường..."
                    value={order.note || ''}
                    onChange={(e) => {
                      const newNote = e.target.value;

                    setCurrentCart(currentCart.map(item =>
                      item.id === order.id
                        ? { ...item, note: newNote }
                        : item
                   ));
                 }}
               />
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700 text-sm">{order.price.toLocaleString()}đ</p>
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => handleUpdateQty(order.id, -1)} 
                      className="bg-slate-200 rounded-lg px-2 hover:bg-slate-300 font-bold"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => handleUpdateQty(order.id, 1)} 
                      className="bg-slate-200 rounded-lg px-2 hover:bg-slate-300 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {currentCart.length === 0 && (
              <p className="text-slate-400 text-center py-10 text-sm">Vui lòng chọn món từ Menu...</p>
            )}
          </div>

          <div className="mt-6 border-t pt-5">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Tổng tiền</span>
              <span className="text-green-700">{totalCartPrice.toLocaleString()}đ</span>
            </div>
{tables.find(t => t.id === selectedTableId)?.status === 'busy' && editingTableId !== selectedTableId && (
  <button
    onClick={() => setEditingTableId(selectedTableId)}
    className="w-full bg-orange-500 text-white rounded-2xl py-4 font-semibold mb-3"
  >
    ✏️ Chỉnh sửa đơn bàn {selectedTableId}
  </button>
)}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button 
                onClick={handleSaveTemporary}
                className="bg-slate-200 rounded-2xl py-4 font-semibold hover:bg-slate-300 transition"
              >
                ✅ Xác nhận
              </button>
              <button 
                onClick={() => {
  if (currentCart.length === 0) {
    alert("Bàn này không có món nào để thanh toán!");
    return;
  }

  setShowPaymentModal(true);
  setPaymentMethod(null);
}}
                className="bg-green-600 text-white rounded-2xl py-4 font-semibold hover:bg-green-700 transition"
              >
                💵 Thanh toán
              </button>
            </div>

            <button 
              onClick={() => alert("🖨 Đang kết nối máy in hóa đơn...")}
              className="w-full bg-orange-500 text-white rounded-2xl py-4 font-semibold mt-3 hover:bg-orange-600 transition"
            >
              🖨 In hóa đơn
            </button>
          </div>

          </div>
        )}
{showPaymentModal && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Chọn phương thức thanh toán</h2>

      {!paymentMethod && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMethod('cash')}
            className="bg-green-600 text-white rounded-2xl py-4 font-bold"
          >
            💵 Tiền mặt
          </button>

          <button
            onClick={() => setPaymentMethod('bank')}
            className="bg-blue-600 text-white rounded-2xl py-4 font-bold"
          >
            🏦 Chuyển khoản
          </button>
        </div>
      )}

      {paymentMethod === 'cash' && (
        <div className="text-center">
          <p className="text-green-700 font-bold text-xl mb-4">
            Đã nhận tiền mặt
          </p>

          <button
            onClick={() => {
              setShowPaymentModal(false);
              handleCheckout();
            }}
            className="w-full bg-green-600 text-white rounded-2xl py-4 font-bold"
          >
            ✅ Hoàn thành thanh toán
          </button>
        </div>
      )}

      {paymentMethod === 'bank' && (
        <div className="text-center">
          <p className="font-semibold mb-3">
            Quét mã QR để chuyển khoản
          </p>

          <img
  src="/qr.png.jpg"
  alt="QR chuyển khoản"
  className="w-64 h-64 object-contain mx-auto border rounded-2xl mb-4"
/>

          <p className="text-green-700 font-bold text-xl mb-4">
            Tổng tiền: {totalCartPrice.toLocaleString()}đ
          </p>

          <button
            onClick={() => {
              setShowPaymentModal(false);
              handleCheckout();
            }}
            className="w-full bg-green-600 text-white rounded-2xl py-4 font-bold"
          >
            ✅ Đã chuyển khoản - Hoàn thành
          </button>
        </div>
      )}

      <button
        onClick={() => setShowPaymentModal(false)}
        className="w-full mt-4 bg-slate-200 rounded-2xl py-3 font-semibold"
      >
        Hủy
      </button>
    </div>
  </div>
)}

{flyingItem && (
  <div className="fixed bottom-32 right-8 z-[9999] pointer-events-none">
    <div className="bg-green-500 text-white px-4 py-3 rounded-2xl shadow-2xl animate-flyToCart">
      🛒 {flyingItem.name}
    </div>
  </div>
)}

        {/* NÚT GIỎ HÀNG NỔI */}
        {currentCart.length > 0 && (
          <button
            onClick={() => {
              setActiveTab('order');

              setTimeout(() => {
                document
                  .getElementById('cart-section')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="
              fixed
              top-5
              right-5
              z-50
              bg-green-600
              text-white
              rounded-full
              shadow-xl
              px-4
              py-3
              flex
              items-center
              gap-2
              animate-bounce
            "
          >
            🛒
            <span className="font-semibold text-sm">
  {totalCartItems} món
</span>
          </button>
        )}

      </div>
    </div>
  );
}
